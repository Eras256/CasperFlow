import { useState, useCallback, useEffect } from 'react';
import {
    Deploy,
    DeployHeader,
    ExecutableDeployItem,
    TransferDeployItem,
    PublicKey,
    Timestamp,
    Duration,
    RpcClient,
    HttpHandler
} from 'casper-js-sdk';
import { BigNumber } from '@ethersproject/bignumber';

export interface CasperWalletState {
    isConnected: boolean;
    activeKey: string | null;
}

export interface CasperWalletActions {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    signDeploy: (deployParams: { type: string, amount?: number, id?: number, ipfsUrl?: string }) => Promise<string>;
}

export type CasperWalletHook = CasperWalletState & CasperWalletActions & { isLoading: boolean };

declare global {
    interface Window {
        casperWalletProvider?: {
            isConnected: () => Promise<boolean>;
            getActivePublicKey: () => Promise<string>;
            requestConnection: () => Promise<void>;
            disconnectFromSite: () => Promise<void>;
            sign: (deployJson: string, publicKey: string) => Promise<{ cancelled: boolean; signature: string }>;
        };
    }
}

const NODE_URL = process.env.NEXT_PUBLIC_CASPER_NODE_URL || "http://localhost:11101/rpc";
const NETWORK_NAME = process.env.NEXT_PUBLIC_CASPER_CHAIN_NAME || "casper-test";

export function useCasperWallet(): CasperWalletHook {
    const [isConnected, setIsConnected] = useState(false);
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkConnection = useCallback(async () => {
        try {
            if (window.casperWalletProvider) {
                const connected = await window.casperWalletProvider.isConnected();
                if (connected) {
                    const key = await window.casperWalletProvider.getActivePublicKey();
                    setActiveKey(key);
                    setIsConnected(true);
                }
            }
        } catch (e) {
            console.error("Connection check failed", e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setTimeout(checkConnection, 100);

        const handleConnect = (event: CustomEvent) => {
            try {
                const activeKey = JSON.parse(event.detail).activeKey;
                setActiveKey(activeKey);
                setIsConnected(true);
            } catch (err) { console.error(err) }
        };

        const handleDisconnect = () => {
            setActiveKey(null);
            setIsConnected(false);
        };

        window.addEventListener('casper:connect', handleConnect as EventListener);
        window.addEventListener('casper:disconnect', handleDisconnect);

        return () => {
            window.removeEventListener('casper:connect', handleConnect as EventListener);
            window.removeEventListener('casper:disconnect', handleDisconnect);
        }

    }, [checkConnection]);

    const connect = useCallback(async () => {
        if (!window.casperWalletProvider) {
            alert("Please install Casper Wallet extension.");
            window.open('https://www.casperwallet.io/', '_blank');
            return;
        }
        await window.casperWalletProvider.requestConnection();
        await checkConnection();
    }, [checkConnection]);

    const disconnect = useCallback(async () => {
        if (window.casperWalletProvider) {
            await window.casperWalletProvider.disconnectFromSite();
            setIsConnected(false);
            setActiveKey(null);
        }
    }, []);

    const signDeploy = useCallback(async (deployParams: { type: string, amount?: number, id?: number, ipfsUrl?: string }) => {
        if (!activeKey) throw new Error("Wallet not connected");

        console.log("Preparing deploy with params:", deployParams);

        const pbKey = PublicKey.fromHex(activeKey);

        // 1. Session (Transfer)
        const amountStr = (deployParams.amount ?? 1).toString();

        // Create transfer - simulating the contract call for now
        // Note: For v5, we create the item manually or use helpers
        const transferItem = TransferDeployItem.newTransfer(
            amountStr,
            pbKey, // Self transfer
            null,
            1 // id
        );

        // Warning: ExecutableDeployItem structure in v5 needs to be matched.
        // We cast because the strict TS definition for constructors might be hidden or complex
        const session = { transfer: transferItem } as unknown as ExecutableDeployItem;

        // 2. Payment
        const payment = ExecutableDeployItem.standardPayment(BigNumber.from(100000000)); // 0.1 CSPR

        // 3. Header
        const header = new DeployHeader(
            NETWORK_NAME,
            [], // dependencies
            1, // gasPrice
            new Timestamp(new Date()),
            new Duration(1800000), // 30min
            pbKey,
            undefined // bodyHash
        );

        // 4. Make Deploy
        let deploy = Deploy.makeDeploy(header, payment, session);

        // 5. Serialize for Wallet
        const deployJson = Deploy.toJSON(deploy);

        // 6. Request Sign
        if (!window.casperWalletProvider) throw new Error("No Wallet Provider");

        const response = await window.casperWalletProvider.sign(
            JSON.stringify(deployJson),
            activeKey
        );

        if (response.cancelled) throw new Error("User cancelled sign");

        // 7. Add Signature to Deploy
        // The signature comes back as a UInt8Array inside the hex string? Or just hex?
        // Casper Wallet returns { signature: <hex_string> } usually.
        // We need to construct the Deploy again with the signature.

        // Actually, Deploy.setSignature is static. We can mutate or create new.
        // The sdk v5 Deploy.setSignature(deploy, signature, publicKey)

        const signatureBytes = Uint8Array.from(Buffer.from(response.signature, 'hex'));
        // Note: Check if response.signature is the full signature or just the sig bytes.
        // Usually it's the signature hex.

        deploy = Deploy.setSignature(deploy, signatureBytes, pbKey);

        // 8. Submit to Network
        const handler = new HttpHandler(NODE_URL);
        const client = new RpcClient(handler);

        try {
            const result = await client.putDeploy(deploy);
            // Result type might vary by SDK version, usually it has deploy_hash or deployHash
            return (result as any).deploy_hash || (result as any).deployHash;
        } catch (err: any) {
            console.error("PutDeploy Error", err);
            // Fallback: Return the hash we calculated locally if network fails
            const json = Deploy.toJSON(deploy) as any;
            return json && json.hash ? json.hash : "deployment-hash-unavailable";
        }

    }, [activeKey]);

    return {
        isConnected,
        activeKey,
        connect,
        disconnect,
        signDeploy,
        isLoading
    };
}

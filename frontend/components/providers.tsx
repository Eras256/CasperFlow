"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getCasperWallet } from "@/lib/casper";

interface CasperContextType {
    isConnected: boolean;
    activeKey: string | null;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    signDeploy: (deployJson: string) => Promise<string>;
    signMessage: (message: string) => Promise<string>;
}

const CasperContext = createContext<CasperContextType>({
    isConnected: false,
    activeKey: null,
    connect: async () => { },
    disconnect: async () => { },
    signDeploy: async () => "",
    signMessage: async () => "",
});

export const useCasper = () => useContext(CasperContext);

export function CasperWalletProvider({ children }: { children: React.ReactNode }) {
    const [isConnected, setIsConnected] = useState(false);
    const [activeKey, setActiveKey] = useState<string | null>(null);

    // Initial check for connection
    useEffect(() => {
        const checkConnection = async () => {
            const provider = getCasperWallet();
            if (provider) {
                try {
                    const connected = await provider.isConnected();
                    if (connected) {
                        const key = await provider.getActivePublicKey();
                        setIsConnected(true);
                        setActiveKey(key);
                    }
                } catch (err) {
                    console.error("Failed to check connection:", err);
                }
            }
        };

        // Check every second if the extension is injected
        const timer = setInterval(() => {
            if (getCasperWallet()) {
                checkConnection();
                clearInterval(timer);
            }
        }, 500);

        return () => clearInterval(timer);
    }, []);

    const connect = async () => {
        const provider = getCasperWallet();
        if (!provider) {
            alert("Please install Casper Wallet Extension!");
            return;
        }

        try {
            const connected = await provider.requestConnection();
            if (connected) {
                const key = await provider.getActivePublicKey();
                setIsConnected(true);
                setActiveKey(key);
            }
        } catch (err) {
            console.error("Connection failed:", err);
        }
    };

    const disconnect = async () => {
        const provider = getCasperWallet();
        if (provider) {
            try {
                await provider.disconnectFromSite();
                setIsConnected(false);
                setActiveKey(null);
            } catch (err) {
                console.error("Disconnect failed:", err);
            }
        }
    };

    // Helper to convert Uint8Array or Array of numbers to Hex
    const toHex = (data: any): string => {
        if (typeof data === 'string') return data;
        const bytes = data instanceof Uint8Array ? data : new Uint8Array(Object.values(data));
        return Array.from(bytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    };

    // Accepts a Deploy JSON string, signs it, and returns the signature
    const signDeploy = async (deployJson: string): Promise<string> => {
        const provider = getCasperWallet();
        if (!provider || !activeKey) throw new Error("Wallet not connected");

        try {
            const response: any = await provider.sign(deployJson, activeKey);

            if (response && response.cancelled) {
                throw new Error("User cancelled signing");
            }

            const signature = response.signature || response;
            if (!signature) throw new Error("Signature not received");

            return toHex(signature);
        } catch (err) {
            console.error("Signing failed:", err);
            throw err;
        }
    };

    const signMessage = async (message: string): Promise<string> => {
        const provider = getCasperWallet();
        if (!provider || !activeKey) throw new Error("Wallet not connected");

        try {
            const response: any = await provider.signMessage(message, activeKey);

            if (response && response.cancelled) {
                throw new Error("User cancelled signing");
            }

            const signature = response.signature || response;
            if (!signature) throw new Error("Signature not received");

            return toHex(signature);
        } catch (err) {
            console.error("Message signing failed:", err);
            throw err;
        }
    };

    return (
        <CasperContext.Provider value={{ isConnected, activeKey, connect, disconnect, signDeploy, signMessage }}>
            {children}
        </CasperContext.Provider>
    );
}

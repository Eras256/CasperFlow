import { CasperClient, Contracts, RuntimeArgs, CLValueBuilder } from "casper-js-sdk";

// Define the Casper Wallet Provider interface
export interface CasperWalletProvider {
    requestConnection: () => Promise<boolean>;
    isConnected: () => Promise<boolean>;
    getActivePublicKey: () => Promise<string>;
    getVersion: () => Promise<string>;
    sign: (deployJson: string, signingPublicKey: string) => Promise<string>;
    signMessage: (message: string, signingPublicKey: string) => Promise<string>;
    disconnectFromSite: () => Promise<boolean>;
}

// Extend the window object
declare global {
    interface Window {
        casperWalletProvider?: any;
        CasperWalletProvider?: any;
    }
}

export const getCasperWallet = (): CasperWalletProvider | undefined => {
    if (typeof window !== "undefined") {
        // Try both common naming conventions
        const provider = window.CasperWalletProvider || window.casperWalletProvider;

        // In some versions, CasperWalletProvider is a function that returns the API
        if (typeof provider === 'function') {
            try {
                return provider();
            } catch (e) {
                console.error("Error initializing Casper Wallet provider function", e);
            }
        }

        return provider;
    }
    return undefined;
};

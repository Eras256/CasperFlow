"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CasperContextType {
    isConnected: boolean;
    activeKey: string | null;
    connect: () => void;
    disconnect: () => void;
    signDeploy: (deploy: any) => Promise<string>;
}

const CasperContext = createContext<CasperContextType>({
    isConnected: false,
    activeKey: null,
    connect: () => { },
    disconnect: () => { },
    signDeploy: async () => "",
});

export const useCasper = () => useContext(CasperContext);

export function CasperWalletProvider({ children }: { children: React.ReactNode }) {
    const [isConnected, setIsConnected] = useState(false);
    const [activeKey, setActiveKey] = useState<string | null>(null);

    const connect = () => {
        // Mock connection
        setIsConnected(true);
        setActiveKey("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef");
    };

    const disconnect = () => {
        setIsConnected(false);
        setActiveKey(null);
    };

    const signDeploy = async (deploy: any) => {
        console.log("Signing deploy:", deploy);
        return "deploy-hash-mock";
    };

    return (
        <CasperContext.Provider value={{ isConnected, activeKey, connect, disconnect, signDeploy }}>
            {children}
        </CasperContext.Provider>
    );
}

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface NeuralLoaderProps {
    message?: string;
    showProgress?: boolean;
}

export default function NeuralLoader({
    message = "Analyzing Risk Vectors...",
    showProgress = true
}: NeuralLoaderProps) {
    const [progress, setProgress] = useState(0);
    const [currentPhase, setCurrentPhase] = useState(0);

    const phases = [
        "Extracting Invoice Data...",
        "Validating Document Authenticity...",
        "Analyzing Payment History...",
        "Computing Risk Score...",
        "Generating Valuation...",
    ];

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + Math.random() * 3;
            });
        }, 100);

        const phaseInterval = setInterval(() => {
            setCurrentPhase(prev => (prev + 1) % phases.length);
        }, 2000);

        return () => {
            clearInterval(progressInterval);
            clearInterval(phaseInterval);
        };
    }, []);

    // Neural network nodes
    const layers = [
        { nodes: 3, x: 0 },
        { nodes: 5, x: 80 },
        { nodes: 7, x: 160 },
        { nodes: 5, x: 240 },
        { nodes: 3, x: 320 },
        { nodes: 1, x: 400 },
    ];

    const getNodeY = (nodeIndex: number, totalNodes: number) => {
        const spacing = 200 / (totalNodes + 1);
        return spacing * (nodeIndex + 1);
    };

    // Generate connections
    const connections: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    for (let i = 0; i < layers.length - 1; i++) {
        const layer = layers[i];
        const nextLayer = layers[i + 1];

        for (let j = 0; j < layer.nodes; j++) {
            for (let k = 0; k < nextLayer.nodes; k++) {
                connections.push({
                    x1: layer.x + 10,
                    y1: getNodeY(j, layer.nodes),
                    x2: nextLayer.x + 10,
                    y2: getNodeY(k, nextLayer.nodes),
                });
            }
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
            {/* Neural Network Visualization */}
            <div className="relative w-[420px] h-[200px] mb-12">
                <svg
                    viewBox="0 0 420 200"
                    className="w-full h-full"
                    style={{ filter: 'drop-shadow(0 0 20px rgba(0, 245, 212, 0.3))' }}
                >
                    {/* Connections */}
                    {connections.map((conn, i) => (
                        <motion.line
                            key={`conn-${i}`}
                            x1={conn.x1}
                            y1={conn.y1}
                            x2={conn.x2}
                            y2={conn.y2}
                            stroke="url(#connectionGradient)"
                            strokeWidth="0.5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{
                                pathLength: 1,
                                opacity: [0.1, 0.4, 0.1],
                            }}
                            transition={{
                                pathLength: { duration: 1, delay: i * 0.01 },
                                opacity: {
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.02,
                                    ease: "easeInOut"
                                }
                            }}
                        />
                    ))}

                    {/* Animated Data Flow Lines */}
                    {[...Array(8)].map((_, i) => {
                        const startNode = Math.floor(Math.random() * 3);
                        const endNode = 0;
                        return (
                            <motion.circle
                                key={`flow-${i}`}
                                r="3"
                                fill="var(--flow-cyan)"
                                initial={{
                                    cx: 10,
                                    cy: getNodeY(startNode, 3),
                                    opacity: 0
                                }}
                                animate={{
                                    cx: [10, 90, 170, 250, 330, 410],
                                    cy: [
                                        getNodeY(startNode, 3),
                                        getNodeY(Math.floor(Math.random() * 5), 5),
                                        getNodeY(Math.floor(Math.random() * 7), 7),
                                        getNodeY(Math.floor(Math.random() * 5), 5),
                                        getNodeY(Math.floor(Math.random() * 3), 3),
                                        getNodeY(0, 1)
                                    ],
                                    opacity: [0, 1, 1, 1, 1, 0]
                                }}
                                transition={{
                                    duration: 3,
                                    delay: i * 0.4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                style={{ filter: 'blur(1px)' }}
                            />
                        );
                    })}

                    {/* Nodes */}
                    {layers.map((layer, layerIndex) => (
                        [...Array(layer.nodes)].map((_, nodeIndex) => (
                            <motion.g key={`node-${layerIndex}-${nodeIndex}`}>
                                {/* Node Glow */}
                                <motion.circle
                                    cx={layer.x + 10}
                                    cy={getNodeY(nodeIndex, layer.nodes)}
                                    r="12"
                                    fill="none"
                                    stroke="var(--flow-cyan)"
                                    strokeWidth="1"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{
                                        opacity: [0.2, 0.6, 0.2],
                                        scale: [1, 1.3, 1]
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: layerIndex * 0.1 + nodeIndex * 0.05,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                                {/* Node Core */}
                                <motion.circle
                                    cx={layer.x + 10}
                                    cy={getNodeY(nodeIndex, layer.nodes)}
                                    r="6"
                                    fill={layerIndex === layers.length - 1 ? "var(--flow-cyan)" : "var(--flow-purple)"}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{
                                        opacity: 1,
                                        scale: [0.8, 1.1, 0.8],
                                    }}
                                    transition={{
                                        opacity: { duration: 0.5, delay: layerIndex * 0.1 },
                                        scale: {
                                            duration: 1.5,
                                            delay: layerIndex * 0.1 + nodeIndex * 0.05,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }
                                    }}
                                    style={{ filter: 'drop-shadow(0 0 5px currentColor)' }}
                                />
                            </motion.g>
                        ))
                    ))}

                    {/* Gradients */}
                    <defs>
                        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="var(--flow-cyan)" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="var(--flow-purple)" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="var(--flow-pink)" stopOpacity="0.3" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Central Pulsing Ring */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-[var(--flow-cyan)]"
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>

            {/* Phase Text */}
            <motion.div
                key={currentPhase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center mb-8"
            >
                <div className="flex items-center justify-center gap-3 mb-2">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-[var(--flow-cyan)] border-t-transparent rounded-full"
                    />
                    <span className="text-sm font-mono text-[var(--flow-cyan)] uppercase tracking-widest">
                        NodeOps AI
                    </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">
                    {phases[currentPhase]}
                </h3>
                <p className="text-sm text-[var(--flow-text-muted)]">
                    Powered by Gemini Pro • Enterprise Grade Analysis
                </p>
            </motion.div>

            {/* Progress Bar */}
            {showProgress && (
                <div className="w-full max-w-sm">
                    <div className="flex justify-between text-xs text-[var(--flow-text-muted)] mb-2">
                        <span>Processing</span>
                        <span>{Math.min(Math.round(progress), 100)}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[var(--flow-cyan)] via-[var(--flow-purple)] to-[var(--flow-pink)]"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>
                </div>
            )}

            {/* Status Dots */}
            <div className="flex items-center gap-2 mt-6">
                {phases.map((_, i) => (
                    <motion.div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i === currentPhase
                                ? "bg-[var(--flow-cyan)]"
                                : i < currentPhase
                                    ? "bg-[var(--flow-cyan)]/50"
                                    : "bg-white/20"
                            }`}
                        animate={i === currentPhase ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    />
                ))}
            </div>
        </div>
    );
}

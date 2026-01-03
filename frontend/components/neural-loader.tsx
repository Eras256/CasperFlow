"use client";

import { motion } from "framer-motion";

export default function NeuralLoader() {
    const nodes = [
        { x: 0, y: 0 },
        { x: -50, y: 40 },
        { x: 50, y: 40 },
        { x: -30, y: 90 },
        { x: 30, y: 90 },
    ];

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="relative w-64 h-40 flex items-center justify-center mb-8">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-100 -20 200 140">
                    {/* Synapses */}
                    <motion.path
                        d="M0 0 L-50 40 M0 0 L50 40 M-50 40 L-30 90 M50 40 L30 90 M-50 40 L30 90 M50 40 L-30 90"
                        stroke="#00F0FF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0.2 }}
                        animate={{ pathLength: 1, opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                </svg>

                {/* Nodes */}
                {nodes.map((node, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-flow-cyan shadow-[0_0_15px_#00F0FF]"
                        style={{
                            width: 12,
                            height: 12,
                            left: `calc(50% + ${node.x}px - 6px)`,
                            top: `${node.y}px`
                        }}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    />
                ))}

                {/* Central Pulse */}
                <motion.div
                    className="absolute top-0 left-1/2 -ml-6 w-12 h-12 rounded-full border border-flow-cyan"
                    style={{ top: -6 }}
                    animate={{ scale: [1, 2], opacity: [1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>

            <motion.p
                className="text-flow-blue font-mono text-sm tracking-widest font-semibold uppercase"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
            >
                NodeOps AI Analyzing Risk Vectors...
            </motion.p>
        </div>
    );
}

import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary Dark Palette
                'flow-bg': {
                    primary: 'var(--flow-bg-primary)',
                    secondary: 'var(--flow-bg-secondary)',
                    tertiary: 'var(--flow-bg-tertiary)',
                    card: 'var(--flow-bg-card)',
                },
                // Accent Colors
                'flow-cyan': 'var(--flow-cyan)',
                'flow-purple': 'var(--flow-purple)',
                'flow-blue': 'var(--flow-blue)',
                'flow-pink': 'var(--flow-pink)',
                'flow-orange': 'var(--flow-orange)',
                'flow-green': 'var(--flow-green)',
                // Text Colors
                'flow-text': {
                    primary: 'var(--flow-text-primary)',
                    secondary: 'var(--flow-text-secondary)',
                    muted: 'var(--flow-text-muted)',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
                display: ['var(--font-outfit)', 'Outfit', 'serif'],
                mono: ['var(--font-space)', 'Space Grotesk', 'monospace'],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "gradient-primary": "var(--gradient-primary)",
                "gradient-card": "var(--gradient-card)",
                "gradient-mesh": "var(--gradient-mesh)",
            },
            boxShadow: {
                'glow': 'var(--shadow-glow)',
                'card': 'var(--shadow-card)',
                'button': 'var(--shadow-button)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-ring': 'pulse-ring 2s ease-out infinite',
                'orb-float': 'orb-float 10s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'gradient-shift': 'gradient-shift 8s ease infinite',
                'fade-in-up': 'fade-in-up 0.6s var(--ease-out-expo) forwards',
                'scale-in': 'scale-in 0.4s var(--ease-out-expo) forwards',
                'spin-slow': 'spin-slow 20s linear infinite',
                'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
            },
            transitionTimingFunction: {
                'expo-out': 'var(--ease-out-expo)',
                'quart-out': 'var(--ease-out-quart)',
                'circ-in-out': 'var(--ease-in-out-circ)',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};

export default config;

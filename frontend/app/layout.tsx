import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { CasperWalletProvider } from '@/components/providers'
import Navbar from '@/components/ui/navbar'
import Footer from '@/components/ui/footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
    title: 'FlowFi | Invoice Factoring on Casper Network',
    description: 'Instantly turn unpaid invoices into working capital with AI-driven risk scoring.',
}

import { ThirdwebProvider } from "thirdweb/react";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${playfair.variable} font-sans bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-flow-cyan selection:text-flow-blue`}>
                <ThirdwebProvider>
                    <CasperWalletProvider>
                        <div className="flex flex-col min-h-screen">
                            <Navbar />
                            <main className="flex-grow pt-20">
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </CasperWalletProvider>
                </ThirdwebProvider>
            </body>
        </html>
    )
}

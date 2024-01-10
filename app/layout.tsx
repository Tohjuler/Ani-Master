import type {Metadata} from 'next'
import './globals.css'
import React from "react";

export const metadata: Metadata = {
    title: 'Ani-Master',
    description: 'The one place for all anime and related content.',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    )
}

'use client';
import { NextUIProvider } from '@nextui-org/react';
import { Inter } from 'next/font/google';
import './globals.css';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Head>
          <title>Boloprint Landing</title>
        </Head>
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}

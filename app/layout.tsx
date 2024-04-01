'use client';
import { NextUIProvider } from '@nextui-org/react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='description'
          content='BoloPrint online customization services enable you to design and purchase top-quality custom clothing: from promotional apparel, personalized t-shirts, bespoke business attire, to unique custom-made gifts and more.'
        />
        <title>Boloprints: Online Printing</title>
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body className={inter.className}>
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}

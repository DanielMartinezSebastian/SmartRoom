import type { Metadata } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartRoom - Room Control System',
  description: 'Manage rooms, products, and client access with ease',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body className="antialiased">{children}</body>
      </html>
    </ViewTransitions>
  );
}

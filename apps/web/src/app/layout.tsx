import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Professor Academy — Online Learning & Academic Portal',
  description: 'Clean, modern learning portal for Pakistan. Structured courses, past papers, and expert instructors.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-udemy-textPrimary font-sans antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}

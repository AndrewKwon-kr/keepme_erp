'use client'; // this is a client component 👈🏽
import { useEffect, useState } from 'react';
import './globals.css';
import { useRouter } from 'next/navigation';
import LocalStorage from 'interface/localstorage';

interface AppLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: AppLayoutProps) => {
  const router = useRouter();

  const user = LocalStorage.getItem('user');
  useEffect(() => {
    console.log(user);
    if (!user) {
      router.push('/login');
    }
  }, []);

  return (
    <html lang="en">
      <body>
        {/* <script
          dangerouslySetInnerHTML={{
            __html: themeInitializerScript,
          }}></script> */}
        {children}
      </body>
    </html>
  );
};

export default RootLayout;

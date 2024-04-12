'use client';
import { useEffect, useState } from 'react';
import { useInterval } from 'react-use';
import { useAtom, useSetAtom } from 'jotai';
import { useRouter, usePathname } from 'next/navigation';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import moment from 'moment';
import 'moment/locale/ko';
import { grey } from '@mui/material/colors';
import LocalStorage from 'interface/localstorage';
import { userAtom } from 'interface/jotai';
import TopBar from 'components/top-bar';
import './globals.css';
import useWindowSize from '../hooks/useWindowResize';

const SideBar = dynamic(() => import('components/side-bar'), { ssr: false });

const theme = createTheme({
  palette: {
    secondary: grey,
  },
});

interface AppLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: AppLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useSetAtom(userAtom);

  const user = LocalStorage.getItem('authUser');
  const windowResize = useWindowSize();

  const [isHidden, setIsHidden] = useState(false);
  const [isNone, setIsNone] = useState(false);

  const [realTime, setRealTime] = useState(moment().format('MM-DD (dd)'));
  const [isTopAndSide, setIsTopAndSide] = useState(true);
  // useInterval
  useInterval(() => {
    setRealTime(moment().format('MM-DD (dd)'));
  }, 1000);

  const handleLogout = () => {
    LocalStorage.removeItem('authUser');
    router.push('/login');
  };

  useEffect(() => {
    if (user) {
      setUser(JSON.parse(user));
    } else {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    if (isHidden) {
      setTimeout(() => setIsNone(true), 400);
    } else {
      setIsNone(false);
    }
  }, [isHidden]);

  useEffect(() => {
    if (!user) {
      setIsTopAndSide(false);
    } else {
      setIsTopAndSide(true);
    }
  }, [user]);

  useEffect(() => {
    if (windowResize.width !== undefined) {
      if (windowResize.width < 600) setIsHidden(true);
      else setIsHidden(false);
    }
  }, [windowResize]);

  return (
    <html lang="en">
      {/* <Head>
        <title>
          KeepMe_
          {`${menus.filter((menu) => menu.path.split('/')[1] == pathname?.split('/')[1])[0]
            ?.name}` ?? 'Main'}
        </title>
      </Head> */}
      <body>
        <ThemeProvider theme={theme}>
          <div className="w-screen flex">
            {isTopAndSide ? (
              <>
                <SideBar
                  isNone={isNone}
                  isHidden={isHidden}
                  user={user}
                  pathname={pathname}
                  handleLogout={handleLogout}></SideBar>
                <div
                  className={
                    'flex flex-col h-screen overflow-y-auto' +
                    (isHidden ? ' w-full' : ' min-w-[calc(100%_-_300px)] max-w-[1380px]')
                  }>
                  <TopBar
                    isHidden={isHidden}
                    realTime={realTime}
                    user={user}
                    handleLogout={handleLogout}
                    setIsHidden={setIsHidden}></TopBar>
                  <div className="bg-[#F4F5F9] h-screen overflow-y-auto">{children}</div>
                </div>
              </>
            ) : (
              <div className="bg-[#F4F5F9] h-screen w-screen overflow-y-auto">{children}</div>
            )}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;

'use client'; // this is a client component 👈🏽
import { useEffect } from 'react';
import './globals.css';
import { useRouter } from 'next/navigation';

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }

export default function RootLayout({ children }) {
  // 즉시 실행함수로 감싸서 페이지가 렌더링될때 바로 실행되도록함
  // const themeInitializerScript = `(function() {
  //   ${setInitialColorMode.toString()}
  //   setInitialColorMode();
  // })()
  // `;

  // // 초기 테마를 설정하는 함수
  // function setInitialColorMode() {
  //   function getInitialColorMode() {
  //     // 로컬스토리지에서 'theme' 값 가져오기
  //     const persistedPreferenceMode = window.localStorage.getItem('theme');
  //     const hasPersistedPreference = typeof persistedPreferenceMode === 'string';

  //     if (hasPersistedPreference) {
  //       return persistedPreferenceMode;
  //     }

  //     const preference = window.matchMedia('(prefers-color-scheme: dark)');
  //     const hasMediaQueryPreference = typeof preference.matches === 'boolean';

  //     if (hasMediaQueryPreference) {
  //       return preference.matches ? 'dark' : 'light';
  //     }

  //     return 'light';
  //   }

  //   //현재 테마 모드
  //   const currentColorMode = getInitialColorMode();
  //   const element = document.body;
  //   element.style.setProperty('--initial-color-mode', currentColorMode);

  //   // 현재 다크모드라면 다크모드를 바로 적용 시켜줌
  //   if (currentColorMode === 'dark') document.body.setAttribute('data-theme', 'dark');
  // }

  const router = useRouter();

  const user = localStorage.getItem('user');
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
}

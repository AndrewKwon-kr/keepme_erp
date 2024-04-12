import { useEffect, useState } from 'react';

type SizeType = {
  width: number | undefined;
  height: number | undefined;
};

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<SizeType>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      window.addEventListener('resize', handleResize);

      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    } else {
      return () =>
        window.removeEventListener('resize', () => {
          return null;
        });
    }
  }, []);
  return windowSize;
};

export default useWindowSize;

import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';

import Weather from 'components/common/Wheather';

export default function TopBar(probs: any) {
  const { handleLogout, isHidden, realTime, setIsHidden } = probs;

  return (
    <div className="min-h-[70px] flex items-center border-b">
      <div className="ml-10 max-md:ml-5 mr-auto">
        <IconButton aria-label="menu" onClick={() => setIsHidden(!isHidden)}>
          <MenuIcon />
        </IconButton>
      </div>
      <div className="ml-auto mr-10 max-md:mr-5 flex items-center gap-x-5">
        <div className="lg:text-base md:text-sm max-md:text-sm">{realTime}</div>
        <Weather></Weather>
        <Button
          variant="contained"
          className="ml-5 max-md:ml-3 bg-[#ACB8C9] min-w-[120px] max-lg:text-sm max-sm:hidden"
          onClick={() => handleLogout()}>
          로그아웃
        </Button>
      </div>
    </div>
  );
}

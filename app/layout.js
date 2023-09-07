import './globals.css';
import Link from 'next/link';

import HomeIcon from '@mui/icons-material/Home';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import GppGoodIcon from '@mui/icons-material/GppGood';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ConstructionIcon from '@mui/icons-material/Construction';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const menus = [
  { path: '/home', name: '홈', icon: 'home' },
  { path: '/building', name: '공사현장', icon: 'building' },
  { path: '/safe', name: '안전관리', icon: 'safe' },
  {
    path: '/attendance',
    name: '근태관리',
    icon: 'attendance',
  },
  { path: '/meal', name: '식수관리', icon: 'meal' },
  {
    path: '/equipment',
    name: '장비관리',
    icon: 'equipment',
  },
  { path: '/schedule', name: '일정', icon: 'schedule' },
  { path: '/setting', name: '설정', icon: 'setting' },
];

export default function RootLayout({ children }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [age, setAge] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    console.log(router.pathname);
  }, [router]);

  const setIcon = (icon) => {
    switch (icon) {
      case 'home':
        return <HomeIcon sx={{ fontSize: 18 }} />;
      case 'building':
        return <CorporateFareIcon sx={{ fontSize: 18 }} />;
      case 'safe':
        return <GppGoodIcon sx={{ fontSize: 18 }} />;
      case 'attendance':
        return <AccessAlarmIcon sx={{ fontSize: 18 }} />;
      case 'meal':
        return <RestaurantMenuIcon sx={{ fontSize: 18 }} />;
      case 'equipment':
        return <ConstructionIcon sx={{ fontSize: 18 }} />;
      case 'schedule':
        return <CalendarMonthIcon sx={{ fontSize: 18 }} />;
      case 'setting':
        return <SettingsIcon sx={{ fontSize: 18 }} />;
    }
  };
  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  };
  return (
    <div className="w-screen flex">
      <div className="pt-[90px] px-5 min-w-[250px] min-h-screen flex flex-col bg-[#F2F3F6] gap-y-2.5">
        {menus.map((menu) => (
          <Link href={menu.path} key={menu.name}>
            <div
              className={
                'px-5 py-2 flex items-center gap-x-3 text-base  rounded-xl' +
                (menu.path == router.pathname
                  ? ' bg-[#3E56B4] text-white'
                  : ' bg-[#F2F3F6] text-[#555555]')
              }
            >
              {setIcon(menu.icon)}
              <div>{menu.name}</div>
            </div>
          </Link>
        ))}
      </div>
      <div className="min-w-[calc(100%_-_250px)] max-w-[1380px] flex flex-col">
        <div className="flex flex-col px-5">
          <div className="flex mt-5 ml-auto mr-5 gap-x-5">
            <div className="w-[250px] h-9 rounded-md border border-[#CCCCCC] relative">
              <SearchIcon className="absolute left-4 top-2 text-[#787878] text-[20px]" />
              <input
                className="focus:outline-none w-full h-full rounded-md  pl-[48px] pr-2 px-4 text-sm"
                value={search}
                onChange={onChangeSearch}
                placeholder="메뉴검색"
              />
            </div>
            <div className="w-[250px] h-9 rounded-md border border-[#CCCCCC] relative">
              <AccountCircleIcon className="absolute left-4 top-2 text-[#787878] text-[20px]" />
              <input
                className="focus:outline-none w-full h-full rounded-md  pl-[48px] pr-2 px-4 text-sm"
                value={search}
                onChange={onChangeSearch}
                placeholder="직원검색"
              />
            </div>
            <div className="flex items-center gap-x-2.5">
              <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <div className="flex items-center gap-x-2.5">
                  <div className="w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center text-white">
                    배
                  </div>
                  <div className="text-base ">배강주</div>
                </div>
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Menu>
            </div>
          </div>
          <div className="mt-11 flex items-center">
            <div className="text-xl font-semibold">2023년 1월 23일 (월)</div>
            <div className="ml-auto text-base">
              전체 등록 인원 : <b>1240</b>
            </div>
            <FormControl>
              <Select
                className="ml-5 h-9 w-[180px] active:outline-none"
                value={age}
                onChange={handleChange}
                displayEmpty
              >
                <MenuItem value={0}>부산 가야현장</MenuItem>
                <MenuItem value={1}>부산 다대포현장</MenuItem>
                <MenuItem value={2}>김해 장유현장</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

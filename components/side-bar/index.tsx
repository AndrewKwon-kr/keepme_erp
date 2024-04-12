import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import GridViewIcon from '@mui/icons-material/GridView';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SettingsIcon from '@mui/icons-material/Settings';

import Button from '@mui/material/Button';
import Link from 'next/link';
import Image from 'next/image';

import { useRouter, usePathname } from 'next/navigation';
import { Menu, MenuItem } from '@mui/material';

const UserInfo = ({ user }: any) => {
  return user ? (
    user.picture ? (
      <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
        <Image
          src={user.picture}
          alt="프로필이미지"
          width={32}
          height={32}
          style={{ height: '32px' }}
        />
      </div>
    ) : (
      <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
        {user.name?.substring(0, 1)}
      </div>
    )
  ) : (
    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white"></div>
  );
};

export default function SideBar(probs: any) {
  const router = useRouter();
  const pathname = usePathname();
  const { isNone, isHidden, user, handleLogout } = probs;
  const [userParse, setUserParse] = React.useState(JSON.parse(user));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [menuList, setMenuList] = React.useState([
    {
      menu: '대시보드',
      isOpen: false,
      href: '/',
      list: [],
    },
    {
      menu: '근태',
      isOpen: false,
      icon: <AccessTimeIcon />,
      href: '/attendance',
      list: [
        {
          menu: '현황',
          isOpen: false,
          href: '/attendance/status',
          list: [
            // { menu: '개별', href: '/attendance' },
            // { menu: '기간별', href: '/attendance' },
            // { menu: '현장별', href: '/attendance' },
          ],
        },
        {
          menu: '작업일보',
          isOpen: false,
          href: '/attendance/report',
          list: [],
        },
        {
          menu: '관리',
          isOpen: false,
          href: '/',
          list: [
            { menu: '출퇴근시간설정', href: null },
            { menu: '단말기', href: null },
            { menu: '이력', href: null },
          ],
        },
      ],
    },
    {
      menu: '식수',
      isOpen: false,
      href: null,
      icon: <RestaurantIcon />,
      list: [
        {
          menu: '현황',
          isOpen: false,
          href: '/',
          list: [],
        },
        {
          menu: '관리',
          isOpen: false,
          href: '/',
          list: [
            { menu: '식당', href: null },
            { menu: '카드/바코드/QR', href: null },
          ],
        },
      ],
    },
    {
      menu: '안전',
      isOpen: false,
      href: '/safe',
      icon: <VerifiedUserIcon />,
      list: [
        {
          menu: '현황',
          isOpen: false,
          href: '/safe',
          list: [],
        },
        {
          menu: '현장',
          isOpen: false,
          href: null,
          list: [],
        },
        {
          menu: '관리',
          isOpen: false,
          href: '/',
          list: [
            { menu: '안전알림', href: null },
            { menu: '불출형 기기', href: null },
            { menu: '고정형 기기', href: null },
            { menu: '기본세팅', href: null },
          ],
        },
      ],
    },
    {
      menu: '관리',
      isOpen: false,
      href: '/setting',
      icon: <SettingsIcon />,
      list: [
        {
          menu: '관리자',
          isOpen: false,
          href: '/setting/sitemanager',
          list: [],
        },
        {
          menu: '근로자',
          isOpen: false,
          href: '/setting/fieldworker',
          list: [],
        },
        {
          menu: '현장',
          isOpen: false,
          href: null,
          list: [],
        },
        {
          menu: '협력사',
          isOpen: false,
          href: null,
          list: [],
        },
        {
          menu: '공지사항',
          isOpen: false,
          href: null,
          list: [],
        },
      ],
    },
  ]);

  const onClickMenu = (index: any) => {
    let array = [...menuList];
    array[index].isOpen = !menuList[index].isOpen;

    setMenuList(array);
  };

  const onClickSub = (index: any, subIndex: any) => {
    let array = [...menuList];
    array[index].list[subIndex].isOpen = !menuList[index].list[subIndex].isOpen;

    setMenuList(array);
  };

  const onClickLink = (path: string | null) => {
    console.log(path, pathname);
    if (path != '/' && path != null) {
      router.push(path);
    } else {
      alert('준비중입니다.');
    }
  };

  const setIcon = (icon: string) => {
    switch (icon) {
      case '대시보드':
        return <GridViewIcon sx={{ fontSize: 18 }} />;
      case '근태':
        return <AccessTimeIcon sx={{ fontSize: 18 }} />;
      case '식수':
        return <RestaurantIcon sx={{ fontSize: 18 }} />;
      case '안전':
        return <VerifiedUserIcon sx={{ fontSize: 18 }} />;
      case '관리':
        return <SettingsIcon sx={{ fontSize: 18 }} />;
      default:
        return <SettingsIcon sx={{ fontSize: 18 }} />;
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      className={
        'lg:min-w-[300px] min-h-screen transition ease-in-out delay-150 duration-300 flex flex-col ' +
        (isNone ? ' hidden' : isHidden && ' opacity-0 -translate-x-full')
      }>
      <div className="px-10 h-[70px] flex items-center border-b">
        <Link href="/">
          <img src="/icons/logo_keepme_erp.svg" className="h-10 max-sm:hidden" alt="로고" />
        </Link>
      </div>
      <List
        sx={{
          width: '100%',
          maxWidth: 360,
          bgcolor: 'background.paper',
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader className="border-b" component="div" id="nested-list-subheader">
            <div className="flex items-center gap-x-2.5">
              <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{ width: '100%', justifyContent: 'start' }}>
                <div className="px-3 h-[70px] flex max-sm:flex-col items-center gap-x-2.5 max-md:gap-y-2.5">
                  <UserInfo user={userParse} />
                  <div className="text-sm text-[#555555]">{userParse?.name}</div>
                </div>
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}>
                {/* <MenuItem onClick={handleClose}>프로필</MenuItem> */}
                <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
              </Menu>
            </div>
          </ListSubheader>
        }>
        <div className="mt-10">
          {menuList.map((menu, index) => (
            <div key={menu.menu}>
              {menu.list.length > 0 ? (
                <div
                  onClick={() => onClickMenu(index)}
                  className={
                    'pl-5 py-4 flex items-center text-sm cursor-pointer ' +
                    (pathname?.split('/')[1] == menu.href?.split('/')[1] &&
                      'bg-[#171C61] text-white hover:text-white hover:bg-[#171C61]')
                  }>
                  <ListItemIcon
                    sx={{
                      color:
                        pathname?.split('/')[1] == menu.href?.split('/')[1] ? 'white' : 'black',
                    }}>
                    {setIcon(menu.menu)}
                  </ListItemIcon>
                  <div className="max-sm:hidden">{menu.menu}</div>
                </div>
              ) : (
                <Link href={menu.href}>
                  <div
                    onClick={() => onClickMenu(index)}
                    className={
                      'pl-5 py-4 flex items-center text-sm cursor-pointer ' +
                      (pathname?.split('/')[1] == menu.href?.split('/')[1] &&
                        'bg-[#171C61] text-white hover:text-white hover:bg-[#171C61]')
                    }>
                    <ListItemIcon
                      sx={{
                        color:
                          pathname?.split('/')[1] == menu.href?.split('/')[1] ? 'white' : 'black',
                      }}>
                      {setIcon(menu.menu)}
                    </ListItemIcon>
                    <div className="max-sm:hidden">{menu.menu}</div>
                  </div>
                </Link>
              )}

              {menu.list.length > 0 && (
                <Collapse in={menu.isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {menu.list.map((sub, subIndex) => (
                      <div key={sub.menu}>
                        {sub.list.length > 0 ? (
                          <div
                            className="pl-24 max-sm:pl-4 cursor-pointer flex py-4 text-sm items-center justify-between pr-5"
                            onClick={() => onClickSub(index, subIndex)}>
                            <div>{sub.menu}</div>
                            {sub.list.length > 0 && (sub.isOpen ? <ExpandLess /> : <ExpandMore />)}
                          </div>
                        ) : (
                          <a onClick={() => onClickLink(sub.href)}>
                            <div
                              className={
                                'pl-24 max-sm:pl-4 cursor-pointer flex py-4 text-sm items-center justify-between' +
                                (pathname == sub.href && ' bg-[#F4F5F9]')
                              }
                              onClick={() => onClickSub(index, subIndex)}>
                              <div>{sub.menu}</div>
                            </div>
                          </a>
                        )}

                        {sub.list.length > 0 && (
                          <Collapse in={sub.isOpen} timeout="auto" unmountOnExit>
                            <List component="div" className="text-gray-500">
                              {sub.list.map((deep: any) => (
                                <a key={deep.menu} onClick={() => onClickLink(deep.href)}>
                                  <div
                                    className={
                                      'pl-28 max-sm:pl-6 py-2 text-sm cursor-pointer ' +
                                      (pathname == deep.href && ' bg-[#F4F5F9]')
                                    }>
                                    <div>{deep.menu}</div>
                                  </div>
                                </a>
                              ))}
                            </List>
                          </Collapse>
                        )}
                      </div>
                    ))}
                  </List>
                </Collapse>
              )}
            </div>
          ))}
        </div>
      </List>
    </div>
  );
}

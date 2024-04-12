import { atom } from 'jotai';

export interface UserProps {
  code: number;
  userid: string;
  name: string;
  departmentCode: string;
  mobileNumber: string;
  birthDay: string;
  startDate: string;
  agencyParentName: string;
  agencyCode: string;
  parentCode: string;
  companyName: string;
  companyCode: string;
  agencyname: string;
  departmentName: string;
  agencyParentManager: number;
  agencyManager: number;
  picture: string;
  token: string;
}

export interface MenuProps {
  menu: string;
  isOpen: boolean;
  href: string;
  list: [];
}

export const areaAtom = atom<number>(0);
export const userAtom = atom<UserProps>({
  code: 1,
  userid: '',
  name: '',
  departmentCode: '',
  mobileNumber: '',
  birthDay: '',
  startDate: '',
  agencyParentName: '',
  agencyCode: '',
  parentCode: '',
  companyName: '',
  companyCode: '',
  agencyname: '',
  departmentName: '',
  agencyParentManager: 0,
  agencyManager: null,
  picture: '',
  token: '',
});

export const menuAtom = atom<MenuProps[]>([]);

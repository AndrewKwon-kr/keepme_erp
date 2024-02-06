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

export const areaAtom = atom<number>(0);
export const userAtom = atom<UserProps>({
  code: 1,
  userid: '01044455107',
  name: '관리자',
  departmentCode: '1',
  mobileNumber: '01044455107',
  birthDay: '19790311',
  startDate: '20220801',
  agencyParentName: '부산',
  agencyCode: '0001',
  parentCode: '0000',
  companyName: 'GS건설',
  companyCode: '1',
  agencyname: '연산동 행복주택',
  departmentName: '일반',
  agencyParentManager: 0,
  agencyManager: 1,
  picture: 'https://js.devexpress.com/Demos/WIdgetsGallery/JSDemos/images/employees/01.png',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMDEwNDQ0NTUxMDciLCJleHAiOjE3MDY1NzU3NjMsImlzcyI6Imh0dHBzOi8vYXBpLmluY29udXMua3IiLCJhdWQiOiJNeSBrZWVwbWUgVXNlcnMifQ.MeU1PVaH-kMJ8-vMHQ2Ua-g4X9zwJnnJq8fBH2eSEoQ',
});

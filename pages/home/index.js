import Page from 'app/page';
import React, { useEffect, useMemo, useState } from 'react';
import PlusIcon from 'public/icons/ico_more_line.svg';
import GroupsIcon from '@mui/icons-material/Groups';
import EngineeringIcon from '@mui/icons-material/Engineering';
import HomeIcon from '@mui/icons-material/Home';
import Image from 'next/image';

import Link from 'next/link';
import { KakaoMap } from '../../components/common/KakaoMap';
import { Weather } from '../../components/common/Wheather';
import { getUserVitalSignList } from '../../api/index';

export default function Home() {
  const [workerList, setWorkerList] = useState([]);

  const statusList = [
    { title: '금일 전체 / 출근', number: '440 / 434' },
    { title: '미출근(퇴사)', number: 2 },
    { title: '지각', number: 3 },
    { title: '조퇴', number: 5 },
    { title: '휴무', number: 5 },
    { title: '연장', number: 5 },
  ];

  useEffect(() => {
    const getWorkerList = async () => {
      try {
        const res = await getUserVitalSignList({
          companyCode: '1',
          agencyCode: '0001',
          vitalSignState: 0,
          employeeCode: 1,
          startNo: 0,
          endNo: 1000,
        });

        setWorkerList(res);
      } catch (error) {
        console.log(error);
      }
    };

    getWorkerList();
  }, []);

  return (
    <Page>
      <main className="px-5 pt-9 pb-20 w-full h-[calc(100vh_-_148px)] grid grid-rows-2 gap-5">
        <div className="col-span-2 flex gap-x-5">
          <div className="grow max-w-[600px] flex flex-col gap-y-5 text-lg">
            <div className="grow p-10 border border-green-700 text-green-700 rounded-md flex justify-between items-center">
              <p>
                <GroupsIcon className="w-10 h-10 mr-3" />
                전체 등록 인원
              </p>
              <p className="font-bold">1240명</p>
            </div>
            <div className="grow p-10 border border-blue-700 text-blue-700 rounded-md flex justify-between items-center">
              <p>
                <EngineeringIcon className="w-10 h-10 mr-3" />
                금일 작업 인원
              </p>
              <p className="font-bold">440명</p>
            </div>
            <div className="grow p-10 border border-yellow-700 text-yellow-700 rounded-md flex justify-between items-center">
              <p>
                <HomeIcon className="w-10 h-10 mr-3" />
                금일 휴업 인원
              </p>
              <p className="font-bold">800명</p>
            </div>
          </div>
          <div className="grow border rounded-md shadow-box p-5 flex flex-col">
            <div className="mb-5 flex items-center text-[#555555] text-base">
              현장 근로자 위치 - 지도
            </div>
            <KakaoMap
              latitude={35.179560914682995}
              longitude={129.078531730862}
              workerList={workerList}></KakaoMap>
            {/* <div className="flex items-center justify-between">
              <p className="text-[#555555] text-base">근태 현황</p>
              <Link href="/attendance/attendance-status">
                <div className="flex items-center text-xs text-[#999999]">
                  <Image src={PlusIcon} width={12} height={12} alt="plus" />
                  전체보기
                </div>
              </Link>
            </div>
            <div className="mt-[30px] grid grid-cols-2 text-base">
              {statusList.map((status, index) => (
                <div
                  key={index}
                  className={
                    'flex items-center justify-between px-5 py-10 odd:border-r ' +
                    (index == 2 ? ' border-y' : index == 3 && ' border-y')
                  }>
                  <p className="font-medium">{status.title}</p>
                  <p className="font-semibold text-[#3E56B4]">{status.number}</p>
                </div>
              ))}
            </div> */}
          </div>
          {/* <div className="grow border rounded-md shadow-box p-5 flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-[#555555] text-base">날씨</p>
            </div>
          </div> */}
        </div>
        <div className="grow border rounded-md shadow-box p-5 flex flex-col">
          {/* <div className="flex items-center justify-between">
              <p className="text-[#555555] text-base">근태 현황</p>
              <Link href="/attendance/attendance-status">
                <div className="flex items-center text-xs text-[#999999]">
                  <Image src={PlusIcon} width={12} height={12} alt="plus" />
                  전체보기
                </div>
              </Link>
            </div>
            <div className="mt-[30px] grid grid-cols-2 text-base">
              {statusList.map((status, index) => (
                <div
                  key={index}
                  className={
                    'flex items-center justify-between px-5 py-10 odd:border-r ' +
                    (index == 2 ? ' border-y' : index == 3 && ' border-y')
                  }>
                  <p className="font-medium">{status.title}</p>
                  <p className="font-semibold text-[#3E56B4]">{status.number}</p>
                </div>
              ))}
            </div> */}
        </div>
        <div className="border rounded-md shadow-box p-5 flex flex-col">
          <Weather></Weather>
        </div>
      </main>
    </Page>
  );
}

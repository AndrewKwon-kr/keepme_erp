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
      <main className="px-5 pt-9 pb-20 w-full grid lg:grid-rows-2 max-lg:grid-cols-1 gap-5">
        <div className="col-span-2 flex max-md:flex-col gap-5">
          <div className="grow lg:max-w-[600px] flex flex-col gap-y-5 text-lg">
            <div className="grow lg:p-10 max-lg:p-5 border border-green-700 text-green-700 rounded-md flex justify-between items-center shadow-box">
              <p>
                <GroupsIcon className="w-10 h-10 mr-3" />
                전체 등록 인원
              </p>
              <p className="font-bold">84 명</p>
            </div>
            <div className="grow lg:p-10 max-lg:p-5 border border-blue-700 text-blue-700 rounded-md flex justify-between items-center shadow-box">
              <p>
                <EngineeringIcon className="w-10 h-10 mr-3" />
                금일 작업 인원
              </p>
              <p className="font-bold">51 명</p>
            </div>
            <div className="grow lg:p-10 max-lg:p-5 border border-yellow-700 text-yellow-700 rounded-md flex justify-between items-center shadow-box">
              <p>
                <HomeIcon className="w-10 h-10 mr-3" />
                금일 휴업 인원
              </p>
              <p className="font-bold">33 명</p>
            </div>
          </div>
          <div className="grow border rounded-md shadow-box p-5 flex flex-col max-md:min-h-[400px]">
            <div className="mb-5 flex items-center text-[#555555] text-base">
              현장 근로자 위치 - 지도
            </div>
            <KakaoMap
              latitude={35.179560914682995}
              longitude={129.078531730862}
              workerList={workerList}></KakaoMap>
          </div>
        </div>
        <div className="col-span-2 flex max-md:flex-col gap-5">
          <div className="grow border rounded-md shadow-box p-5 flex flex-col"></div>
          <div className="border rounded-md shadow-box p-5 flex flex-col">
            <Weather></Weather>
          </div>
        </div>
      </main>
    </Page>
  );
}

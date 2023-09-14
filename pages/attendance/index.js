import Page from '@/app/page';
import React, { useEffect, useMemo, useState } from 'react';
import PlusIcon from '@/public/icons/ico_more_line.svg';
import Image from 'next/image';

import Link from 'next/link';

import DoughnutChart from '@/components/common/DoughnutChart';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default function Attendance() {
  const statusList = [
    { title: '금일 전체 / 출근', number: '440 / 434' },
    { title: '미출근(퇴사)', number: 2 },
    { title: '지각', number: 3 },
    { title: '조퇴', number: 5 },
    { title: '휴무', number: 5 },
    { title: '연장', number: 5 },
  ];
  const departmentStatusData = {
    labels: ['노무', '철근', '공무', '비계'],
    datasets: [
      {
        label: '명 ',
        labels: ['노무', '철근', '공무', '비계'],
        data: [12, 19, 3, 5],
        backgroundColor: ['#8169F7', '#2496EF', '#EA3869', '#FFC54E'],
        borderColor: ['#8169F7', '#2496EF', '#EA3869', '#FFC54E'],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: 'white',
        display: true,
        font: {
          weight: 'bold',
        },
        formatter: (val, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];

          return `${label}`;
        },
      },
    },
  };
  return (
    <Page>
      <div className="px-5 pt-9 pb-20 w-full h-[calc(100vh_-_148px)] grid grid-cols-3 grid-rows-2 gap-5">
        <div className="col-span-2 flex gap-x-5">
          <div className="grow border rounded-md shadow-box p-5 flex flex-col">
            <div className="flex items-center justify-between">
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
                  }
                >
                  <p className="font-medium">{status.title}</p>
                  <p className="font-semibold text-[#3E56B4]">
                    {status.number}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="min-w-[325px] border rounded-md shadow-box p-5 flex flex-col gap-y-5">
            <p className="text-base text-[#555555]">부서 별 출근현황</p>
            <DoughnutChart
              data={departmentStatusData}
              plugins={[ChartDataLabels]}
              options={options}
            />
          </div>
        </div>
        <div className="border rounded-md shadow-box p-5 flex flex-col"></div>
        <div className="border rounded-md shadow-box p-5 flex flex-col"></div>
        <div className="border rounded-md shadow-box p-5 flex flex-col"></div>
        <div className="border rounded-md shadow-box p-5 flex flex-col"></div>
      </div>
    </Page>
  );
}

'use client';
import React, { useEffect, useMemo, useState } from 'react';

import DoughnutChart from 'components/common/DoughnutChart';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import LineChart from 'components/common/LineChart';
import BarChart from 'components/common/BarChart';
import moment from 'moment';

import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import LinearProgress from '@mui/material/LinearProgress';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getAttendanceCnt, getMealMemberList } from 'api/index';
import LocalStorage from 'interface/localstorage';

export default function Dashboard() {
  const user = JSON.parse(LocalStorage.getItem('authUser'));

  const today = moment().format('YYYY년 MM월 DD일');
  const safeStatus = 'up';

  const [deptStatusList, setDeptStatusList] = useState([]);
  const [deptTotalCount, setDeptTotalCount] = useState(0);

  const [processList, setProcessList] = useState([
    { title: '전체 공정률', startDate: '2024.01.01', endDate: '2024.12.31', progress: 36.4 },
    { title: '토목', startDate: '2024.01.01', endDate: '2024.12.31', progress: 12.3 },
    { title: '도급', startDate: '2024.01.01', endDate: '2024.12.31', progress: 65.2 },
    { title: '골조', startDate: '2024.01.01', endDate: '2024.12.31', progress: 1.1 },
    { title: '전기', startDate: '2024.01.01', endDate: '2024.12.31', progress: 0 },
    { title: '통신', startDate: '2024.01.01', endDate: '2024.12.31', progress: 45.6 },
    { title: '비계', startDate: '2024.01.01', endDate: '2024.12.31', progress: 30 },
    { title: '공조', startDate: '2024.01.01', endDate: '2024.12.31', progress: 30 },
    { title: '형틀목공', startDate: '2024.01.01', endDate: '2024.12.31', progress: 30 },
    { title: '직영', startDate: '2024.01.01', endDate: '2024.12.31', progress: 30 },
  ]);

  const [deptChartData, setDeptChartData] = useState({
    labels: [],
    datasets: [
      {
        label: '인원 ',
        labels: [],
        data: [],
        backgroundColor: [],
        borderColor: [],
        cutout: 120,
      },
    ],
  });

  const [mealTotalCount, setMealTotalCount] = useState(0);
  const [mealStatusData, setMealStatusData] = useState({
    labels: [],
    datasets: [
      {
        label: '인원 ',
        data: [],
        backgroundColor: ['white'],
        borderColor: ['#5C62B2'],
        cutout: 120,
      },
    ],
  });

  const safeStatusData = {
    labels: ['토목', '도급', '골조', '전기', '미장'],
    datasets: [
      {
        label: '안전근로자',
        data: [50, 62, 50, 20, 62],
        backgroundColor: [50, 62, 50, 20, 62].map((val) => (val == 0 ? 'white' : '#5C62B2')),
        barThickness: 35,
        borderSkipped: false,
        borderRadius: [10, 0, 12, 10, 0].map((val) => {
          return {
            topLeft: val == 0 ? 10 : 0,
            topRight: val == 0 ? 10 : 0,
            bottomLeft: 10,
            bottomRight: 10,
          };
        }),
      },
      {
        label: '위험근로자',
        data: [10, 0, 12, 10, 0],
        backgroundColor: [10, 0, 12, 10, 0].map((val) => (val == 0 ? 'white' : '#F894A0')),
        barThickness: 35,
        borderSkipped: false,
        borderRadius: [50, 62, 50, 20, 62].map((val) => {
          return {
            topLeft: 10,
            topRight: 10,
            bottomLeft: val == 0 ? 10 : 0,
            bottomRight: val == 0 ? 10 : 0,
          };
        }),
      },
    ],
  };
  const safeStatusOptions = {
    maintainAspectRatio: false,
    // layout: {
    //   padding: {
    //     bottom: 80,
    //   },
    // },
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,

        grid: {
          color: 'transparent',
          drawBorder: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        stacked: true,
        ticks: {
          display: false,
          beginAtZero: true,
        },
        // to remove the y-axis grid
        grid: {
          drawBorder: false,
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  const departmentStatusOptions = {
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: 'white',
        display: false,
        font: {
          weight: 'bold',
        },
        formatter: (val: any, ctx: any) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];

          return `${label}`;
        },
      },
    },
  };

  const mealStatusOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      scales: {
        y: {
          beginAtZero: true,
          // min: 0,
          // max: 1000,
          // stepSize: 5,
        },
      },
      datalabels: {
        color: 'white',
        display: false,
        font: {
          weight: 'bold',
        },
        formatter: (val: any, ctx: any) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];

          return `${label}`;
        },
      },
    },
  };
  const randomBrightColor = () => {
    let color_r = Math.floor(Math.random() * 127 + 128).toString(16);
    let color_g = Math.floor(Math.random() * 127 + 128).toString(16);
    let color_b = Math.floor(Math.random() * 127 + 128).toString(16);
    return `#${color_r + color_g + color_b}`;
  };

  useEffect(() => {
    const initAttendanceList = async () => {
      try {
        const response = await getAttendanceCnt({
          companyCode: user.companyCode,
          agencyCode: user.agencyCode,
        });

        const datas = response.data;

        let newArray = datas.map((data: any) => {
          return { ...data, color: randomBrightColor() };
        });
        newArray.sort((a: any, b: any) => b.deptCount - a.deptCount); // 인원이 큰 순서로 정렬

        setDeptStatusList(newArray);
        setDeptTotalCount(response.totalCount);
        setDeptChartData({
          labels: newArray.map((data: any) => data.deptName),
          datasets: [
            {
              label: '인원 ',
              labels: newArray.map((data: any) => data.deptName),
              data: newArray.map((data: any) => data.deptCount),
              backgroundColor: newArray.map((data: any) => data.color),
              borderColor: newArray.map((data: any) => data.color),
              cutout: 120,
            },
          ],
        });
      } catch (error) {
        console.log(error);
      }
    };
    const initMealMemberList = async () => {
      try {
        const response = await getMealMemberList({
          companyCode: user.companyCode,
          agencyCode: user.agencyCode,
        });

        const datas = response.data;

        setMealTotalCount(response.totalCount);
        setMealStatusData({
          labels: datas.map((data: any) => data.dayofWeek.substr(0, 1)),
          datasets: [
            {
              label: '인원 ',
              data: datas.map((data: any) => data.numberOfMeals),
              backgroundColor: ['white'],
              borderColor: ['#5C62B2'],
              cutout: 120,
            },
          ],
        });
      } catch (error) {
        console.log(error);
      }
    };

    initAttendanceList();
    initMealMemberList();
  }, []);

  return (
    <main className="p-10 w-full max-xl:flex max-xl:flex-col max-xl:pb-10 xl:grid xl:grid-row-2 xl:grid-cols-3 gap-10 xl:h-[calc(100vh_-_70px)]">
      <div className="col-span-2 flex flex-col">
        <div className="mb-5 text-lg font-semibold">금일 근태 현황</div>
        <div className="p-7 bg-white flex gap-x-20 items-center rounded-2xl max-lg:flex-col max-xl:gap-y-5 h-full">
          <div className="basis-1/2 flex flex-col items-center">
            <div className="relative w-fit flex">
              <div className="absolute flex flex-col top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-center">
                <div className="text-lg font-medium">총 근무 인원</div>
                <div className="text-[60px] font-bold text-[#171C61]">
                  {deptTotalCount}
                  <span className="text-lg font-medium">명</span>
                </div>
              </div>
              <DoughnutChart
                data={deptChartData}
                plugins={[ChartDataLabels]}
                options={departmentStatusOptions}
              />
            </div>
            <div className="mt-5 flex gap-x-5 gap-y-1 justify-center flex-wrap">
              {deptStatusList.map((status: any, index: number) => (
                <div className="flex gap-x-2 items-center" key={status.deptName}>
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: status.color,
                    }}></div>
                  <div className="text-sm">{status.deptName}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="basis-3/4 w-full h-full rounded-xl bg-[#F4F5F9] flex flex-col p-7">
            <div className="text-[#555555]">
              {today} 중 <b>{deptStatusList[0]?.deptName}</b> 근무 인원이 제일 많아요.
            </div>
            <div className="mt-5 grid xl:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 sm:grid-cols-1  gap-2.5">
              {deptStatusList.map((status, index) => (
                <div
                  key={status.deptName}
                  className={
                    'py-4 px-7 max-sm:py-2 max-sm:px-4 max-sm:text-xs flex items-center justify-between shadow-box bg-white rounded-xl text-sm first:border first:border-[#F894A0]'
                  }>
                  <div
                    className={
                      ' font-semibold ' + (index == 0 ? 'text-[#F894A0]' : 'text-[#171C61]')
                    }>
                    {status.deptName}
                  </div>
                  <div
                    className={'font-medium ' + (index == 0 ? 'text-[#F894A0]' : 'text-[#000000]')}>
                    {status.deptCount}명
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:row-span-2 ">
        <div className="mb-5 text-lg font-semibold">공정률</div>
        <div className="p-5 bg-[#DBDEF1] flex flex-col gap-y-5 rounded-2xl w-full xl:max-h-[calc(100vh_-_198px)] max-xl:h-[600px] overflow-y-hidden scrollbar-hide relative">
          {processList.map((process: any, index: number) => (
            <div
              className="rounded-2xl p-5 flex flex-col bg-white first:border first:border-black max-md:text-sm max-md:p-2.5"
              key={process.title}>
              <div className="flex items-center justify-between">
                <div className="bold">{process.title}</div>
                <div className={'text-[#F894A0] ' + (process.progress != 0 && ' hidden')}>
                  On Hold
                </div>
              </div>
              <div className="text-[#787878]">
                기간&nbsp;{process.startDate} ~ {process.endDate}
              </div>
              <div className="mt-2 flex items-center">
                <div className="w-full">
                  <LinearProgress
                    variant="determinate"
                    className="h-[14px] rounded-md"
                    sx={{
                      backgroundColor: '#DDE0EF',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: `${index == 0 ? '#3C47DD' : '#171C61'}`,
                      },
                    }}
                    value={process.progress}
                  />
                </div>
                <div
                  className={
                    'ml-2.5 font-semibold ' +
                    (index == 0
                      ? 'text-[#3C47DD]'
                      : process.progress == 0
                        ? 'text-[#F894A0]'
                        : 'text-[#171C61]')
                  }>
                  {process.progress}%
                </div>
              </div>
            </div>
          ))}
          <div className="absolute bottom-0 left-0 right-0 rounded-2xl bg-[#171C61] text-white flex items-center justify-center py-6 max-md:py-3 max-md:text-sm">
            <AddCircleOutlineIcon /> <div className="ml-1">공정률 전체보기</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="mb-5 text-lg font-semibold">금일 식수 현황</div>
        <div className="p-7 bg-white flex flex-col rounded-2xl min-h-[420px] h-full">
          <div className="text-[#171C61]">
            출근 인원 <b>{deptTotalCount}명</b> 중,&nbsp;
            <span className="underline">
              중식 인원 <b>{mealTotalCount}명</b>
            </span>{' '}
            입니다.
          </div>
          <div>
            {/* <span className="underline">
              조식 인원 <b>100명</b>
            </span>
            ,{' '} */}
          </div>
          <div className="mt-7 h-4/5 min-h-[300px] w-full">
            <LineChart data={mealStatusData} options={mealStatusOptions}></LineChart>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="mb-5 text-lg font-semibold">금일 안전 현황</div>
        <div className="p-7 bg-white flex flex-col rounded-2xl min-h-[420px] h-full ">
          <div className="flex items-center ">
            <div>
              출근 인원 <b>440명</b> 중{' '}
              <span className="text-[#DE2626]">
                <b>위험 의심 근로자는 50명</b>
              </span>
              입니다.
            </div>
            <div
              className={
                'ml-2 flex items-center text-xs animate-bounce ' +
                (safeStatus === 'up' ? 'text-[#DE2626]' : 'text-[#3C47DD]')
              }>
              <div>0.8%</div>
              {safeStatus == 'up' ? <ArrowDropUp /> : <ArrowDropDown />}
            </div>
          </div>
          <div className="mt-10 flex justify-end gap-x-5">
            <div className="flex gap-x-2 items-center">
              <div className="w-2.5 h-2.5 bg-[#5C62B2] rounded-full"></div>
              <div className="text-sm text-[#555555]">안전근로자</div>
            </div>
            <div className="flex gap-x-2 items-center">
              <div className="w-2.5 h-2.5 bg-[#F894A0] rounded-full"></div>
              <div className="text-sm text-[#555555]">위험근로자</div>
            </div>
          </div>
          <div className="mt-7  h-3/5 max-h-[400px] w-full">
            <BarChart data={safeStatusData} options={safeStatusOptions}></BarChart>
          </div>
        </div>
      </div>
    </main>
  );
}

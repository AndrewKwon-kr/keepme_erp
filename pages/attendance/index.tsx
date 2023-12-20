import Page from 'app/page';
import React, { useEffect, useMemo, useState } from 'react';
import PlusIcon from 'public/icons/ico_more_line.svg';
import Image from 'next/image';

import Link from 'next/link';

import DoughnutChart from 'components/common/DoughnutChart';
import BarChart from 'components/common/BarChart';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function Attendance() {
  const [alignment, setAlignment] = useState<string>('time');
  const [group, setGroup] = useState<number>(0);

  const handleChangeAlignment = (event: any, newAlignment: any) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

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
        label: '인원 ',
        labels: ['노무', '철근', '공무', '비계'],
        data: [12, 19, 3, 5],
        backgroundColor: ['#8169F7', '#2496EF', '#EA3869', '#FFC54E'],
        borderColor: ['#8169F7', '#2496EF', '#EA3869', '#FFC54E'],
        cutout: 90,
      },
    ],
  };

  const departmentStatusOptions = {
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
        formatter: (val: any, ctx: any) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];

          return `${label}`;
        },
      },
    },
  };

  const [dayList, setDayList] = useState<any[]>([]);
  const [timeList, setTimeList] = useState<any[]>([]);

  useEffect(() => {
    let dayArray:any[] = [];
    let timeArray:any[] = [];

    for (let i = 0; i < 7; i++) {
      const today = moment();

      dayArray.push(today.subtract(i, 'd').format('M/DD'));
      timeArray.push(today.subtract(i, 'h').format('HH:mm'));
    }
    setDayList(dayArray.reverse());
    setTimeList(timeArray.reverse());
  }, []);

  const byDayExtendedWorkingTimeData = {
    labels: dayList,
    datasets: [
      {
        labels: dayList,
        data: [12, 19, 3, 5, 1, 2, 3, 4],
        backgroundColor: '#CB5435',
        borderColor: '#CB5435',
        barThickness: 10,
      },
    ],
  };

  const byDayExtendedWorkingTimeOptioins = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: false,
      title: false,
    },
  };

  const byGroupExtendedWorkingTimeData = {
    labels: alignment === 'time' ? timeList : dayList,
    datasets: [
      {
        labels: alignment === 'time' ? timeList : dayList,
        data: alignment === 'time' ? [1, 5, 23, 45, 74, 23, 15] : [12, 19, 3, 5, 1, 2, 3, 4],
        backgroundColor: '#597FB1',
        borderColor: '#597FB1',
        barThickness: 10,
      },
    ],
  };

  const byGroupExtendedWorkingTimeOptioins = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: false,
      title: false,
    },
  };
  const dayoffStatusLabels = ['부서', '연차발생', '연차소진', '잔여연차', '소진율'];
  const dayoffStatusDatas = [
    { department: '철근', allCount: 155, useCount: 100 },
    { department: '공무', allCount: 155, useCount: 100 },
    { department: '비계', allCount: 155, useCount: 100 },
    { department: '노무', allCount: 155, useCount: 100 },
  ];

  const onChangeGroupRunTime = (event:any) => {
    setGroup(event.target.value);
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
                  }>
                  <p className="font-medium">{status.title}</p>
                  <p className="font-semibold text-[#3E56B4]">{status.number}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="min-w-[325px] border rounded-md shadow-box p-5 flex flex-col gap-y-5">
            <p className="text-base text-[#555555]">부서 별 출근현황</p>
            <div className=" h-full flex items-center justify-center">
              <DoughnutChart
                data={departmentStatusData}
                plugins={[ChartDataLabels]}
                options={departmentStatusOptions}
              />
            </div>
          </div>
        </div>
        <div className="border rounded-md shadow-box p-5 flex flex-col overflow-auto">
          <p className="text-base text-[#555555]">부서 별 연차소진 현황</p>
          <table className="mt-[30px] border">
            <thead>
              <tr className="divide-x">
                {dayoffStatusLabels.map((label, index) => (
                  <th key={index} className="bg-[#555555] text-white text-xs font-light py-2">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dayoffStatusDatas.map((data, index) => (
                <tr key={index} className="text-center divide-x divide-y">
                  <td className="px-[30px] py-5 bg-[#F2F3F6] text-[#787878] text-xs border border-b">
                    {data.department}
                  </td>
                  <td className="px-[30px] py-5 text-xs">{data.allCount}</td>
                  <td className="px-[30px] py-5 text-xs">{data.useCount}</td>
                  <td className="px-[30px] py-5 text-xs text-[#3E56B4] font-semibold">
                    {data.allCount - data.useCount}
                  </td>
                  <td className="px-[30px] py-5 text-xs text-[#787878]">
                    {((data.useCount / data.allCount) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border rounded-md shadow-box p-5 flex flex-col gap-y-5">
          <p className="text-base text-[#555555]">날짜 별 연장근무시간</p>
          <div className="h-full">
            <BarChart
              data={byDayExtendedWorkingTimeData}
              options={byDayExtendedWorkingTimeOptioins}
            />
          </div>
        </div>
        <div className="border rounded-md shadow-box p-5 flex flex-col gap-y-5">
          <div className="flex items-center">
            <p className="text-base text-[#555555]">그룹 별 연장근무시간</p>
            <ToggleButtonGroup
              className="ml-auto h-6"
              color="primary"
              value={alignment}
              exclusive
              onChange={handleChangeAlignment}
              aria-label="Platform">
              <ToggleButton value="time">시간별</ToggleButton>
              <ToggleButton value="day">요일별</ToggleButton>
            </ToggleButtonGroup>
          </div>
          <FormControl>
            <Select
              className="h-9 w-[180px] active:outline-none"
              value={group}
              onChange={onChangeGroupRunTime}
              displayEmpty>
              <MenuItem value={0}>철근</MenuItem>
              <MenuItem value={1}>노무</MenuItem>
              <MenuItem value={2}>비계</MenuItem>
              <MenuItem value={3}>공무</MenuItem>
            </Select>
          </FormControl>
          <div className="h-full">
            <BarChart
              data={byGroupExtendedWorkingTimeData}
              options={byGroupExtendedWorkingTimeOptioins}
            />
          </div>
        </div>
        <div className="border rounded-md shadow-box p-5 flex flex-col gap-y-5">
          <p className="text-base text-[#555555]">급여관리 현황</p>
          <Button className="bg-[#597FB1] py-4" variant="contained" color="primary">
            직원 (전체)
          </Button>
          <Button className="bg-[#597FB1] py-4" variant="contained" color="primary">
            업체 (소속)
          </Button>
          <Button className="bg-[#597FB1] py-4" variant="contained" color="primary">
            공정 (부서)
          </Button>
        </div>
      </div>
    </Page>
  );
}

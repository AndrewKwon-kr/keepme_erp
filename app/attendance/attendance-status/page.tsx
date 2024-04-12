'use client';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Page from 'app/page';
import { areaAtom, userAtom } from 'interface/jotai';

import { useAtomValue } from 'jotai';
import { MRT_PaginationState } from 'material-react-table';
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import {
  getAuthUser,
  postData,
  setAuthToken,
  getDeptList,
  getAgencyList,
  getAttDailyList,
  getAttMonthlyList,
} from '../../../api';
import LocalStorage from 'interface/localstorage';
import DayStatusTable from 'components/attendance/DayStatusTable';
import MonthStatusTable from 'components/attendance/MonthStatusTable';

interface Datas {
  data: any[];
  totalCount: number;
}

export default function Attendance() {
  const [alignment, setAlignment] = React.useState('day');
  const [department, setDepartment] = useState<string>('');
  const [departmentItems, setDepartmentItems] = useState<any>([]);
  const [agency, setAgency] = useState<string>('');
  const [agencyItems, setAgencyItems] = useState<any>([]);
  const [name, setName] = useState<string>('');
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<any>(moment().subtract(1, 'M'));
  const [endDate, setEndDate] = useState<any>(moment());
  const [dayTableData, setDayTableData] = useState<any>([]);
  const [monthTableData, setMonthTableData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);

  const mounted = useRef(false);

  const user = JSON.parse(LocalStorage.getItem('authUser'));

  const handleChangeAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    if (newAlignment != alignment) {
      setAlignment(newAlignment);
    } else {
      setAlignment(alignment);
    }
  };

  const initState = () => {
    setDayTableData([]);
    setMonthTableData([]);
    setStartDate(moment().subtract(1, 'M'));
    setEndDate(moment());
    setAgency('');
    setDepartment('');
    setName('');
    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });
  };

  const getBody = (
    userName: any,
    startDate: any,
    endDate: any,
    pageIndex: number,
    rowPerPage: number,
    agency: string,
    department: number | string,
  ) => {
    return {
      userName: userName ?? '',
      startDate: startDate.format('YYYYMMDD'),
      endDate: endDate.format('YYYYMMDD'),
      pageIndex: pageIndex + 1,
      rowPerPage,
      companyCode: Number(user.companyCode),
      deptCode: department != '' ? Number(department) : 9999,
      agencyCode: agency == '' ? user.agencyCode : agency,
    };
  };

  // useEffect(() => {
  //   //do something when the row selection changes...
  //   console.info(rowSelection);
  // }, [rowSelection]);

  useEffect(() => {
    initState();
    if (!mounted.current) {
      mounted.current = true;
    } else {
      if (alignment == 'day') {
        getDailyTableData(getBody('', startDate, endDate, 0, pagination.pageSize, '9999', 9999));
      } else if (alignment == 'month') {
        getMonthlyTableData(
          getBody('', startDate, endDate, 0, pagination.pageSize * 2, '9999', 9999),
        );
      }
    }
  }, [alignment]);

  // 조회기간 바뀔 때 마다 테이블 값 가져오기
  // useEffect(() => {
  //   if (!mounted.current) {
  //     mounted.current = true;
  //   } else {
  //     getDailyTableData(getBody(selectedName, startDate, endDate, 0, pagination.pageSize, agency));
  //   }
  // }, [startDate, endDate]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else if (dayTableData.length > 0) {
      if (alignment == 'day') {
        getDailyTableData(
          getBody(
            selectedName,
            startDate,
            endDate,
            pagination.pageIndex,
            pagination.pageSize,
            agency,
            department,
          ),
        );
      }
    } else if (monthTableData.length > 0) {
      if (alignment == 'month') {
        getMonthlyTableData(
          getBody(
            selectedName,
            startDate,
            endDate,
            pagination.pageIndex,
            pagination.pageSize * 2,
            agency,
            department,
          ),
        );
      }
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  const handleChangeDepartment = (event: any) => {
    const value = event.target.value;

    setDepartment(value);
  };
  const handleChangeAgency = (event: any) => {
    const value = event.target.value;

    setAgency(value);
  };

  const getDailyTableData = async (body: any) => {
    const res = await getAuthUser({
      id: user.userid,
      password: localStorage.getItem('password'),
      deviceToken: '0',
    });

    setIsLoading(true);
    setAuthToken(res.data[0].token);

    try {
      const response: Datas = await getAttDailyList(body);

      setDayTableData(response.data);
      setRowCount(response.totalCount);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMonthlyTableData = async (body: any) => {
    const res = await getAuthUser({
      id: user.userid,
      password: localStorage.getItem('password'),
      deviceToken: '0',
    });

    setIsLoading(true);
    setAuthToken(res.data[0].token);

    try {
      const response: Datas = await getAttMonthlyList(body);

      setMonthTableData(response.data);
      setRowCount(response.totalCount / 2);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeInputName = (value: string) => {
    if (value === '') {
      setSelectedName('');
    } else {
      setSelectedName(value);
    }
  };

  useEffect(() => {
    const initDeptList = async () => {
      try {
        const response = await getDeptList({
          companyCode: user.companyCode,
          agencyCode: user.agencyCode,
        });

        const departmentArray = [...new Map(response.map((val: any) => [val.name, val])).values()];
        setDepartmentItems(departmentArray);
      } catch (error) {
        console.log(error);
      }
    };
    const initAgencytList = async () => {
      try {
        const response = await getAgencyList({
          companyCode: user.companyCode,
          agencyCode: user.agencyCode,
        });
        const AgencyArray = [...new Map(response.map((val: any) => [val.name, val])).values()];

        setAgencyItems(AgencyArray);
      } catch (error) {
        console.log(error);
      }
    };

    initAgencytList();
    initDeptList();
    getDailyTableData(
      getBody(selectedName, startDate, endDate, 0, pagination.pageSize, agency, department),
    );
    // initState();
  }, []);

  const onClickCheckButton = () => {
    if (alignment == 'day') {
      getDailyTableData(
        getBody(selectedName, startDate, endDate, 0, pagination.pageSize, agency, department),
      );
    } else if (alignment == 'month') {
      getMonthlyTableData(
        getBody(selectedName, startDate, endDate, 0, pagination.pageSize * 2, agency, department),
      );
    }
  };
  return (
    <main className="p-10 w-full overflow-x-auto whitespace-nowrap">
      {/* <WorkerStatusModal open={open} setOpen={setOpen} data={selectedWorker}></WorkerStatusModal> */}
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChangeAlignment}
        aria-label="Platform">
        <ToggleButton
          value="day"
          sx={{
            '&.MuiToggleButton-root.Mui-selected': {
              backgroundColor: '#171C61', //use the color you want
              color: 'white',
            },
            '&.MuiToggleButton-root': {
              backgroundColor: 'white', //use the color you want
              color: '#171C61',
              paddingX: '55px',
              border: 'black solid 1px',
              borderRadius: '10px 0 0 10px',
            },
          }}>
          일일 현황
        </ToggleButton>
        <ToggleButton
          value="month"
          sx={{
            '&.MuiToggleButton-root.Mui-selected': {
              backgroundColor: '#171C61', //use the color you want
              color: 'white',
            },
            '&.MuiToggleButton-root': {
              backgroundColor: 'white', //use the color you want
              color: '#171C61',
              paddingX: '55px',
              border: 'black solid 1px',
              borderRadius: '0 10px 10px 0',
            },
          }}>
          월간 현황
        </ToggleButton>
      </ToggleButtonGroup>
      <div className="mt-10 flex items-center gap-x-10">
        <div className="text-[#7A7F94] text-base flex items-center ">
          <div className="">현장</div>
          <FormControl>
            <Select
              className="ml-[30px] h-10 min-w-[250px] active:outline-none bg-white"
              value={agency}
              onChange={handleChangeAgency}
              displayEmpty>
              {agencyItems.map((data: any) => {
                return (
                  <MenuItem key={data.code} value={data.code}>
                    {data.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="text-[#7A7F94] text-base flex items-center">
          <div className="">부서</div>
          <FormControl>
            <Select
              className="ml-[30px] h-10 min-w-[250px] active:outline-none bg-white"
              value={department}
              onChange={handleChangeDepartment}
              displayEmpty>
              {departmentItems.map((data: any) => {
                return (
                  <MenuItem key={data.code} value={data.code}>
                    {data.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="text-[#7A7F94] text-base flex items-center">
          <div className="mr-[30px]">검색</div>
          <TextField
            className="w-[250px] h-10 active:outline-none bg-white"
            size="small"
            id="outlined-controlled"
            placeholder="이름"
            value={name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
              onChangeInputName(event.target.value);
            }}
          />
        </div>
      </div>
      <div className="my-5 flex items-center">
        <div className="text-[#7A7F94] text-base flex items-center">
          <div className="mr-5">조회기간</div>
          <div className="flex items-center">
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                slotProps={{ textField: { size: 'small' } }}
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                className="bg-white"
              />
              &nbsp;&nbsp;&nbsp; ~ &nbsp;&nbsp;&nbsp;
              <DatePicker
                slotProps={{ textField: { size: 'small' } }}
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                className="bg-white"
              />
            </LocalizationProvider>
          </div>
        </div>
        <div
          className="ml-[30px] w-[100px] h-10 rounded-md bg-[#171C61] text-white flex items-center justify-center cursor-pointer"
          onClick={() => onClickCheckButton()}>
          조회
        </div>
      </div>
      {alignment == 'day' ? (
        <DayStatusTable
          data={dayTableData}
          rowCount={rowCount}
          setPagination={setPagination}
          isLoading={isLoading}
          pagination={pagination}
        />
      ) : (
        <MonthStatusTable
          originData={monthTableData}
          rowCount={rowCount}
          setPagination={setPagination}
          isLoading={isLoading}
          pagination={pagination}
        />
      )}
    </main>
  );
}

'use client';

import { FormControl, MenuItem, Select } from '@mui/material';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getAgencyList, getDeptList, getDailyReportList } from 'api';
import ReportTable from 'components/attendance/ReportTable';
import LocalStorage from 'interface/localstorage';

import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export default function Report() {
  const user = JSON.parse(LocalStorage.getItem('authUser'));

  const [department, setDepartment] = useState<string>('');
  const [departmentItems, setDepartmentItems] = useState<any>([]);
  const [agency, setAgency] = useState<string>('');
  const [agencyItems, setAgencyItems] = useState<any>([]);
  const [startDate, setStartDate] = useState<any>(moment());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState([]);
  const [manager, setManager] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [prevComment, setPrevComment] = useState('');
  const [currComment, setCurrComment] = useState('');
  const [totalList, setTotalList] = useState([]);

  const handleChangeDepartment = (event: any) => {
    const value = event.target.value;

    setDepartment(value);
  };
  const handleChangeAgency = (event: any) => {
    const value = event.target.value;

    setAgency(value);
  };

  const onClickCheckButton = () => {
    getReportData();
  };

  const getReportData = async () => {
    setIsLoading(true);
    try {
      const response = await getDailyReportList({
        agencyCode: agency == '' ? user.agencyCode : agency,
        deptCode: Number(department) == 0 ? 9999 : Number(department),
        checkDate: moment(startDate).format('YYYYMMDD'),
      });
      setData(response.detailList);
      setManager(response.employeeList.filter((val: any) => val.manageYn == 1));
      setWorkers(response.employeeList.filter((val: any) => val.manageYn == 0));
      setPrevComment(response.beforeDayRemarks);
      setCurrComment(response.todayRemarks);
      setTotalList(response.deptCountList);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // const initDeptList = async () => {
    //   try {
    //     const response = await getDeptList({
    //       companyCode: user.companyCode,
    //       agencyCode: user.agencyCode,
    //     });

    //     const departmentArray = [...new Map(response.map((val: any) => [val.name, val])).values()];
    //     setDepartmentItems(departmentArray);
    //     setDepartment('9999');
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    const initAgencytList = async () => {
      try {
        const response = await getAgencyList({
          companyCode: user.companyCode,
          agencyCode: user.agencyCode,
          type: 'none',
        });
        const AgencyArray = [...new Map(response.map((val: any) => [val.name, val])).values()];

        setAgencyItems(AgencyArray);
        setAgency(response[0].code);
      } catch (error) {
        console.log(error);
      }
    };

    // initDeptList();
    initAgencytList();
    getReportData();
  }, []);

  return (
    <main className="p-10 w-full overflow-x-auto whitespace-nowrap">
      <div className="flex items-center gap-x-10">
        <div className="text-[#7A7F94] text-base flex items-center ">
          <div className="">현장</div>
          <FormControl>
            <Select
              className="ml-[47px] h-10 min-w-[250px] active:outline-none bg-white"
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
        {/* <div className="text-[#7A7F94] text-base flex items-center">
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
        </div> */}
        <div className="flex items-center">
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
                {/* &nbsp;&nbsp;&nbsp; ~ &nbsp;&nbsp;&nbsp;
              <DatePicker
                slotProps={{ textField: { size: 'small' } }}
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                className="bg-white"
              /> */}
              </LocalizationProvider>
            </div>
          </div>
          <div
            className="ml-[30px] w-[100px] h-10 rounded-md bg-[#171C61] text-white flex items-center justify-center cursor-pointer"
            onClick={() => onClickCheckButton()}>
            조회
          </div>
        </div>
      </div>

      {data?.length > 0 ? (
        <ReportTable
          data={data}
          manager={manager}
          workers={workers}
          isLoading={isLoading}
          setData={setData}
          startDate={startDate}
          agencyCode={agency}
          deptCode={department}
          getReportData={getReportData}
          user={user}
          prevComment={prevComment}
          setPrevComment={setPrevComment}
          currComment={currComment}
          setCurrComment={setCurrComment}
          totalList={totalList}
        />
      ) : (
        <div>데이터가 없습니다.</div>
      )}
    </main>
  );
}

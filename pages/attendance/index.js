import RootLayout from '@/app/layout';
import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { CSVLink } from 'react-csv';
import { Box, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import dayjs from 'dayjs';
// import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useAtomValue } from 'jotai';
import { areaAtom } from '@/app/layout';

export default function Attendance() {
  const [rowSelection, setRowSelection] = useState({});
  const [headers, setHeaders] = useState([]);
  const [belong, setBelong] = useState(1);
  const [startDate, setStartDate] = useState(dayjs());
  const [endtDate, setEndDate] = useState(dayjs());
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const areaValue = useAtomValue(areaAtom);

  const columns = useMemo(() => [
    { accessorKey: 'id', header: 'ID', size: 40 },
    { accessorKey: 'date', header: '일시', size: 120 },
    { accessorKey: 'belong', header: '소속', size: 80 },
    { accessorKey: 'department', header: '부서', size: 80 },
    { accessorKey: 'position', header: '직책', size: 80 },
    { accessorKey: 'name', header: '이름', size: 80 },
    { accessorKey: 'phoneNumber', header: '연락처', size: 120 },
    {
      accessorKey: 'registrationNumber',
      header: '주민번호(등록번호)',
      size: 200,
    },
    { accessorKey: 'startedAt', header: '출근', size: 60 },
    { accessorKey: 'endedAt', header: '퇴근', size: 60 },
  ]);

  useEffect(() => {
    setHeaders(
      columns.map((column) => ({
        label: column.header,
        key: column.accessorKey,
      }))
    );
  }, []);

  useEffect(() => {
    console.log(areaValue);
  }, [areaValue]);
  useEffect(() => {
    //do something when the row selection changes...
    console.info({ rowSelection });
  }, [rowSelection]);

  useEffect(() => {
    console.log(areaAtom);
    getTableData();
  }, []);

  const handleChangeBelong = (event) => {
    setBelong(event.target.value);
  };

  const getTableData = async () => {
    try {
      setTimeout(() => {
        setDatas([
          {
            id: 0,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
          {
            id: 1,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
          {
            id: 2,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
          {
            id: 3,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
          {
            id: 4,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
          {
            id: 5,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
          {
            id: 6,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
          {
            id: 7,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
          {
            id: 8,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
          {
            id: 9,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
          {
            id: 10,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
          {
            id: 11,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
          {
            id: 12,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
          {
            id: 13,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
          {
            id: 14,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
          {
            id: 15,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
          {
            id: 16,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
          {
            id: 17,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
          {
            id: 18,
            date: '2022-05-08',
            belong: '강남건설',
            department: '골조',
            position: '반장',
            name: '강민수',
            phoneNumber: '010-1234-5678',
            registrationNumber: '780102-1122338',
            startedAt: '08:00',
            endedAt: '17:00',
          },
        ]);
        setIsLoading(false);
      }, 2000);
    } finally {
    }
  };

  return (
    <RootLayout>
      <main className="w-full">
        <div className="flex items-center gap-x-10">
          <div className="text-[#7A7F94] text-base flex items-center ">
            <div className="">소속</div>
            <FormControl>
              <Select
                className="ml-[30px] h-[34px] min-w-[250px] active:outline-none"
                value={belong}
                onChange={handleChangeBelong}
                displayEmpty
              >
                <MenuItem value={0}>부산 가야현장</MenuItem>
                <MenuItem value={1}>부산 다대포현장</MenuItem>
                <MenuItem value={2}>김해 장유현장</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="text-[#7A7F94] text-base flex items-center">
            <div className="">부서</div>
            <FormControl>
              <Select
                className="ml-[30px] h-[34px] min-w-[250px] active:outline-none"
                value={belong}
                onChange={handleChangeBelong}
                displayEmpty
              >
                <MenuItem value={0}>골조</MenuItem>
                <MenuItem value={1}>콘크리트</MenuItem>
                <MenuItem value={2}>크레인</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="text-[#7A7F94] text-base flex items-center">
            <div className="">이름</div>
            <FormControl>
              <Select
                className="ml-[30px] h-[34px] min-w-[250px] active:outline-none"
                value={belong}
                onChange={handleChangeBelong}
                displayEmpty
              >
                <MenuItem value={0}>부산 가야현장</MenuItem>
                <MenuItem value={1}>부산 다대포현장</MenuItem>
                <MenuItem value={2}>김해 장유현장</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="my-5 flex items-center">
          <div className="text-[#7A7F94] text-base flex items-center">
            <div className="mr-5">조회기간</div>
            <div className="flex items-center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  slotProps={{ textField: { size: 'small' } }}
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                />
                &nbsp;&nbsp;&nbsp; ~ &nbsp;&nbsp;&nbsp;
                <DatePicker
                  slotProps={{ textField: { size: 'small' } }}
                  value={endtDate}
                  onChange={(newValue) => setEndDate(newValue)}
                />
              </LocalizationProvider>
            </div>
          </div>
        </div>
        <MaterialReactTable
          columns={columns}
          data={datas}
          enableRowSelection
          enableStickyHeader
          enableStickyFooter
          muiTableContainerProps={{
            sx: {
              display: 'block',
              maxHeight: 700,
              width: '100%',
              maxWidth: '100%',
              overflowX: 'auto',
            },
          }}
          getRowId={(row) => row.id} //give each row a more useful id
          onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
          state={{ rowSelection, isLoading: isLoading }} //pass our managed row selection state to the table to use
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: '#F2F3F6',
              BorderStyle: 'solid',
              borderWidth: '1px 0px 1px 0px',
              borderColor: 'black black black black',
            },
          }}
          renderTopToolbar={({ table }) => (
            <Box
              sx={{
                display: 'flex',
                gap: '1rem',
                p: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              {datas.length > 0 && (
                <Button
                  color="primary"
                  startIcon={<FileDownloadIcon />}
                  variant="outlined"
                >
                  <CSVLink
                    asyncOnClick={true}
                    data={datas}
                    headers={headers}
                    filename={'20240907_근태.csv'}
                  >
                    엑셀 다운로드
                  </CSVLink>
                </Button>
              )}
            </Box>
          )}
          // renderTopToolbarCustomActions={({ table }) => (
          //   <Box
          //     sx={{
          //       display: 'flex',
          //       gap: '1rem',
          //       p: '0.5rem',
          //       flexWrap: 'wrap',
          //     }}
          //   >
          //     {datas.length > 0 && (
          //       <Button
          //         color="primary"
          //         //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
          //         startIcon={<FileDownloadIcon />}
          //         variant="outlined"
          //       >
          //         <CSVLink
          //           asyncOnClick={true}
          //           data={datas}
          //           headers={headers}
          //           filename={'20240907_근태.csv'}
          //         >
          //           엑셀 다운로드
          //         </CSVLink>
          //       </Button>
          //     )}
          //     <Button
          //         disabled={table.getRowModel().rows.length === 0}
          //         //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          //         startIcon={<FileDownloadIcon />}
          //         variant="outlined"
          //       >
          //         <CSVLink
          //           data={table.getRowModel().rows.map((row) => row.original)}
          //           headers={headers}
          //           filename={'20240907_근태.csv'}
          //         >
          //           현재 페이지 엑셀다운
          //         </CSVLink>
          //       </Button>
          //     <Button
          //       disabled={
          //         !table.getIsSomeRowsSelected() &&
          //         !table.getIsAllRowsSelected()
          //       }
          //       startIcon={<FileDownloadIcon />}
          //       variant="outlined"
          //     >
          //       <CSVLink
          //         data={table
          //           .getSelectedRowModel()
          //           .rows.map((row) => row.original)}
          //         headers={headers}
          //         filename={'20240907_선택된_근로자_근태.csv'}
          //       >
          //         선택된 열 엑셀다운
          //       </CSVLink>
          //     </Button>
          //   </Box>
          // )}
        />
      </main>
    </RootLayout>
  );
}

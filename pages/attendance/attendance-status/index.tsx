import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Page, { areaAtom, userAtom } from 'app/page';
import { useAtomValue } from 'jotai';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { TransitionProps } from '@mui/material/transitions';
import { getAuthUser, postData, setAuthToken, getDeptList } from '../../../api';
import WorkerStatusModal from '../../../components/attendance/WorkerStatusModal';

// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & {
//     children: React.ReactElement<any, any>;
//   },
//   ref: React.Ref<unknown>,
// ) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });
// type filterType = {};
// interface AutocompleteItem {
//   id: number;
//   name: string;
// }

export default function Attendance() {
  const router = useRouter();
  const [rowSelection, setRowSelection] = useState<{}>({});
  // const [headers, setHeaders] = useState<headerType[]>([]);
  const [belong, setBelong] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [departmentItems, setDepartmentItems] = useState<any>([]);
  const [name, setName] = useState<string>('');
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<any>(moment().subtract(1, 'M'));
  const [endDate, setEndDate] = useState<any>(moment());
  const [originData, setOriginData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [checked, setChecked] = useState<boolean>(false);
  const [options, setOptions] = useState<any>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedWorker, setSelectedWorker] = useState<any>([]);

  const mounted = useRef(false);

  // const [selectedMember, setSelectedMember] = useState<{
  //   name: '';
  //   originImageUrl: '';
  //   todayImageUrl: '';
  // }>({ name: '', originImageUrl: '', todayImageUrl: '' });

  const areaValue = useAtomValue(areaAtom);
  const user = useAtomValue(userAtom);

  const headers = [
    {
      label: 'ID',
      key: 'userID',
    },
    {
      label: '일시',
      key: 'workDate',
    },
    {
      label: '회사',
      key: 'company',
    },
    {
      label: '소속',
      key: 'agency',
    },
    {
      label: '부서',
      key: 'department',
    },
    // {
    //   label: '직책',
    //   key: 'position',
    // },
    {
      label: '이름',
      key: 'userName',
    },
    // {
    //   label: '연락처',
    //   key: 'phoneNumber',
    // },
    // {
    //   label: '주민번호(등록번호)',
    //   key: 'registrationNumber',
    // },
    {
      label: '출근',
      key: 'firstInTime',
    },
    {
      label: '퇴근',
      key: 'lastOutTime',
    },
    // {
    //   label: '상태',
    //   key: 'status',
    // },
  ];

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'userId',
        header: 'ID',
        size: 20,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'workDate',
        header: '일시',
        size: 80,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ cell }: any) => <div>{moment(cell.getValue()).format('YYYY-MM-DD')}</div>,
      },
      {
        accessorKey: 'company',
        header: '회사',
        size: 80,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'agency',
        header: '소속',
        size: 80,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'department',
        header: '부서',
        size: 80,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      // {
      //   accessorKey: 'position',
      //   header: '직책',
      //   size: 80,
      //   muiTableHeadCellProps: {
      //     align: 'center',
      //   },
      //   muiTableBodyCellProps: {
      //     align: 'center',
      //   },
      // },
      {
        accessorKey: 'userName',
        header: '이름',
        size: 80,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      // {
      //   accessorKey: 'phoneNumber',
      //   header: '연락처',
      //   size: 120,
      //   enableClickToCopy: true,
      //   Cell: ({ cell }: any) => (
      //     <div className="font-bold bg-pink-200">{cell.getValue().substring(0, 9)}****</div>
      //   ),
      //   muiTableHeadCellProps: {
      //     align: 'center',
      //   },
      //   muiTableBodyCellProps: {
      //     align: 'center',
      //   },
      // },
      // {
      //   accessorKey: 'registrationNumber',
      //   header: '주민번호(등록번호)',
      //   size: 120,
      //   enableClickToCopy: true,
      //   Cell: ({ cell }: any) => (
      //     <div className="font-bold text-blue-700">{cell.getValue().substring(0, 8)}******</div>
      //   ),
      //   muiTableHeadCellProps: {
      //     align: 'center',
      //   },
      //   muiTableBodyCellProps: {
      //     align: 'center',
      //   },
      // },
      {
        accessorKey: 'firstInTime',
        header: '출근',
        size: 60,
        Cell: ({ cell }: any) => (
          <div>{cell.getValue() ? moment(cell.getValue()).format('HH:mm') : ''}</div>
        ),
      },
      {
        accessorKey: 'lastOutTime',
        header: '퇴근',
        size: 60,
        Cell: ({ cell }: any) => (
          <div>{cell.getValue() ? moment(cell.getValue()).format('HH:mm') : ''}</div>
        ),
      },
      {
        accessorKey: 'firstInTimePictureData',
        header: '출근 모습',
        size: 60,
        Cell: ({ cell }: any) => (
          <div>
            {cell.getValue() ? (
              <img className="rounded-md" src={`data:image/png;base64,${cell.getValue()}`} />
            ) : (
              ''
            )}
          </div>
          // <div>{cell.getValue() ? moment(cell.getValue()).format('HH:mm') : ''}</div>
        ),
      },
      {
        accessorKey: 'lastOutPictureData',
        header: '퇴근 모습',
        size: 60,
        Cell: ({ cell }: any) => (
          <div>
            {cell.getValue() ? (
              <img className="rounded-md" src={`data:image/png;base64,${cell.getValue()}`} />
            ) : (
              ''
            )}
          </div>
        ),
      },
      // { accessorKey: 'status', header: '상태', size: 60 },
      // {
      //   accessorKey: '1',
      //   header: '사진 비교',
      //   size: 60,
      //   Cell: ({ cell }) => (
      //     <div
      //       className="font-bold text-blue-700 underline cursor-pointer"
      //       onClick={() => handleClickOpen(cell.getValue())}>
      //       확인
      //     </div>
      //   ),
      //   muiTableHeadCellProps: {
      //     align: 'center',
      //   },
      //   muiTableBodyCellProps: {
      //     align: 'center',
      //   },
      // },
    ],
    [],
  );

  // const [open, setOpen] = useState<boolean>(false);

  // const handleClickOpen = (value: any) => {
  //   const member = originData.filter((data: any) => data.id == value)[0];
  //   console.log(originData);

  //   if (member) {
  //     setSelectedMember(member);

  //     if (member.todayImageUrl) {
  //       setOpen(true);
  //     } else {
  //       alert('아직 출근 전입니다.');
  //     }
  //   } else {
  //     console.log(originData);
  //   }
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  // useEffect(() => {
  //   const header = columns.map((column) => ({
  //     label: column.header,
  //     key: column.accessorKey
  //   }))
  //   console.log(header)

  // }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      initState();
      getTableData(getBody(selectedName, startDate, endDate));
    }
  }, [areaValue]);

  const initState = () => {
    setStartDate(moment().subtract(1, 'M'));
    setEndDate(moment());
    setDepartment('');
    setName('');
  };

  const getBody = (userName: any, startDate: any, endDate: any) => {
    return {
      userName: userName ?? '',
      startDate: startDate.format('YYYYMMDD'),
      endDate: endDate.format('YYYYMMDD'),
    };
  };

  useEffect(() => {
    //do something when the row selection changes...
    console.info(rowSelection);
  }, [rowSelection]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      getTableData(getBody(selectedName, startDate, endDate));
    }
    // const start = startDate.startOf('day');
    // const end = endDate.endOf('day');

    // if (name == '') {
    //   setFilteredData(
    //     originData.filter(
    //       (data: any) =>
    //         moment(data.date).isSameOrAfter(start) && moment(data.date).isSameOrBefore(end),
    //     ),
    //   );
    // } else {
    //   setFilteredData(
    //     originData.filter(
    //       (data: any) =>
    //         moment(data.date).isSameOrAfter(start) &&
    //         moment(data.date).isSameOrBefore(end) &&
    //         data.name == name,
    //     ),
    //   );
    // }
  }, [startDate, endDate]);

  // useEffect(() => {
  //   console.log(4);
  //   getTableData();

  //   // const start = startDate.startOf('day');
  //   // const end = endDate.endOf('day');

  //   // setFilteredData(
  //   //   originData.filter(
  //   //     (data: any) =>
  //   //       moment(data.date).isSameOrAfter(start) &&
  //   //       moment(data.date).isSameOrBefore(end) &&
  //   //       data.name == name,
  //   //   ),
  //   // );
  // }, [name]);

  const handleChangeBelong = (event: any) => {
    setBelong(event.target.value);
  };

  const handleChangeDepartment = (event: any) => {
    const value = event.target.value;

    setDepartment(value);
    getTableData(getBody(selectedName, startDate, endDate));
    // if (value === '') {
    //   setSelectedName(null);
    // } else {
    //   if (selectedName !== null) {
    //     setFilteredData(
    //       originData.filter((data: any) => data.name == selectedName && data.department == value),
    //     );
    //   } else {
    //     setFilteredData(originData.filter((data: any) => data.department == value));
    //   }
    //   setChecked(false);
    // }
  };

  const onClickPeriod = (period: any) => {
    const start = moment().subtract(period, 'M');
    const end = moment();
    setStartDate(start);
    setEndDate(end);
  };

  interface User {
    userName: string;
    startDate: string;
    endDate: string;
  }
  interface Classes {
    data: any[];
  }

  const getTableData = async (body: any) => {
    const res = await getAuthUser();

    setIsLoading(true);
    setAuthToken(res[0].token);

    try {
      const response: Classes = await postData('/FaceDevice/FaceUserWorkTimeSelect', body);
      // let array: any[] = response.data;

      const nameArray = [
        ...new Map(response.data.map((val: any) => [val.userName, val])).values(),
      ].map((val) => {
        return { label: val.userName, id: val.userId };
      });

      setOriginData(response.data);
      setOptions(nameArray);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickAddMember = () => {
    console.log('click!!');
  };

  const onClickRemoveMember = () => {
    if (confirm(`${Object.keys(rowSelection).length}명의 데이터를 삭제하시겠습니까?`)) {
      alert('삭제가 완료되었습니다.');
      getTableData(getBody(selectedName, startDate, endDate));
      setRowSelection({});
    }
  };

  const onChangeInputName = (value: string) => {
    const body = getBody(value ?? '', startDate, endDate);

    if (value === '') {
      setSelectedName('');
      getTableData(body);
    } else {
      setSelectedName(value);
      getTableData(body);
    }

    // if (value === null) {
    //   setSelectedName('');
    //   getTableData();
    // } else {
    //   setSelectedName(value.userName);
    //   getTableData();
    // }

    // if (value !== '' && value !== null && department == '') {
    //   setChecked(false);
    //   setFilteredData(originData.filter((data: any) => data.name == value.name));
    // } else if (value !== '' && value !== null && department != '') {
    //   setFilteredData(
    //     originData.filter((data: any) => data.name == value.name && data.department == department),
    //   );
    // } else {
    //   if (department) {
    //     setFilteredData(originData.filter((data: any) => data.department == department));
    //   } else {
    //     setChecked(true);
    //   }
    // }
  };

  useEffect(() => {
    const deptList = async () => {
      try {
        const response = await getDeptList({
          companyCode: user.companyCode,
          agencyCode: user.agencyCode,
          employeeCode: user.code,
        });

        const departmentArray = [...new Map(response.map((val: any) => [val.Name, val])).values()];

        setDepartmentItems(departmentArray);
      } catch (error) {
        console.log(error);
      }
    };

    deptList();
  }, []);

  return (
    <Page>
      <main className="p-5 w-full overflow-x-auto whitespace-nowrap">
        <WorkerStatusModal open={open} setOpen={setOpen} data={selectedWorker}></WorkerStatusModal>
        <div className="flex items-center gap-x-10">
          {/* <div className="text-[#7A7F94] text-base flex items-center ">
            <div className="">소속</div>
            <FormControl>
              <Select
                className="ml-[30px] h-[56px] min-w-[250px] active:outline-none"
                value={belong}
                onChange={handleChangeBelong}
                displayEmpty>
                {originData.map((data: any) => {
                  return <MenuItem value={data.department}>{data.department}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </div> */}
          <div className="text-[#7A7F94] text-base flex items-center">
            <div className="">부서</div>
            <FormControl>
              <Select
                className="ml-[30px] h-[56px] min-w-[250px] active:outline-none"
                value={department}
                onChange={handleChangeDepartment}
                displayEmpty>
                <MenuItem value={''}>-</MenuItem>
                {departmentItems.map((data: any) => {
                  return (
                    <MenuItem key={data.Code} value={data.Name}>
                      {data.Name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <div className="text-[#7A7F94] text-base flex items-center">
            <div className="">이름</div>
            <TextField
              className="ml-[30px] w-[250px] active:outline-none"
              id="outlined-controlled"
              placeholder="이름"
              value={name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setName(event.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onChangeInputName(name);
                  // write your functionality here
                }
              }}
            />
            {/* <Autocomplete
              className="ml-[30px] active:outline-none"
              disablePortal
              options={options}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionLabel={(option: any) => option.label || ''}
              renderOption={(props, option: any) => (
                <li {...props} key={option.id}>
                  {option.label}
                </li>
              )}
              sx={{ width: 250 }}
              onChange={(e, value) => onChangeInputName(e, value)}
              // value={selectedName}
              renderInput={(params) => <TextField sx={{ width: 250 }} {...params} />}
            /> */}
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
                />
                &nbsp;&nbsp;&nbsp; ~ &nbsp;&nbsp;&nbsp;
                <DatePicker
                  slotProps={{ textField: { size: 'small' } }}
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className="ml-5 flex items-center gap-x-5">
            <Button
              className="bg-[#555555] w-20"
              variant="contained"
              onClick={() => onClickPeriod(1)}>
              1개월
            </Button>
            <Button
              className="bg-[#555555] w-20"
              variant="contained"
              onClick={() => onClickPeriod(3)}>
              3개월
            </Button>
            <Button
              className="bg-[#555555] w-20"
              variant="contained"
              onClick={() => onClickPeriod(6)}>
              6개월
            </Button>
          </div>
          {/* <div className="ml-5 text-[#7A7F94] text-base flex items-center">
            전체 보기
            <Switch
              checked={checked}
              onChange={() => setChecked(!checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div> */}
        </div>
        {/* <Box> */}
        <MaterialReactTable
          columns={columns}
          data={originData}
          enableRowSelection
          enableStickyHeader
          enableStickyFooter
          enableColumnActions={false}
          // enableSorting={false}
          muiTableContainerProps={{
            sx: {
              maxHeight: 700,
              width: '100%',
              maxWidth: '100%',
              overflow: 'auto',
            },
          }}
          getRowId={(row: any) => row.id} //give each row a more useful id
          onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
          state={{ rowSelection, isLoading: isLoading }} //pass our managed row selection state to the table to use
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: '#F2F3F6',
              borderStyle: 'solid',
              borderWidth: '1px 0px 1px 0px',
              borderColor: 'black black black black',
            },
          }}
          renderTopToolbarCustomActions={({ table }) =>
            originData.length > 0 && (
              <div className="w-full flex items-center gap-x-5">
                <Button
                  color="primary"
                  //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                  startIcon={<FileDownloadIcon />}
                  variant="outlined">
                  <CSVLink
                    asyncOnClick={true}
                    data={originData}
                    headers={headers}
                    filename={'20240907_근태.csv'}>
                    엑셀 다운로드
                  </CSVLink>
                </Button>
                <Button
                  disabled={table.getRowModel().rows.length === 0}
                  //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                  startIcon={<FileDownloadIcon />}
                  variant="outlined">
                  <CSVLink
                    data={table.getRowModel().rows.map((row) => row.original)}
                    headers={headers || undefined}
                    filename={'20240907_근태.csv'}>
                    현재 페이지 엑셀다운
                  </CSVLink>
                </Button>
                <Button
                  disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                  startIcon={<FileDownloadIcon />}
                  variant="outlined">
                  <CSVLink
                    data={table.getSelectedRowModel().rows.map((row) => row.original)}
                    headers={headers}
                    filename={'20240907_선택된_근로자_근태.csv'}>
                    선택된 열 엑셀다운
                  </CSVLink>
                </Button>
                <Button
                  className="ml-auto"
                  variant="outlined"
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  onClick={onClickAddMember}>
                  사람 추가
                </Button>
                <Button
                  className=""
                  variant="outlined"
                  color="error"
                  startIcon={<PersonRemoveIcon />}
                  disabled={Object.keys(rowSelection).length === 0}
                  onClick={onClickRemoveMember}>
                  사람 삭제
                </Button>
              </div>
            )
          }
          muiTableBodyRowProps={({ row }) => ({
            onDoubleClick: (event) => {
              setOpen(true);
              setSelectedWorker(row.original);
              console.log(row.id);
              // alert(`ID: ${row.id} 더블클릭!`);
            },
          })}
        />
        <Button
          className="mt-5"
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => router.back()}>
          이전 페이지로
        </Button>
        {/* <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description">
          <DialogTitle>해당 근로자({selectedMember.name})의 사진이 서로 일치합니까?</DialogTitle>
          <DialogContent>
            <div className="w-full grid grid-cols-2">
              <div className="flex flex-col items-center justify-center">
                <img className="h-3/4" src={selectedMember.originImageUrl} />
                <span className="mt-5">등록된 사진</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <img className="aspect-auto h-3/4" src={selectedMember.todayImageUrl} />
                <span className="mt-5">오늘자 사진</span>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>아니오</Button>
            <Button onClick={handleClose}>예</Button>
          </DialogActions>
        </Dialog> */}
      </main>
    </Page>
  );
}

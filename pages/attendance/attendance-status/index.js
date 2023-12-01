import Page from '@/app/page';
import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { CSVLink } from 'react-csv';
import { Box, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAtomValue } from 'jotai';
import { areaAtom } from '@/app/page';
import moment from 'moment';
import { useRouter } from 'next/router';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
import Alert from '@mui/material/Alert';

export default function Attendance() {
  const router = useRouter();
  const [rowSelection, setRowSelection] = useState({});
  const [headers, setHeaders] = useState([]);
  const [belong, setBelong] = useState(1);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [originData, setOriginData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [checked, setChecked] = useState(true);
  const [selectedMember, setSelectedMember] = useState({});

  const areaValue = useAtomValue(areaAtom);

  const columns = useMemo(() => [
    {
      accessorKey: 'id',
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
      accessorKey: 'date',
      header: '일시',
      size: 80,
      muiTableHeadCellProps: {
        align: 'center',
      },
      muiTableBodyCellProps: {
        align: 'center',
      },
    },
    {
      accessorKey: 'belong',
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
    {
      accessorKey: 'position',
      header: '직책',
      size: 80,
      muiTableHeadCellProps: {
        align: 'center',
      },
      muiTableBodyCellProps: {
        align: 'center',
      },
    },
    {
      accessorKey: 'name',
      header: '이름',
      size: 80,
      muiTableHeadCellProps: {
        align: 'center',
      },
      muiTableBodyCellProps: {
        align: 'center',
      },
    },
    {
      accessorKey: 'phoneNumber',
      header: '연락처',
      size: 120,
      enableClickToCopy: true,
      Cell: ({ cell }) => (
        <div className="font-bold bg-pink-200">{cell.getValue().substring(0, 9)}****</div>
      ),
      muiTableHeadCellProps: {
        align: 'center',
      },
      muiTableBodyCellProps: {
        align: 'center',
      },
    },
    {
      accessorKey: 'registrationNumber',
      header: '주민번호(등록번호)',
      size: 120,
      enableClickToCopy: true,
      Cell: ({ cell }) => (
        <div className="font-bold text-blue-700">{cell.getValue().substring(0, 8)}******</div>
      ),
      muiTableHeadCellProps: {
        align: 'center',
      },
      muiTableBodyCellProps: {
        align: 'center',
      },
    },
    { accessorKey: 'startedAt', header: '출근', size: 60 },
    { accessorKey: 'endedAt', header: '퇴근', size: 60 },
    {
      accessorKey: '1',
      header: '사진 비교',
      size: 60,
      Cell: ({ cell }) => (
        <div
          className="font-bold text-blue-700 underline cursor-pointer"
          onClick={() => handleClickOpen(cell.getValue())}>
          확인
        </div>
      ),
      muiTableHeadCellProps: {
        align: 'center',
      },
      muiTableBodyCellProps: {
        align: 'center',
      },
    },
    // { accessorKey: '2', header: '2', size: 60 },
    // { accessorKey: '3', header: '3', size: 60 },
    // { accessorKey: '4', header: '4', size: 60 },
    // { accessorKey: '5', header: '5', size: 60 },
  ]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = (value) => {
    const member = originData.filter((data) => data.id == value)[0];

    setSelectedMember(member);

    if (member.todayImageUrl) {
      setOpen(true);
    } else {
      alert('아직 출근 전입니다.');
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setHeaders(
      columns.map((column) => ({
        label: column.header,
        key: column.accessorKey,
      })),
    );
  }, []);

  useEffect(() => {
    getTableData();
    initState();
  }, [areaValue]);

  const initState = () => {
    setStartDate(moment());
    setEndDate(moment());
    setChecked(true);
  };

  useEffect(() => {
    //do something when the row selection changes...
    console.info(rowSelection);
  }, [rowSelection]);

  useEffect(() => {
    console.log('start : ', startDate.format('YYYY-MM-DD'));
    console.log('end : ', endDate.format('YYYY-MM-DD'));
    const start = startDate.startOf('day');
    const end = endDate.endOf('day');

    if (name == '') {
      setFilteredData(
        originData.filter(
          (data) => moment(data.date).isSameOrAfter(start) && moment(data.date).isSameOrBefore(end),
        ),
      );
    } else {
      setFilteredData(
        originData.filter(
          (data) =>
            moment(data.date).isSameOrAfter(start) &&
            moment(data.date).isSameOrBefore(end) &&
            data.name == name,
        ),
      );
    }
  }, [startDate, endDate]);
  useEffect(() => {
    const start = startDate.startOf('day');
    const end = endDate.endOf('day');

    setFilteredData(
      originData.filter(
        (data) =>
          moment(data.date).isSameOrAfter(start) &&
          moment(data.date).isSameOrBefore(end) &&
          data.name == name,
      ),
    );
  }, [name]);

  useEffect(() => {
    getTableData();
  }, []);

  const handleChangeBelong = (event) => {
    setBelong(event.target.value);
  };
  const onClickPeriod = (period) => {
    const start = moment().subtract(period, 'M');
    const end = moment();
    setStartDate(start);
    setEndDate(end);
  };

  const getTableData = () => {
    setIsLoading(true);

    let array = [];
    let now = moment();

    for (let i = 0; i < 40; i++) {
      array[i] = {
        id: i,
        date: now.subtract(1, 'day').format('YYYY-MM-DD'),
        belong: '강남건설',
        department: '골조',
        position: i < 10 ? '사원' : i < 20 ? '주임' : i < 30 ? '대리' : '과장',
        name: '강민수' + i,
        phoneNumber: '010-1234-5678',
        registrationNumber: '780102-1122338',
        startedAt: '08:00',
        endedAt: '17:00',
        1: i,
        originImageUrl:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUWRQcyRNDhGpkoRvgSTtiYMI1T_8PPgLwEA&usqp=CAU',
        todayImageUrl:
          i < 5
            ? 'https://thumb.mt.co.kr/06/2023/06/2023062717453220668_1.jpg/dims/optimize/'
            : null,
      };
    }
    try {
      setTimeout(() => {
        setOriginData(array);
        setFilteredData(array);
        setIsLoading(false);
      }, 2000);
    } finally {
      // console.log(array);
    }
  };
  const onClickAddMember = () => {
    console.log('click!!');
  };
  const onClickRemoveMember = () => {
    if (confirm(`${Object.keys(rowSelection).length}명의 데이터를 삭제하시겠습니까?`)) {
      alert('삭제가 완료되었습니다.');
      getTableData();
      setRowSelection({});
    }
  };
  const onClickFaceCheck = (value) => {
    alert(value);
  };

  return (
    <Page>
      <main className="p-5 w-full overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-x-10">
          <div className="text-[#7A7F94] text-base flex items-center ">
            <div className="">소속</div>
            <FormControl>
              <Select
                className="ml-[30px] h-[34px] min-w-[250px] active:outline-none"
                value={belong}
                onChange={handleChangeBelong}
                displayEmpty>
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
                displayEmpty>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                displayEmpty>
                {originData.map((data) => (
                  <MenuItem key={data.id} value={data.name}>
                    {data.name}
                  </MenuItem>
                ))}
                {/* <MenuItem value={0}>부산 가야현장</MenuItem>
                <MenuItem value={1}>부산 다대포현장</MenuItem>
                <MenuItem value={2}>김해 장유현장</MenuItem> */}
              </Select>
            </FormControl>
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
                  disabled={checked}
                />
                &nbsp;&nbsp;&nbsp; ~ &nbsp;&nbsp;&nbsp;
                <DatePicker
                  slotProps={{ textField: { size: 'small' } }}
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  disabled={checked}
                />
              </LocalizationProvider>
            </div>
          </div>
          <div className="ml-5 flex items-center gap-x-5">
            <Button
              className="bg-[#555555] w-20"
              variant="contained"
              onClick={() => onClickPeriod(1)}
              disabled={checked}>
              1개월
            </Button>
            <Button
              className="bg-[#555555] w-20"
              variant="contained"
              onClick={() => onClickPeriod(3)}
              disabled={checked}>
              3개월
            </Button>
            <Button
              className="bg-[#555555] w-20"
              variant="contained"
              onClick={() => onClickPeriod(6)}
              disabled={checked}>
              6개월
            </Button>
          </div>
          <div className="ml-5 text-[#7A7F94] text-base flex items-center">
            전체 보기
            <Switch
              checked={checked}
              onChange={() => setChecked(!checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
        </div>
        {/* <Box> */}
        <MaterialReactTable
          columns={columns}
          data={checked ? originData : filteredData}
          enableRowSelection
          enableStickyHeader
          enableStickyFooter
          enableColumnActions={false}
          enableSorting={false}
          muiTableContainerProps={{
            sx: {
              maxHeight: 700,
              width: '100%',
              maxWidth: '100%',
              overflow: 'auto',
            },
          }}
          getRowId={(row) => row.id} //give each row a more useful id
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
            filteredData.length > 0 && (
              <div className="w-full flex items-center gap-x-5">
                <Button
                  color="primary"
                  //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                  startIcon={<FileDownloadIcon />}
                  variant="outlined">
                  <CSVLink
                    asyncOnClick={true}
                    data={filteredData}
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
                    headers={headers}
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
              alert(`ID: ${row.id} 더블클릭!`);
              // console.info(event, row.id);
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
        <Dialog
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
        </Dialog>
      </main>
    </Page>
  );
}

import React, { useEffect, useMemo, useState } from 'react';

import { Modal, IconButton, Chip, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LineChart from 'components/common/LineChart';

import { MRT_ColumnDef, MRT_PaginationState, MaterialReactTable } from 'material-react-table';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { ResUserVitalSignList } from 'interface/response';
import { getUserVitalSign, getUserVitalSignHistory } from 'api/Worker';

interface ModalProps {
  isModal: boolean,
  worker: ResUserVitalSignList,
  toggle: Function,
  user: any
};

const chartData = {
  labels: ['', '', '', '', '', '', ''],
  datasets: [
    {
      label: '심박수',
      data: [87, 88, 90, 102, 124, 100, 88],
      borderColor: '#5C62B2',
      backgroundColor: '#5C62B2',
    },
    {
      label: '체온',
      data: [36.5, 36.7, 36.8, 37.6, 27.5, 27.5, 27.5],
      borderColor: '#F894A0',
      backgroundColor: '#F894A0',
    },
  ],
};

const chartOption = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

const WorkerStatusModal = ({ isModal, toggle, worker, user }: ModalProps) => {
  const [tabs, setTabs] = useState([
    { label: '실시간', isOpen: true },
    { label: '일별', isOpen: false },
    { label: '기간별', isOpen: false },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState([]);
  const [totalCnt, setTotalCount] = useState<number>(0);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorFn: (row) => moment(row.vitalDate).format('YYYY-MM-DD HH:mm:ss'),
        header: '측정시간',
      },

      {
        accessorKey: 'temperature',
        header: '체온',
        Cell: ({ cell }: any) => <div>{cell.getValue()}°C</div>,
      },
      {
        accessorKey: 'heartbeat',
        header: '심박수',
        Cell: ({ cell }: any) => <div>{cell.getValue()}회</div>,
      },
      {
        accessorKey: 'spo2',
        header: '산소포화도',
        Cell: ({ cell }: any) => <div>{cell.getValue()}%</div>,
      },
      {
        accessorKey: 'state',
        header: '상태',
        Cell: ({ row }) =>
          row.original.state === '정상' ? (
            <Chip color="success" size="small" label={row.original.state} />
          ) : (
            <Chip color="error" size="small" label={row.original.state} />
          ),
      },
      {
        accessorKey: 'deviceBattery',
        header: '배터리',
        Cell: ({ cell }: any) => <div>{cell.getValue()}%</div>,
      },
    ],
    [],
  );

  const getUserVitalSignCurrentData = () => {
    const today = moment().format('YYYYMMDD');
    var body = {
      userCode: worker.userCode,
      vitalSignDate: today,
      employeeCode: user.code,
    };
    var response = getUserVitalSign(body);
    response.then((data) => {
      console.log(data)
      return data
    });
  };

  const getUserVitalSignRealData = () => {
    setIsLoading(true)
    var body = {
      userCode: worker.userCode,
      startDate: moment(startDate).format('YYYYMMDD'),
      endDate: moment(endDate).format('YYYYMMDD'),
      vitalSignState: 0,
      employeeCode: user.code, 
      pageIndex: pagination.pageIndex + 1,
      rowPerPage: pagination.pageSize
    };
    var response = getUserVitalSignHistory(body);
    response.then(res => {
      console.log(res)
      var { result, totalCount, data } = res;
      if (result === 0) {
        setTableData(data)
        setTotalCount(totalCount);
      }
    })
    .finally(()=> setIsLoading(false));
  };

  useEffect(() => {
    getUserVitalSignCurrentData();
  },[]);

  useEffect(() => {
    getUserVitalSignRealData();
  },[pagination]);

  useEffect(() => {
    var label = tabs.filter((tab)=> tab.isOpen)[0].label;
    if (label === '실시간') {
      setStartDate(moment());
      setEndDate(moment());
      getUserVitalSignRealData();
    } else if (label === '기간별') {
      setEndDate(moment());
      getUserVitalSignRealData();
    }
  },[tabs]);

  const handleClose = () => {
    toggle();
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case '정상':
        return <Chip label={status} color="primary" />;
      case '주의':
        return <Chip label={status} color="success" />;
      case '위험':
        return <Chip label={status} color="warning" />;
      default:
        return <Chip label="?" color="info" />;
    }
  };

  const onClickTab = (tabIndex: number) => {
    setTabs(
      tabs.map((tab, index) => {
        if (tabIndex == index) {
          return { label: tab.label, isOpen: true };
        } else return { label: tab.label, isOpen: false };
      }),
    );
  };

  const onChangeStartDate = (e: any) => {
    setStartDate(e);
    if (tabs.filter(tab => tab.isOpen)[0].label === '일별') {
      setEndDate(e);
    }
  };

  const onChangeEndDate = (e: any) => {
    setEndDate(e);
  };
  
  const onClickSearch = () => {
    getUserVitalSignRealData();
  };

  return (
    <Modal
      open={isModal}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
      disableAutoFocus={true}>
      <div
        className="absolute top-1/2 left-1/2 w-[1140px] h-[880px] rounded-md bg-white flex flex-col"
        style={{ transform: 'translate(-50%, -50%)' }}>
        {/* modal head */}
        <div className="p-4 pl-6 flex justify-between items-center border-b">
          <div className="text-lg font-medium">근로자 정보</div>
          <IconButton className="p-0" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        {/* modal body */}
        <div className="flex flex-col">
          {/* 윗열 */}
          <div className="flex gap-4">
            <div className="py-6 px-10 flex gap-x-8">
              <div className="flex">
                {worker?.picture ? (
                  <img
                    className="rounded-full"
                    src={`data:image/png;base64,${worker?.picture}`}
                  />
                ) : (
                  <img src="/images/image_avatar.svg" />
                )}
              </div>
              <div className="flex flex-col items-start gap-y-1">
                <div className="text-lg font-bold mb-3">{worker?.name}</div>
                <div className="text-sm">
                  <b>소속기업&nbsp;</b>
                  {worker?.companyName}
                </div>
                <div className="text-sm">
                  <b>지역&nbsp;</b>
                  {worker?.agencyParentName}
                </div>
                <div className="text-sm">
                  <b>투입현장&nbsp;</b>
                  {worker?.agencyname}
                </div>
                <div className="text-sm">
                  <b>입사일&nbsp;</b>
                  {worker?.startDate}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-y-5 justify-between">
              <div className="mt-5 grid grid-cols-2 grid-rows-2 gap-x-10 gap-y-7 items-center">
                <div className="flex flex-col items-center">
                  <div className="text-sm text-gray-400 font-medium">현재 상태</div>
                  <div className="mt-2">{getStatusChip(worker?.state)}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-sm text-gray-400 font-medium">현재 심박수</div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">{worker?.heartbeat}</span>&nbsp;bpm
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-sm text-gray-400 font-medium">현재 체온</div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">{worker?.temperature}</span>&nbsp;℃
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-sm text-gray-400 font-medium">현재 배터리</div>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">{worker?.deviceBattery}</span>&nbsp;%
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500 text-center">
                마지막 측정 시간 : {moment(worker?.registerDateHeart).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            </div>
            <div className="grow mt-5 max-w-[440px]">
              <LineChart data={chartData} options={chartOption} />
            </div>
          </div>
        </div>
        {/* 탭 */}
        <div className="mt-5  flex flex-col">
          <div className="mx-1 h-10 grid grid-cols-3">
            {tabs.map((tab, index) => (
              <div
                key={tab.label}
                className={
                  ' flex items-center justify-center text-sm rounded-t-md box-border hover:text-blue-500 hover:border-x hover:border-t ' +
                  (tab.isOpen ? ' border-y border-x  border-b-transparent' : 'border-b')
                }
                onClick={() => onClickTab(index)}>
                {tab.label}
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <div
              className={
                'mt-2 ml-auto mr-2 flex ' +
                (tabs.filter((tab) => tab.isOpen)[0].label == '실시간' && ' hidden')
              }>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                {tabs.filter((tab) => tab.isOpen)[0].label == '일별' ? (
                  <>
                    <DatePicker
                      slotProps={{ textField: { size: 'small' } }}
                      value={startDate}
                      onChange={(newValue) => onChangeStartDate(newValue)}
                      className="bg-white"
                    />
                    <DatePicker
                      slotProps={{ textField: { size: 'small' } }}
                      value={startDate}
                      onChange={(newValue) => onChangeEndDate(newValue)}
                      className="bg-white"
                      sx={{
                        display: 'none'
                      }}
                    />
                  </>
                ) : (
                  <>
                    <DatePicker
                      slotProps={{ textField: { size: 'small' } }}
                      value={startDate}
                      onChange={(newValue) => onChangeStartDate(newValue)}
                      className="bg-white"
                    />
                    &nbsp;&nbsp;&nbsp; ~ &nbsp;&nbsp;&nbsp;
                    <DatePicker
                      slotProps={{ textField: { size: 'small' } }}
                      value={endDate}
                      onChange={(newValue) => onChangeEndDate(newValue)}
                      className="bg-white"
                    />
                  </>
                )}
              </LocalizationProvider>
              <Button
                sx={{ height: '40px', background: '#171C61 !important', marginLeft: '5px' }}
                variant="contained"
                onClick={() => onClickSearch()}>
                검색
              </Button>
            </div>
            <div className="mt-2 mx-2">
              <MaterialReactTable
                columns={columns}
                data={tableData}
                paginationDisplayMode="pages"
                enableSorting={false}
                enableTopToolbar={false}
                enableColumnActions={false}
                enableStickyHeader
                manualPagination={true}
                rowCount={totalCnt}
                state={{ density: 'compact', isLoading: isLoading, pagination}}
                onPaginationChange={setPagination}
                muiTableContainerProps={{
                  sx: {
                    maxHeight: '380px',
                    fontSize: '14px',
                  },
                }}
                muiTablePaperProps={{
                  sx: {
                    boxShadow: 'none',
                    background: 'none',
                  },
                }}
                muiTableProps={{
                  sx: {
                    border: '0.5px solid #DCDCDC',
                  },
                }}
                muiTableBodyRowProps={{ hover: false }}
                muiTableHeadCellProps={{
                  sx: {
                    backgroundColor: '#F5F5F5',
                    div: {
                      justifyContent: 'center',
                    },
                  },
                }}
                muiTableBodyCellProps={{
                  sx: {
                    textAlign: 'center',
                    margin: 0,
                    padding: '4px',
                  },
                }}
                muiBottomToolbarProps={{
                  sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                  },
                }}
                muiPaginationProps={{
                  color: 'primary',
                  shape: 'rounded',
                  showRowsPerPage: false,
                  variant: 'outlined',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WorkerStatusModal;


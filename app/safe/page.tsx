'use client';
import { Card, Chip } from '@mui/material';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import BarChart from 'components/common/BarChart';
import { PageTitle } from 'components/common/Text';
import { BorderCard, ColorCard, WhiteCard } from 'components/Safe/common/Card';
import danger from 'public/images/SafeIcon/ico_warning.svg';
import warning from 'public/images/SafeIcon/ico_warning-1.svg';
import co from 'public/images/SafeIcon/ico_COwarning_red.svg';
import check from 'public/images/SafeIcon/icon_userCheck.svg';
import surround from 'public/images/SafeIcon/ico_surroundWorker.svg';
import normal from 'public/images/SafeIcon/ico_userNormal.svg';
import notDevice from 'public/images/SafeIcon/ico_notDevice.svg';
import device from 'public/images/SafeIcon/ico_deviceCharge.svg';
import load from 'public/images/SafeIcon/ico_loader.svg';
import { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable, MRT_ColumnDef, MRT_PaginationState } from 'material-react-table';
import { ResUserVitalSignList, ResWorkerCounterDataProps } from 'interface/response';
import { ReqUserVitalSignListProps, ReqWorkerCounterProps } from 'interface/request';
import LocalStorage from 'interface/localstorage';
import { getDangerWorkerList, getSafeCardCount } from 'api/Safe';
import moment from 'moment';
import WorkerStatusModal from 'components/Safe/common/WorkerStatusModal';

const SafeDashboard = () => {
  const user = JSON.parse(LocalStorage.getItem('authUser'));

  const safeStatus = 'up';
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cardData, setCardData] = useState<ResWorkerCounterDataProps>({
    workerCount: 0,
    workingCount: 0,
    normalCount: 0,
    warningCount: 0,
    prevNormalCountPer: 0,
    prevWarningCountPer: 0,
    companyCode: '',
    companyName: '',
    agencyCode: '',
    agencyName: '',
    notIsWearCount: 0,
    dangerZoneCount: 0,
    offtimeCount: 0,
    chargeCount: 0,
    dangerCount: 0,
  });
  const [originData, setOriginData] = useState<ResUserVitalSignList[]>([]);
  const [totalCnt, setTotalCount] = useState<number>(0);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isModal, setIsModal] = useState<boolean>(false);
  const [selectedWorker, setSelectedWorker] = useState<ResUserVitalSignList>();

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
    maintainAspectRatio: false,
  };

  const getCardCount = () => {
    var body: ReqWorkerCounterProps = {
      companyCode: user.companyCode,
      agencyCode: user.agencyCode,
      userid: user.code,
    };
    const res = getSafeCardCount(body);
    res.then(({ data }) => {
      setCardData(data[0]);
    });
  };

  const getWorkerList = () => {
    var listBody: ReqUserVitalSignListProps = {
      // companyCode: user.companyCode,
      // agencyCode: user.agencyCode,
      // employeeCode: user.code,
      companyCode: '0',
      agencyCode: '0001',
      employeeCode: 0,
      vitalSignState: 0,
      pageIndex: pagination.pageIndex + 1,
      rowPerPage: pagination.pageSize,
    };
    setIsLoading(true);
    const response = getDangerWorkerList(listBody);
    response.then(({ data, totalCount }) => {
      setOriginData(data);
      setTotalCount(totalCount);
      setIsLoading(false);
    });
  };

  const onClickTableRow = (worker: ResUserVitalSignList) => {
    setSelectedWorker(worker);
    setIsModal(true);
  };

  const onModalClose = () => {
    setIsModal(false);
    setSelectedWorker(undefined);
  }

  useEffect(() => {
    getWorkerList();
    getCardCount();
  }, []);

  useEffect(() => {
    getWorkerList();
  }, [pagination]);

  const columns = useMemo<MRT_ColumnDef<ResUserVitalSignList>[]>(
    () => [
      {
        accessorKey: 'name',
        header: '이름',
      },
      {
        accessorKey: 'departmentName',
        header: '부서',
      },
      {
        accessorKey: 'agencyParentName',
        header: '지역',
      },
      {
        accessorKey: 'agencyname',
        header: '현장명',
      },
      {
        accessorKey: 'heartbeat',
        header: '심박수',
      },
      {
        accessorKey: 'temperature',
        header: '체온',
      },
      // {
      //   accessorKey: 'avgSpo2',
      //   header: ''
      // },
      {
        accessorKey: 'deviceBattery',
        header: '배터리',
      },
      {
        accessorKey: 'isWear',
        header: '착용유무',
        Cell: ({ row }) =>
          row.original.isWear === 1 ? (
            <Chip color="info" label="착용" />
          ) : (
            <Chip color="warning" label="미착용" />
          ),
      },
      {
        accessorKey: 'state',
        header: '상태',
        Cell: ({ row }) =>
          row.original.state === '정상' ? (
            <Chip color="success" label={row.original.state} />
          ) : (
            <Chip color="error" label={row.original.state !== '' ? row.original.state : '-'} />
          ),
      },
      {
        accessorFn: (row) => row.registerDateHeart !== null ? moment(row.registerDateHeart).format('YYYY-MM-DD HH:mm:ss') : '-',
        header: '측정시간',
      },
    ],
    [],
  );

  return (
    <main
      className="p-10 
        w-full 
        max-xl:flex 
        max-xl:flex-col 
        max-xl:pb-10 
        xl:grid 
        xl:grid-rows-[430px_1fr] 
        xl:grid-cols-2
        gap-10 
        xl:h-[calc(100vh_-_70px)]">

      <div className="col-span-1 flex flex-col h-[410px]">
        <PageTitle>전체 현황</PageTitle>
        <div className="grid grid-rows-3 grid-cols-3 gap-5">
          <ColorCard image={danger} count={cardData.dangerCount}>
            위험의심
          </ColorCard>
          <BorderCard image={warning} count={cardData.warningCount}>
            주의의심
          </BorderCard>
          <BorderCard image={co} count={0}>
            CO농도 / 온도
          </BorderCard>
          <WhiteCard image={check} count={cardData.workingCount}>
            금일 투입
          </WhiteCard>
          <WhiteCard image={surround} count={cardData.dangerZoneCount}>
            주의구역 작업자
          </WhiteCard>
          <WhiteCard image={normal} count={cardData.normalCount}>
            정상
          </WhiteCard>
          <WhiteCard image={notDevice} count={cardData.notIsWearCount}>
            미착용
          </WhiteCard>
          <WhiteCard image={device} count={cardData.chargeCount}>
            충전 중
          </WhiteCard>
          <WhiteCard image={load} count={cardData.offtimeCount}>
            데이터 확인
          </WhiteCard>
        </div>
      </div>
      <div className="col-span-1 flex flex-col">
        <PageTitle>부서별 현황</PageTitle>
        <Card className="h-full rounded-2xl p-7">
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
              <div className="w-2.5 h-2.5 bg-[#5C62B2] rounded-full "></div>
              <div className="text-sm text-[#555555]">안전근로자</div>
            </div>
            <div className="flex gap-x-2 items-center">
              <div className="w-2.5 h-2.5 bg-[#F894A0] rounded-full"></div>
              <div className="text-sm text-[#555555]">위험근로자</div>
            </div>
          </div>
          <div className="mt-7w-full h-60">
            <BarChart data={safeStatusData} options={safeStatusOptions}></BarChart>
          </div>
        </Card>
      </div>
      <div className="col-span-2 flex flex-col">
        <PageTitle>위험 근로자 리스트</PageTitle>
        <Card className="h-full rounded-2xl">
          <MaterialReactTable
            columns={columns}
            data={originData}
            paginationDisplayMode="pages"
            enableSorting={false}
            enableTopToolbar={false}
            enableColumnActions={false}
            enableStickyHeader
            manualPagination={true}
            rowCount={totalCnt}
            state={{ isLoading: isLoading, pagination }}
            onPaginationChange={setPagination}
            muiTablePaperProps={{
              sx: {
                boxShadow: 'none',
                background: 'none',
                padding: 0,
              },
            }}
            muiTableHeadCellProps={{
              sx: {
                div: {
                  justifyContent: 'center',
                },
                backgroundColor: '#171C61',
                color: 'white',
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                textAlign: 'center',
                padding: ' 10px 0',
              },
            }}
            muiTableBodyRowProps={({ row }) => ({
              onClick: () => {
                onClickTableRow(row.original);
              },
              sx: {
                cursor: 'pointer',
              },
            })}
            muiPaginationProps={{
              color: 'primary',
              showRowsPerPage: false,
              hideNextButton: true,
              hidePrevButton: true,
              showLastButton: false,
              showFirstButton: false,
            }}
          />
        </Card>
      </div>
      {isModal && (
        <WorkerStatusModal
        isModal={isModal}
        toggle={onModalClose}
        worker={selectedWorker} 
        user={user}
      />
      )}
    </main>
  );
};

export default SafeDashboard;

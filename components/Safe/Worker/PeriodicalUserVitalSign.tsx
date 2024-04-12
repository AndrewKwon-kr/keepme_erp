import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getUserVitalSignHistory } from "api/Worker";
import { useEffect, useMemo, useState } from "react";
import LocalStorage from 'interface/localstorage';
import { MRT_ColumnDef, MRT_PaginationState, MaterialReactTable } from "material-react-table";
import dayjs, { Dayjs } from 'dayjs';
import { ResWorkerVitalSign } from "interface/response";

interface PeriodicalUserVitalSignProps {
  userId: number
};

const PreiodicalUserVitalSign = (props: PeriodicalUserVitalSignProps) => {
  const { userId } = props;

  const user = JSON.parse(LocalStorage.getItem('authUser'));
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [originData, setOriginData] = useState<ResWorkerVitalSign[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  const getBody = () => {
    return {
      userCode: userId,
      startDate: dayjs(startDate).format('YYYYMMDD'),
      endDate: dayjs(endDate).format('YYYYMMDD'),
      vitalSignState: 0,
      employeeCode: user.code,
      pageIndex: pagination.pageIndex,
      rowPerPage: 10
    }
  };

  const getTableData = (body: any) => {
    var historyList = getUserVitalSignHistory(body);
    historyList.then((res) => {
      // console.log(res)
      setOriginData(res.data);
      setTotalCount(res.totalCount);
    })
    .catch(err => console.error(err))
    .finally(()=> {
      setIsLoading(false);
    })
  };

  useEffect(() => {
    setIsLoading(true);
    var dataBody = getBody();
    getTableData(dataBody);
  },[userId]);

  const onChangeStartDate = (e: any) => {
    setStartDate(e.$d)
  };
  const onChangeEndDate = (e: any) => {
    setEndDate(e.$d)
  };

  const columns = useMemo<MRT_ColumnDef<ResWorkerVitalSign>[]>(() => [
    {
      accessorKey: 'vitalDate',
      header: '측정시간',
      Cell: ({row}) => (
        <span>{dayjs(row.original.vitalDate).format('YYYY.MM.DD HH:mm:ss')}</span>
      )
    },
    {
      accessorKey: 'temperature',
      header: '체온(℃)'
    },
    {
      accessorKey: 'heartbeat',
      header: '심박 수(회)'
    },
    {
      accessorKey: 'spo2',
      header: '산소포화도(%)'
    },
    {
      accessorKey: 'state',
      header: '상태'
    },
    {
      accessorKey: 'deviceBattery',
      header: '배터리'
    },
  ],[]);

  useEffect(() => {
    var dataBody = getBody();
    getTableData(dataBody);
  },[pagination]);
  
  const onClickSearch = () => {
    var dataBody = getBody();
    getTableData(dataBody);
  };

  return (
    <Container id='modal-table'>
      <div className="flex gap-x-0.5 m-3 justify-end">
        <div className="flex justify-end gap-2 items-center">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker 
              sx={{ input: { height: '2px' }}}
              value={startDate}
              onChange={onChangeStartDate}
            /> 
            -
            <DatePicker 
              sx={{ input: { height: '2px' }}}
              value={endDate}
              onChange={onChangeEndDate}
            />
            <Button 
              sx={{height: '35px', background:'#171C61 !important'}} 
              variant="contained" 
              type="button"
              onClick={onClickSearch}
              disableElevation
              id='search'
            >
              조회
            </Button>
          </LocalizationProvider>
        </div>
      </div>
      <div>
        <MaterialReactTable 
          columns={columns}
          data={originData}
          paginationDisplayMode="pages"
          enableSorting={false}
          enableTopToolbar={false}
          enableColumnActions={false}
          enableStickyHeader
          manualPagination={true}
          
          rowCount={totalCount}
          state={{ isLoading: isLoading, pagination }}
          onPaginationChange={setPagination}
          muiTablePaperProps={{
            sx: {
              boxShadow: 'none',
              background: 'none'
            }
          }}
          muiTableProps={{
            sx: {
              border: '0.5px solid #DCDCDC',
            }
          }}
          muiTableBodyProps={{
            sx: {
              '& tr:nth-of-type(even)' : {
                backgroundColor: '#f4f5f9 !important'
              }
            }
          }}
          muiTableBodyRowProps={{hover: false}}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: '#F5F5F5',
              border: '1px solid #DCDCDC',
              div: {
                justifyContent: 'center'
              }
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              border: '0.5px solid #DCDCDC',
              textAlign: 'center'
            },
          }}
          muiBottomToolbarProps={{
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0)'
            }
          }}
          muiPaginationProps={{
            color: 'primary',
            shape: 'rounded',
            showRowsPerPage: false,
            variant: 'outlined'
          }}
        />
      </div>
    </Container>
  )
};

const Container = styled.div`
  border: 0px solid #E8E8E8;
`;

export default PreiodicalUserVitalSign
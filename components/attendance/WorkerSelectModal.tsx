import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ButtonType } from 'app/setting/fieldworker/page';
import styled from 'styled-components';
import { postDailyReportWorker, postData, deleteDailyReportWorker } from 'api';
import { ResFieldWorkerList, ResManangerList } from 'interface/response';
import { useEffect, useMemo, useState } from 'react';
import { GET_MANAGER } from 'api/ApiUri';
import LocalStorage from 'interface/localstorage';
import { MRT_ColumnDef, MRT_RowSelectionState, MaterialReactTable } from 'material-react-table';
import moment from 'moment';

const CustomButton = styled(Button)<ButtonType>`
  background-color: ${(props) => props.ver} !important;
`;

const WorkerSelectModal = (props: any) => {
  const user = JSON.parse(LocalStorage.getItem('authUser'));
  const { open, toggle, modalTitle, startDate, agencyCode, workers, getReportData } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [originData, setOriginData] = useState<ResManangerList[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [selectedMembers, setSelectedMembers] = useState([]);

  const columns = useMemo<MRT_ColumnDef<ResFieldWorkerList>[]>(
    () => [
      {
        accessorKey: 'name',
        header: '이름',
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'positionName',
        header: '직급',
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
    ],
    [],
  );

  const handleDelete = async (code: any) => {
    let test = rowSelection;
    delete test[code];

    setRowSelection(test);

    let rowArray = Object.keys(rowSelection);

    setSelectedMembers(originData.filter((data: any) => rowArray.includes(String(data.code))));

    await deleteData({
      employeeCode: code,
      agencyCode: agencyCode,
      workDate: moment(startDate).format('YYYYMMDD'),
    });
  };

  const getBody = () => {
    return {
      id: '',
      name: searchValue,
      companyCode: user.companyCode,
      pageIndex: 1,
      rowPerPage: 100000,
    };
  };

  const getTableData = async (body: any) => {
    setIsLoading(true);
    if (workers.length == 0) {
      setRowSelection({});
    }

    try {
      const response = await postData<ResManangerList[]>(GET_MANAGER, body);

      setOriginData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickConfirm = () => {
    saveData();
    toggle();
  };

  const saveData = async () => {
    const body = selectedMembers.map((member: any) => {
      return {
        employeeCode: member.code,
        agencyCode: agencyCode, // 선택된 현장
        workDate: moment(startDate).format('YYYYMMDD'),
        manageYn: modalTitle == '본사담당' ? 1 : 0,
        positionCode: member.positionCode,
        positionName: member.positionName,
        empId: user.code,
      };
    });

    try {
      const response = await postDailyReportWorker({ employees: body });
      alert(response.result_text);
    } catch (error) {
      console.error(error);
    } finally {
      getReportData();
    }
  };

  const deleteData = async (body: any) => {
    try {
      const response = await deleteDailyReportWorker(body);
      alert(response.result_text);
    } catch (error) {
      console.error(error);
    } finally {
      getReportData();
    }
  };

  // const onClickSearch = () => {
  //   const body = getBody();
  //   getTableData(body);
  // };

  // const onPressEnter = (e: any) => {
  //   if (e.key === 'Enter') {
  //     onClickSearch();
  //   }
  // };
  // const handleChangeSearchValue = (e: any) => {
  //   setSearchValue(e.target.value);
  // };

  // useEffect(() => {
  //   getTableData(getBody());
  // }, []);

  useEffect(() => {
    // setSearchValue('');
    setSelectedMembers(workers);

    let selection: any = {};

    workers.forEach((worker: any) => (selection[worker.code] = true));

    setRowSelection(selection);

    getTableData(getBody());
  }, [open]);

  useEffect(() => {
    let rowArray = Object.keys(rowSelection);

    setSelectedMembers(originData.filter((data: any) => rowArray.includes(String(data.code))));
  }, [rowSelection]);

  return (
    <Dialog open={open} onClose={toggle} maxWidth="lg">
      <DialogTitle sx={{ m: 0, p: 2 }}>{modalTitle} 수정</DialogTitle>
      <IconButton
        onClick={toggle}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}>
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <div className="w-[620px] flex flex-col">
          <Stack sx={{ minHeight: '32px' }} direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {selectedMembers.map((member) => (
              <Chip
                key={member.code}
                label={member.name}
                variant="outlined"
                onDelete={() => handleDelete(member.code)}
              />
            ))}
          </Stack>

          {/* <div className="mt-5 text-[#7A7F94] text-base flex items-center">
            <div className="mr-5 w-[100px]">직원 검색</div>
            <TextField
              className="w-full active:outline-none"
              id="outlined-controlled"
              value={searchValue}
              onChange={handleChangeSearchValue}
              onKeyPress={onPressEnter}
              size="small"
            />
            <Button
              className="ml-5 w-20"
              onClick={onClickSearch}
              style={{ background: '#171C61' }}
              type="button"
              variant="contained"
              color="primary">
              조회
            </Button>
          </div> */}

          <MaterialReactTable
            columns={columns}
            data={originData}
            enableStickyHeader
            enableStickyFooter
            enablePagination={false}
            enableColumnActions={false}
            enableSorting={false}
            enableTopToolbar={false}
            enableSelectAll={false}
            enableMultiRowSelection={modalTitle == '본사담당' ? false : true}
            getRowId={(row: any) => row.code} //give each row a more useful id
            enableRowSelection={(row: any) => {
              return modalTitle == '본사담당'
                ? selectedMembers.length == 0
                : !selectedMembers.map((member) => member.code).includes(row.original.code);
            }}
            // enableRowSelection
            onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
            // onPaginationChange={setPagination}
            state={{
              isLoading: isLoading,
              density: 'compact',
              rowSelection,
              // columnVisibility: { 'mrt-row-select': false },
            }} //pass our managed row selection state to the table to use
            paginationDisplayMode="pages"
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: '#F5F5F5',
                color: '#787878',
                margin: 0,
                padding: 0,
                '&': {
                  borderTop: '1px solid #DCDCDC',
                },
                '&:last-of-type': {
                  borderRight: '1px solid #DCDCDC',
                },
                '&:first-of-type': {
                  borderLeft: '1px solid #DCDCDC',
                  color: '#F5F5F5',
                  borderRight: 0,
                },
              },
            }}
            muiTableContainerProps={{
              sx: {
                maxHeight: '500px',
                width: '100%',
                maxWidth: '100%',
                overflow: 'auto',
                marginTop: '20px',
              },
            }}
            muiTableBodyProps={{
              sx: {
                '& td:last-of-type': {
                  borderRight: '1px solid #DCDCDC',
                },
                '& td:first-of-type': {
                  borderLeft: '1px solid #DCDCDC',
                },
              },
            }}
            muiTablePaperProps={{
              sx: {
                boxShadow: 'none',
                background: 'none',
                height: '500px',
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
      </DialogContent>
      <DialogActions>
        <Button onClick={toggle} variant="outlined">
          취소
        </Button>
        <CustomButton
          className="w-[100px]"
          variant="contained"
          ver="#171C61"
          onClick={() => onClickConfirm()}>
          확인
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default WorkerSelectModal;

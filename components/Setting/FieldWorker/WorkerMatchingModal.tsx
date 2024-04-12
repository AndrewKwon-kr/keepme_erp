import { useEffect, useMemo, useState } from 'react';

import { Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import Image from 'next/image';
import { ResFieldWorkerList } from 'interface/response';
import CloseIcon from '@mui/icons-material/Close';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
} from 'material-react-table';

import styled from 'styled-components';
import { ButtonType } from 'app/setting/fieldworker/page';
import { getModalEmployeeMissMatchList, postWorkerSync } from 'api';
import AlertIcon from 'public/icons/ico_alert.svg';
import LocalStorage from 'interface/localstorage';

const CustomButton = styled(Button)<ButtonType>`
  background-color: ${(props) => props.ver} !important;
`;

interface ModalProps {
  open: boolean;
  toggle: any;
  worker: ResFieldWorkerList;
  onAdd: any;
}

const WorkerStatusModal = (props: ModalProps) => {
  const user = JSON.parse(LocalStorage.getItem('authUser'));
  const { open, toggle, worker, onAdd } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState([]);

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'userCode',
        header: '근로자 Code',
        size: 80,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'juminNumber',
        header: '주민등록번호',
        size: 80,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
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
      {
        accessorKey: 'pictureData',
        header: '사진',
        size: 80,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ cell }: any) => (
          <div className="flex items-center justify-center">
            {cell.getValue() ? (
              <img className="rounded-md h-20" src={`data:image/png;base64,${cell.getValue()}`} />
            ) : (
              ''
            )}
          </div>
        ),
      },
      {
        accessorKey: 'userId',
        header: '근로자 ID',
        size: 80,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'terminalId',
        header: '단말기 ID',
        size: 80,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        header: '매칭',
        size: 60,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ row }) => (
          <CustomButton
            variant="contained"
            size="small"
            ver="#50a5f1"
            onClick={() => onClickMatchingButton(row)}>
            매칭하기
          </CustomButton>
        ),
      },
    ],
    [],
  );
  const onClickMatchingButton = async (row: any) => {
    const { userCode, userId, terminalId } = row.original;
    const { code } = user;
    try {
      const res = await postWorkerSync({ userCode, userId, terminalId, regCode: code });
      alert(res.result_text);
    } catch (err) {
      console.log(err);
    } finally {
      toggle();
    }
  };

  useEffect(() => {
    const getTableData = async () => {
      const { terminalId, userId } = worker;

      setIsLoading(true);
      try {
        const res = await getModalEmployeeMissMatchList({ terminalId, userId });
        setData(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    getTableData();
  }, []);

  return (
    <Dialog open={open} onClose={toggle} maxWidth="xl">
      <DialogTitle sx={{ m: 0, p: 2 }}>매칭 선택</DialogTitle>
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
        <div className="w-[1200px]">
          <MaterialReactTable
            columns={columns}
            data={data}
            enableStickyHeader
            enableStickyFooter
            enableColumnActions={false}
            enableSorting={false}
            enableTopToolbar={false}
            getRowId={(row: any) => row.id} //give each row a more useful id
            state={{ isLoading: isLoading, density: 'compact' }} //pass our managed row selection state to the table to use
            manualPagination={true}
            paginationDisplayMode="pages"
            renderEmptyRowsFallback={({ table }) => (
              <div className="h-[400px] w-full flex flex-col justify-center items-center">
                <Image
                  src={AlertIcon}
                  width={86}
                  height={86}
                  className="w-[86px]"
                  alt="alertIcon"
                />
                <div className="mt-5 text-xl font-bold">NO DATA</div>
                <div className="mt-2.5 text-lg text-[#82889C]">
                  데이터가 없습니다. 추가하기 버튼을 눌러주세요.
                </div>
                <div className="mt-12 flex gap-x-2.5">
                  <div
                    className="rounded-md border border-[#BBBBBB] w-[120px] h-10 text-[#787878] font-semibold flex items-center justify-center cursor-pointer"
                    onClick={toggle}>
                    취소
                  </div>
                  <div
                    className="rounded-md border w-[120px] h-10 text-white  bg-[#171C61] flex items-center justify-center cursor-pointer"
                    onClick={onAdd}>
                    추가하기
                  </div>
                </div>
              </div>
            )}
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: '#F5F5F5',
                color: '#787878',
                margin: 0,
                padding: 0,
                '&': {
                  borderTop: '1px solid #DCDCDC',
                  borderRight: '1px solid #DCDCDC',
                },
                '&:first-of-type': {
                  borderLeft: '1px solid #DCDCDC',
                },
              },
            }}
            muiTableContainerProps={{
              sx: {
                maxHeight: 800,
                width: '100%',
                maxWidth: '100%',
                overflow: 'auto',
              },
            }}
            muiTableBodyProps={{
              sx: {
                '& td': {
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
    </Dialog>
  );
};

export default WorkerStatusModal;

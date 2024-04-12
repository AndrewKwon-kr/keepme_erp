import { Button } from '@mui/material';
import { ButtonType } from 'app/setting/fieldworker/page';
import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import moment from 'moment';
import React, { useMemo } from 'react';
import styled from 'styled-components';

const CustomButton = styled(Button)<ButtonType>`
  background-color: ${(props) => props.ver} !important;
`;

export default function MatchingTable({
  data,
  rowCount,
  setPagination,
  isLoading,
  pagination,
  onStatusToggle,
}: any) {
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'agencyName',
        header: '지역',
        size: 80,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'terminalName',
        header: '단말기(위치)',
        size: 80,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'userId',
        header: '사용자 ID',
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
            onClick={() => onStatusToggle(row)}>
            매칭하기
          </CustomButton>
        ),
      },
    ],
    [],
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableStickyHeader
      enableStickyFooter
      enableColumnActions={false}
      enableSorting={false}
      enableTopToolbar={false}
      rowCount={rowCount}
      getRowId={(row: any) => row.id} //give each row a more useful id
      // onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
      onPaginationChange={setPagination}
      state={{ isLoading: isLoading, pagination, density: 'compact' }} //pass our managed row selection state to the table to use
      manualPagination={true}
      paginationDisplayMode="pages"
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
  );
}

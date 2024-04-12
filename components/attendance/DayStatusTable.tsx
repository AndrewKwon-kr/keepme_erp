import { MaterialReactTable, MRT_ColumnDef, MRT_PaginationState } from 'material-react-table';
import moment from 'moment';
import React, { useMemo } from 'react';

export default function DayStatusTable({
  data,
  rowCount,
  setPagination,
  isLoading,
  pagination,
}: any) {
  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'workDate',
        header: '출근일자',
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
        accessorKey: 'agency',
        header: '현장',
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
        accessorKey: 'firstInTime',
        header: '출근시간',
        size: 60,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ cell }: any) => (
          <div>{cell.getValue() ? moment(cell.getValue()).format('HH:mm') : ''}</div>
        ),
      },
      {
        accessorKey: 'lastOutTime',
        header: '퇴근시간',
        size: 60,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ cell }: any) => (
          <div>{cell.getValue() ? moment(cell.getValue()).format('HH:mm') : ''}</div>
        ),
      },
      {
        accessorKey: '1',
        header: '연장근로',
        size: 60,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ cell }: any) => <div className="font-bold">0</div>,
      },
      {
        accessorKey: '2',
        header: '야간근로',
        size: 60,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
        Cell: ({ cell }: any) => <div className="font-bold">0</div>,
      },
      {
        accessorKey: 'firstInTimePictureData',
        header: '출근사진',
        size: 40,
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
        accessorKey: 'lastOutPictureData',
        header: '퇴근사진',
        size: 40,
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
      state={{ isLoading: isLoading, pagination }} //pass our managed row selection state to the table to use
      manualPagination={true}
      paginationDisplayMode="pages"
      muiTableHeadCellProps={{
        sx: {
          backgroundColor: '#F5F5F5',
          borderStyle: 'solid',
          borderWidth: '1px 0px 1px 1px',
          borderColor: '#DCDCDC',
          color: '#787878',
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
          //stripe the rows, make odd rows a darker color
          '& td': {
            borderLeft: '1px solid #DCDCDC',
          },
          '& tr:nth-of-type(even) > td': {
            backgroundColor: '#F4F5F9',
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

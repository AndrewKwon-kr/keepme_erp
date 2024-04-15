import { MaterialReactTable, MRT_ColumnDef } from 'material-react-table';
import React, { useEffect, useMemo, useState } from 'react';

export default function MonthStatusTable({
  rowCount,
  setPagination,
  isLoading,
  pagination,
  originData,
}: any) {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);

  // 컬럼 설정
  useEffect(() => {
    if (originData.length > 0) {
      const keys = Object.keys(originData[0]);
      keys.shift();

      const convertedColumns: MRT_ColumnDef<any>[] = keys.map((key, index) => {
        switch (key) {
          case 'agency':
            return {
              accessorKey: key,
              header: '현장',
              size: 80,
              muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
            };
          case 'department':
            return {
              accessorKey: key,
              header: '부서',
              size: 80,
              muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
            };
          case 'UserName':
            return {
              accessorKey: key,
              header: '이름',
              size: 80,
              muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
            };
          case 'commute':
            return {
              accessorKey: key,
              header: '출퇴근',
              size: 60,
              maxSize: 60,
              muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
              Cell: ({ cell }: any) => (
                <div className="grid grid-rows-3 divide-y">
                  <div className="pt-0.5 text-xs text-gray-500">출근</div>
                  <div className="pt-0.5 text-xs text-gray-500">퇴근</div>
                  <div className="pt-0.5 text-xs text-gray-500">공수</div>
                </div>
              ),
            };
          case 'earlyWork':
            return {
              accessorKey: key,
              header: '조기출근',
              size: 60,
              maxSize: 60,
              muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
            };
          case 'numOfDayWork':
            return {
              accessorKey: key,
              header: '출근일수',
              size: 60,
              maxSize: 60,
              muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
            };
          case 'overTime':
            return {
              accessorKey: key,
              header: '연장일수',
              size: 60,
              maxSize: 60,
              muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
            };
          case 'nightWork':
            return {
              accessorKey: key,
              header: '야간일수',
              size: 60,
              maxSize: 60,
              muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
            };

          default:
            return {
              accessorKey: key,
              header: key,
              size: 80,
              muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              },
              Cell: ({ cell }: any) => (
                <div className="flex flex-col divide-y">
                  {cell.getValue() ? (
                    cell.getValue()?.start != null ? (
                      <>
                        <div className="pb-0.5 text-xs text-gray-500">{cell.getValue()?.start}</div>
                        {cell.getValue()?.end ? (
                          <div className="pt-0.5 text-xs text-gray-500">{cell.getValue()?.end}</div>
                        ) : (
                          <div className="py-[1px] text-xs text-[#DE2626]">x</div>
                        )}
                        <div className="pt-0.5 text-xs text-gray-500">{cell.getValue()?.num}</div>
                      </>
                    ) : (
                      <div className="text-[#DE2626] text-xs flex justify-center">휴무</div>
                    )
                  ) : (
                    <div>{cell.getValue()}</div>
                  )}
                </div>
              ),
            };
        }
      });
      setColumns(convertedColumns);
    }
  }, [originData]);

  // 테이블 데이터 설정
  useEffect(() => {
    let array = [];

    array = originData.map((data: any, index: number) => {
      const keys = Object.keys(data);
      const values = Object.values(data);

      interface Example {
        [key: string]: string | {} | boolean;
      }

      if (index % 2 != 0) {
        const one = originData[index - 1];
        const two = originData[index];

        if (one && two) {
          const values1 = Object.values(one);
          const values2 = Object.values(two);

          let value: Example = {};
          for (let i = 0; i < keys.length; i++) {
            switch (keys[i]) {
              case 'UserName':
                value[keys[i]] = values[i];
                break;
              case 'agency':
                value[keys[i]] = values[i];
                break;
              case 'department':
                value[keys[i]] = values[i];
                break;
              case 'numOfDayWork':
                value[keys[i]] = values[i];
                break;
              case 'overTime':
                value[keys[i]] = values[i];
                break;
              case 'nightWork':
                value[keys[i]] = values[i];
                break;
              default:
                value[keys[i]] = { start: values1[i], end: values2[i], num: 1 };
            }
          }
          return value;
        }
      } else return undefined;
    });

    let filteredArray = array.filter((val: any) => val !== undefined);
    setTableData(filteredArray);
  }, [originData]);

  return (
    <MaterialReactTable
      columns={columns}
      data={tableData}
      enableStickyHeader
      enableStickyFooter
      enableColumnActions={false}
      enableSorting={false}
      enableColumnPinning={true}
      enableTopToolbar={false}
      rowCount={rowCount}
      getRowId={(row: any) => row.id} //give each row a more useful id
      // onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
      onPaginationChange={setPagination}
      state={{
        isLoading: isLoading,
        pagination,
        columnOrder: [
          'agency',
          'department',
          'UserName',
          'earlyWork',
          'numOfDayWork',
          'overTime',
          'nightWork',
          'commute',
        ],
        columnPinning: {
          left: [
            'agency',
            'department',
            'UserName',
            'earlyWork',
            'numOfDayWork',
            'overTime',
            'nightWork',
            'commute',
          ],
          right: [],
        },
      }} //pass our managed row selection state to the table to use
      manualPagination={true}
      paginationDisplayMode="pages"
      muiTableHeadCellProps={{
        sx: {
          backgroundColor: '#F5F5F5',
          color: '#787878',
          margin: 0,
          padding: 0,
          '&[data-pinned="true"]': {
            backgroundColor: '#F4F5F9',
          },
          '&': {
            borderTop: '1px solid #DCDCDC',
            borderRight: '1px solid #DCDCDC',
          },
          '&:first-of-type': {
            borderLeft: '1px solid #DCDCDC',
          },
        },
      }}
      muiTableBodyCellProps={{
        sx: {
          margin: 0,
          padding: 0,
          minHeight: 40,
          height: 60,
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
            borderRight: '1px solid #DCDCDC',
          },
          '& td:first-of-type': {
            borderLeft: '1px solid #DCDCDC',
          },
          '& tr:nth-of-type(even) > td': {
            backgroundColor: '#F4F5F9',
          },
          '& tr:nth-of-type(even) > td[data-pinned="true"]': {
            backgroundColor: 'black',
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

import RootLayout from '@/app/layout';
import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { generateCsv, download } from 'export-to-csv'; //or use your library of choice here
import { CSVLink, CSVDownload } from 'react-csv';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const datas = [
  {
    id: 0,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
  {
    id: 1,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
  {
    id: 2,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
  {
    id: 3,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
  {
    id: 4,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
  {
    id: 5,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
  {
    id: 6,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
  {
    id: 7,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
  {
    id: 8,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
  {
    id: 9,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
  {
    id: 10,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
  {
    id: 11,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
  {
    id: 12,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
  {
    id: 13,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
  {
    id: 14,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
  {
    id: 15,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
  {
    id: 16,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
  {
    id: 17,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
  {
    id: 18,
    date: '2022-05-08',
    belong: '강남건설',
    department: '골조',
    position: '반장',
    name: '강민수',
    phoneNumber: '010-1234-5678',
    registrationNumber: '780102-1122338',
    startedAt: '08:00',
    endedAt: '17:00',
  },
];

export default function Attendance() {
  const [rowSelection, setRowSelection] = useState({});
  const [headers, setHeaders] = useState([]);
  const columns = useMemo(() => [
    { accessorKey: 'id', header: 'ID', size: 40 },
    { accessorKey: 'date', header: '일시', size: 120 },
    { accessorKey: 'belong', header: '소속', size: 80 },
    { accessorKey: 'department', header: '부서', size: 80 },
    { accessorKey: 'position', header: '직책', size: 80 },
    { accessorKey: 'name', header: '이름', size: 80 },
    { accessorKey: 'phoneNumber', header: '연락처', size: 120 },
    {
      accessorKey: 'registrationNumber',
      header: '주민번호(등록번호)',
      size: 200,
    },
    { accessorKey: 'startedAt', header: '출근', size: 60 },
    { accessorKey: 'endedAt', header: '퇴근', size: 60 },
  ]);

  useEffect(() => {
    setHeaders(
      columns.map((column) => ({
        label: column.header,
        key: column.accessorKey,
      }))
    );
  }, []);
  console.log(headers);

  const csvOptions = {
    filename: '240907 부산 가야현장',
    useKeysAsHeaders: true,
    columnHeaders: columns.map((c) => c.header),
  };

  const csvExporter = generateCsv(csvOptions);
  useEffect(() => {
    //do something when the row selection changes...
    console.info({ rowSelection });
  }, [rowSelection]);

  const handleExportRows = (rows) => {
    // download(csvOptions)(csvExporter(rows.map((row) => row.original)));
  };

  const handleExportData = () => {
    // console.log(csvExporter(datas));
    // download(csvOptions)(csvExporter(datas));
  };

  return (
    <RootLayout>
      <main className="w-full">
        <div className="">
          <MaterialReactTable
            columns={columns}
            data={datas}
            enableRowSelection
            enableStickyHeader
            enableStickyFooter
            muiTableContainerProps={{
              sx: {
                maxHeight: 700,
                width: '100%',
                maxWidth: '100%',
                overflow: 'scroll',
                overflowX: 'scroll',
              },
            }}
            getRowId={(row) => row.id} //give each row a more useful id
            onRowSelectionChange={setRowSelection} //connect internal row selection state to your own
            state={{ rowSelection }} //pass our managed row selection state to the table to use
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: '#F2F3F6',
                BorderStyle: 'solid',
                borderWidth: '1px 0px 1px 0px',
                borderColor: 'black black black black',
              },
            }}
            renderTopToolbarCustomActions={({ table }) => (
              <Box
                sx={{
                  display: 'flex',
                  gap: '1rem',
                  p: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <Button
                  color="primary"
                  //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)
                  startIcon={<FileDownloadIcon />}
                  variant="outlined"
                >
                  <CSVLink
                    asyncOnClick={true}
                    data={datas}
                    headers={headers}
                    filename={'20240907_근태.csv'}
                  >
                    모든 데이터 엑셀다운
                  </CSVLink>
                </Button>
                <Button
                  disabled={table.getRowModel().rows.length === 0}
                  //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                  onClick={() => handleExportRows(table.getRowModel().rows)}
                  startIcon={<FileDownloadIcon />}
                  variant="outlined"
                >
                  <CSVLink
                    data={table.getRowModel().rows.map((row) => row.original)}
                    headers={headers}
                    filename={'20240907_근태.csv'}
                  >
                    현재 페이지 엑셀다운
                  </CSVLink>
                </Button>
                <Button
                  disabled={
                    !table.getIsSomeRowsSelected() &&
                    !table.getIsAllRowsSelected()
                  }
                  //only export selected rows
                  onClick={() =>
                    handleExportRows(table.getSelectedRowModel().rows)
                  }
                  startIcon={<FileDownloadIcon />}
                  variant="outlined"
                >
                  <CSVLink
                    data={table
                      .getSelectedRowModel()
                      .rows.map((row) => row.original)}
                    headers={headers}
                    filename={'20240907_선택된_근로자_근태.csv'}
                  >
                    선택된 열 엑셀다운
                  </CSVLink>
                </Button>
              </Box>
            )}
          />
        </div>
      </main>
    </RootLayout>
  );
}

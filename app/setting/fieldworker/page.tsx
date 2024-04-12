'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Box,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import styled from '@emotion/styled';
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row,
} from 'material-react-table';
import {
  getAgencyList,
  getDeptList,
  getEmployeeMissMatchList,
  getTerminalList,
  postData,
} from 'api';
import {
  ResAgencyList,
  ResDepartmentList,
  ResFieldWorkerList,
  TerminalList,
} from 'interface/response';
import { GET_USER_LIST } from 'api/ApiUri';
import LocalStorage from 'interface/localstorage';
import WorkerStatusModal from 'components/Setting/FieldWorker/WorkerStatusModal';
import DeviceInOutModal from 'components/Setting/Device/DeviceInOutModal';
import UserInputFormModal from 'components/Setting/FieldWorker/UserInputFormModal';
import MatchingTable from 'components/Setting/FieldWorker/MatchingTable';
import WorkerMatchingModal from 'components/Setting/FieldWorker/WorkerMatchingModal';

export type ButtonType = {
  ver: string;
};

const CustomButton = styled(Button)<ButtonType>`
  background-color: ${(props) => props.ver} !important;
`;

const FieldWorker = () => {
  const user = JSON.parse(LocalStorage.getItem('authUser'));

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [department, setDepartment] = useState<string>('');
  const [departmentItem, setDepartmentItem] = useState<ResDepartmentList[]>([]);
  const [agency, setAgency] = useState<string>('');
  const [agencyItem, setAgencyItem] = useState<ResAgencyList[]>([]);
  const [name, setName] = useState<string>('');
  const [originData, setOriginData] = useState<ResFieldWorkerList[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [deviceOpen, setDeviceOpen] = useState<boolean>(false);
  const [seletedWorker, setSelectedWorker] = useState<ResFieldWorkerList | null>();
  const [inOutUpdate, setInOutUpdate] = useState<boolean>(false);
  const [inputModalOpen, setInputModalOpen] = useState<boolean>(false);
  const [inputIsEdit, setInputIsEdit] = useState<boolean>(false);
  const [alignment, setAlignment] = useState('status');
  const [terminal, setTerminal] = useState<number>();
  const [terminalItem, setTerminalItem] = useState<TerminalList[]>([]);

  const columnVisibility = {
    picture: false,
    birthday: false,
    juminNumber: false,
  };

  const getBody = (searchValue: any) => {
    return {
      companyCode: user.companyCode,
      agencyCode: user.agencyCode,
      searchType: 1,
      searchValue: searchValue ?? '',
      userName: searchValue ?? '',
      terminalId: terminal ?? 9999,
      startNo: pagination.pageIndex * pagination.pageSize,
      endNo: 10,
    };
  };

  const getTableData = async (body: any) => {
    setIsLoading(true);
    try {
      if (alignment == 'status') {
        const response = await postData<ResFieldWorkerList[]>(GET_USER_LIST, body);
        setOriginData(response.data);
        setTotalCount(response.totalCount);
      }
      if (alignment == 'match') {
        const response = await getEmployeeMissMatchList(body);
        setOriginData(response.data);
        setTotalCount(response.totalCount);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setName('');
    }
  };

  const onStatusToggle = (row: any) => {
    setStatusOpen(!statusOpen);
    if (statusOpen) {
      setSelectedWorker(null);
      getTableData(getBody(''));
    } else {
      setSelectedWorker(row.original);
    }
  };

  const onDeviceToggle = (row: any) => {
    setDeviceOpen(!deviceOpen);
    if (deviceOpen) {
      setSelectedWorker(null);
    } else {
      setSelectedWorker(row.original);
    }
  };

  const columns = useMemo<MRT_ColumnDef<ResFieldWorkerList>[]>(
    () => [
      {
        accessorKey: 'picture',
        header: '사진',
      },
      {
        accessorKey: 'name',
        header: '이름',
      },
      {
        accessorKey: 'mobileNumber',
        header: '연락처',
      },
      {
        accessorKey: 'birthday',
        header: '생년월일',
      },
      {
        accessorKey: 'companyName',
        header: '소속',
        enableEditing: false,
      },
      {
        accessorKey: 'agencyParentName',
        header: '지역',
      },
      {
        accessorKey: 'agencyName',
        header: '현장명',
      },
      {
        accessorKey: 'departmentName',
        header: '부서',
      },
      {
        accessorKey: 'startDate',
        header: '입사일',
      },
      {
        accessorKey: 'officeStatus',
        header: '근로상태',
      },
      {
        accessorKey: 'status',
        header: '실시간 상태',
        columnDefType: 'display',
        Cell: ({ row }) => (
          <CustomButton
            variant="contained"
            size="small"
            ver="#50a5f1"
            onClick={() => onStatusToggle(row)}>
            상태
          </CustomButton>
        ),
      },
      {
        accessorKey: 'device',
        header: '기기불출',
        columnDefType: 'display',
        Cell: ({ row }) => {
          var color = row.original.deviceInOutStateCode === '1' ? '#34c38f' : '#74788d';
          return (
            <CustomButton
              variant="contained"
              size="small"
              ver={color}
              onClick={() => onDeviceToggle(row)}>
              기기
            </CustomButton>
          );
        },
      },
    ],
    [],
  );

  useEffect(() => {
    var depBody, agencyBody, dataBody;
    if (user !== undefined) {
      depBody = {
        companyCode: user.companyCode,
        agencyCode: user.agencyCode,
        // employeeCode: user.code
      };
      agencyBody = {
        companyCode: user.companyCode,
        agencyCode: user.agencyCode,
      };
      dataBody = getBody('');
    }

    var deptList = getDeptList(depBody);
    deptList.then((res: ResDepartmentList[]) => {
      setDepartmentItem(res);
      setDepartment('9999');
    });

    var agencyList = getAgencyList(agencyBody);
    agencyList.then((res: ResAgencyList[]) => {
      setAgencyItem(res);
      setAgency('9999');
    });

    var terminalList = getTerminalList();
    terminalList.then((res: TerminalList[]) => {
      setTerminalItem(res);
      setTerminal(9999);
    });

    getTableData(dataBody);
  }, [alignment]);

  useEffect(() => {
    var dataBody = getBody('');

    getTableData(dataBody);
  }, [pagination]);

  useEffect(() => {
    if (inOutUpdate) {
      var dataBody = getBody('');
      getTableData(dataBody);
    }
  }, [inOutUpdate]);

  const handleChangeDepartment = (e: any) => {
    setDepartment(e.target.value);
  };

  const handleChangeAgency = (e: any) => {
    setAgency(e.target.value);
  };

  const handleChangeInputName = (e: any) => {
    setName(e.target.value);
  };

  const handleChangeTerminal = (e: any) => {
    setTerminal(e.target.value);
  };

  const onPressEnter = (e: any) => {
    var value = name;
    if (e.key === 'Enter') {
      const body = getBody(value ?? '');
      getTableData(body);
    }
  };

  const onClickSearch = () => {
    const body = getBody(name ?? '');
    getTableData(body);
  };

  const onClickCreateOpen = () => {
    setInputModalOpen(true);
  };

  const onClickEditOpen = (row: MRT_Row<ResFieldWorkerList>) => {
    setInputIsEdit(true);
    setInputModalOpen(true);
    setSelectedWorker(row.original);
  };

  const onModalClose = () => {
    setInputIsEdit(false);
    setInputModalOpen(false);
    setSelectedWorker(null);
  };

  const handleChangeAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    if (newAlignment != alignment) {
      setAlignment(newAlignment);
    } else {
      setAlignment(alignment);
    }
  };

  return (
    <main className="p-10 w-full overflow-x-auto whitespace-nowrap">
      <section>
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChangeAlignment}
          aria-label="Platform">
          <ToggleButton
            value="status"
            sx={{
              '&.MuiToggleButton-root.Mui-selected': {
                backgroundColor: '#171C61', //use the color you want
                color: 'white',
              },
              '&.MuiToggleButton-root': {
                backgroundColor: 'white', //use the color you want
                color: '#171C61',
                paddingX: '55px',
                border: 'black solid 1px',
                borderRadius: '10px 0 0 10px',
              },
            }}>
            현황
          </ToggleButton>
          <ToggleButton
            value="match"
            sx={{
              '&.MuiToggleButton-root.Mui-selected': {
                backgroundColor: '#171C61', //use the color you want
                color: 'white',
              },
              '&.MuiToggleButton-root': {
                backgroundColor: 'white', //use the color you want
                color: '#171C61',
                paddingX: '55px',
                border: 'black solid 1px',
                borderRadius: '0 10px 10px 0',
              },
            }}>
            매칭
          </ToggleButton>
        </ToggleButtonGroup>
      </section>
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-10">
            <div className="text-[#7A7F94] text-base flex items-center">
              <div className="">현장</div>
              <FormControl>
                <Select
                  className="ml-[30px] min-w-[250px] bg-white active:outline-none"
                  size="small"
                  value={agency}
                  onChange={handleChangeAgency}
                  displayEmpty>
                  {agencyItem
                    .filter((data: ResAgencyList) => data.level !== 0)
                    .map((data: any) => {
                      return (
                        <MenuItem key={data.code} value={data.code}>
                          {data.name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </div>
            <div className="text-[#7A7F94] text-base flex items-center">
              {alignment == 'status' ? (
                <>
                  <div className="">부서</div>
                  <FormControl>
                    <Select
                      className="ml-[30px] min-w-[250px] bg-white active:outline-none"
                      size="small"
                      value={department}
                      onChange={handleChangeDepartment}
                      displayEmpty>
                      {departmentItem.map((data) => {
                        return (
                          <MenuItem key={data.code} value={data.code}>
                            {data.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </>
              ) : (
                <>
                  <div className="">단말기</div>
                  <FormControl>
                    <Select
                      className="ml-[30px] min-w-[250px] bg-white active:outline-none"
                      size="small"
                      value={terminal}
                      onChange={handleChangeTerminal}
                      displayEmpty>
                      {terminalItem.map((data) => {
                        return (
                          <MenuItem key={data.terminalId} value={data.terminalId}>
                            {data.terminalId == 9999
                              ? data.agencyName
                              : `${data.terminalName} : ${data.agencyName}`}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </>
              )}
            </div>
            <div className="text-[#7A7F94] text-base flex items-center">
              <div className="">검색</div>
              <TextField
                className="ml-[30px] w-[250px] bg-white active:outline-none"
                id="outlined-controlled"
                value={name}
                onChange={handleChangeInputName}
                onKeyPress={onPressEnter}
                size="small"
              />
            </div>
            <div className="">
              <Button
                onClick={onClickSearch}
                style={{ background: '#171C61' }}
                type="button"
                variant="contained"
                color="primary">
                조회
              </Button>
            </div>
          </div>
          <div>
            <Button
              variant="contained"
              type="button"
              style={{ background: '#74788d' }}
              onClick={onClickCreateOpen}>
              추가
            </Button>
          </div>
        </div>
      </section>
      <section className="mt-10">
        {alignment == 'status' ? (
          <MaterialReactTable
            columns={columns}
            data={originData}
            paginationDisplayMode="pages"
            enableSorting={false}
            enableTopToolbar={false}
            enableColumnActions={false}
            enableStickyHeader
            enableRowActions
            positionActionsColumn="last"
            manualPagination={true}
            rowCount={totalCount}
            state={{ isLoading: isLoading, pagination, columnVisibility: columnVisibility }}
            onPaginationChange={setPagination}
            displayColumnDefOptions={{
              'mrt-row-actions': {
                header: '',
              },
            }}
            renderRowActions={({ row, table }) => (
              <Box
                sx={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'center' }}
                key={row.original.userId}>
                <IconButton color="info" onClick={() => onClickEditOpen(row)}>
                  <EditIcon />
                </IconButton>
              </Box>
            )}
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
            muiTableBodyProps={{
              sx: {
                '& tr:nth-of-type(even)': {
                  backgroundColor: '#f4f5f9 !important',
                },
              },
            }}
            muiTableBodyRowProps={{ hover: true }}
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: '#F5F5F5',
                border: '1px solid #DCDCDC',
                div: {
                  justifyContent: 'center',
                },
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                border: '0.5px solid #DCDCDC',
                textAlign: 'center',
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
        ) : (
          <MatchingTable
            data={originData}
            isLoading={isLoading}
            rowCount={totalCount}
            pagination={pagination}
            setPagination={setPagination}
            onStatusToggle={onStatusToggle}
          />
        )}
      </section>
      {statusOpen && alignment == 'status' && (
        <WorkerStatusModal open={statusOpen} toggle={onStatusToggle} worker={seletedWorker} />
      )}
      {statusOpen && alignment == 'match' && (
        <WorkerMatchingModal
          open={statusOpen}
          toggle={onStatusToggle}
          worker={seletedWorker}
          onAdd={onClickCreateOpen}
        />
      )}
      {deviceOpen && (
        <DeviceInOutModal
          open={deviceOpen}
          toggle={onDeviceToggle}
          employeeCode={user.code}
          agencyCode={user.agencyCode}
          user={seletedWorker}
          type="출고"
          typeCode={1}
          update={setInOutUpdate}
        />
      )}
      {inputModalOpen && (
        <UserInputFormModal
          open={inputModalOpen}
          toggle={onModalClose}
          isEdit={inputIsEdit}
          agencyItem={agencyItem}
          departmentItem={departmentItem}
          selectWorker={seletedWorker}
          employee={user}
          update={setInOutUpdate}
        />
      )}
    </main>
  );
};

export default FieldWorker;

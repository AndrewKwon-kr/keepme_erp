"use client"
import { useEffect, useMemo, useState } from "react"
import { Button, FormControl, MenuItem, Select, TextField, Box, IconButton } from "@mui/material";
import { Edit as EditIcon } from '@mui/icons-material';
import { MaterialReactTable, MRT_ColumnDef, MRT_PaginationState, MRT_Row } from "material-react-table";
import styled from "@emotion/styled";
import { ResManangerList } from "interface/response";
import LocalStorage from 'interface/localstorage';
import { postData } from "api";
import { GET_MANAGER, RESET_MANAGER_PASSWORD } from "api/ApiUri";
import moment from "moment";
import UserInputFormModal from "components/Setting/SiteManager/UserInputFormModal";

export type ButtonType = {
  ver: string
};

const CustomButton = styled(Button)<ButtonType>`
  background-color: ${props => props.ver} !important;
`;

const SiteManager = () => {
  const user = JSON.parse(LocalStorage.getItem('authUser'));

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchType, setSearchType] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>('');
  const [originData, setOriginData] = useState<ResManangerList[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [inputModalOpen, setInputModalOpen] = useState<boolean>(false);
  const [seletedWorker, setSelectedWorker] = useState<ResManangerList | null>();
  const [inOutUpdate, setInOutUpdate] = useState<boolean>(false);
  const [inputIsEdit, setInputIsEdit] = useState<boolean>(false);

  const getBody = (value: string) => {
    var userId = '';
    var userName = '';
    if (searchType === 0) {
      userName = searchValue
    } else {
      userId = searchValue
    }
    return {
			id: userId,
			name: userName,
			companyCode: String(user?.companyCode),
			pageIndex: pagination.pageIndex + 1,
			rowPerPage: pagination.pageSize
    };
  };

  const getTableData = async (body: any) => {
    setIsLoading(true);
    try {
      const response = await postData<ResManangerList[]>(GET_MANAGER, body);
      setOriginData(response.data);
      setTotalCount(response.totalCount);
    } catch (error){
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    var dataBody = getBody('')
    getTableData(dataBody);
  },[]);

  useEffect(() => {
    if (inOutUpdate) {
      var dataBody = getBody('');
      getTableData(dataBody);
    }
  },[inOutUpdate]);

  const handleChangeSearchType = (e: any) => {
    setSearchType(e.target.value)
  };

  const handleChangeSearchValue = (e: any) => {
    setSearchValue(e.target.value);
  };
  
  const onClickSearch = () => {
    const body = getBody(searchValue ?? '');
    getTableData(body);
  };
  
  const onPressEnter = (e: any) => {
    if(e.key === 'Enter') {
      onClickSearch();
    }
  };

	const onPasswordReset = async (row: any) => {
		// e.stopPropagation();
    var original = row.original;
		var check = window.confirm(`${original.name}의 비밀번호를 초기화 하시겠습니까?`);
		if (check) {
      try {
        const response = await postData<[]>(RESET_MANAGER_PASSWORD, { code: row.original.code, empID: user?.code});
        window.alert(response.result_text)
      } catch (error){
        window.alert('비밀번호 초기화를 실패하였습니다.')
        console.error(error);
      } 
		} else return;
	};

  const columns = useMemo<MRT_ColumnDef<ResManangerList>[]>(() => [
    {
      accessorKey: 'name',
      header: '이름',
    },
    {
      accessorKey: 'phone',
      header: '연락처',
    },
    {
      accessorKey: 'companyName',
      header: '소속',
    },
    {
      accessorKey: 'parentName',
      header: '지역',
    },
    {
      accessorKey: 'agencyName',
      header: '현장명',
    },
    {
      accessorKey: 'deptName',
      header: '부서',
    },
    {
      accessorFn: (row) => moment(row.startDate).format('YYYY-MM-DD'),
      header: '입사일',
    },
    {
      accessorKey: 'password reset',
      header: '비밀번호 초기화',
      columnDefType: 'display',
      Cell: ({row}) => (
        <CustomButton variant="contained" size="small" ver="#50a5f1" onClick={()=>onPasswordReset(row)}>초기화</CustomButton>
      )
    },
  ],[]);

  const onClickCreateOpen = () => {
    setInputModalOpen(true);
  };

  const onClickEditOpen = (row: MRT_Row<ResManangerList>) => {
    setInputIsEdit(true);
    setInputModalOpen(true);
    setSelectedWorker(row.original);
  };

  const onModalClose = () => {
    setInputIsEdit(false);
    setInputModalOpen(false);
    setSelectedWorker(null);
  }

  return (
    <main className="p-5 w-full overflow-x-auto whitespace-nowrap">
      <section className="flex justify-between">
        <div className="flex items-center gap-x-10">
          <div className="text-[#7A7F94] text-base flex items-center">
            <div className="">검색조건</div>
            <FormControl>
              <Select
                className="ml-[30px] min-w-[250px] active:outline-none"
                size="small"
                value={searchType}
                onChange={handleChangeSearchType}
                displayEmpty>
                <MenuItem value={0}>이름</MenuItem>
                <MenuItem value={1}>연락처</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="text-[#7A7F94] text-base flex items-center">
            <div className="">검색</div>
            <TextField
              className="ml-[30px] w-[250px] active:outline-none"
              id="outlined-controlled"
              value={searchValue}
              onChange={handleChangeSearchValue}
              onKeyPress={onPressEnter}
              size="small"
            />
          </div>
          <div className="">
            <Button onClick={onClickSearch} style={{background:'#171C61'}} type="button" variant="contained" color="primary">조회</Button>
          </div>
        </div>
        <div className="">
          <Button variant="contained" type="button" style={{background:'#74788d'}} onClick={onClickCreateOpen}>추가</Button>
        </div>
      </section>
      <section className="mt-10">
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
          state={{ isLoading: isLoading, pagination }}
          onPaginationChange={setPagination}
          displayColumnDefOptions={{
            'mrt-row-actions': {
              header: ''
            }
          }}
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'center' }} key={row.original.code}>
              <IconButton
                color="info"
                onClick={() => onClickEditOpen(row)}
              >
                <EditIcon />
              </IconButton>
            </Box>
          )}
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
          muiTableBodyRowProps={{hover: true}}
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
      </section>
      {inputModalOpen && 
        <UserInputFormModal 
          open={inputModalOpen}
          toggle={onModalClose}
          selectWorker={seletedWorker}
          employee={user}
          update={setInOutUpdate}        
          isEdit={inputIsEdit}
        />
      }
    </main>
  )
};

export default SiteManager;
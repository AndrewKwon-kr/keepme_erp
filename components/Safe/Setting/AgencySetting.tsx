import { useMemo, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { MaterialReactTable, MRT_ColumnDef, MRT_PaginationState } from "material-react-table";
import { PageTitle } from "components/common/Text";
import { SettingCard } from "../common/Card";
import { Close } from "@mui/icons-material";
import { CancelButton, SaveButton } from "components/common/Button";

type AgencySettingData = {
  code?: number | string,
  buildingName: string,
  floor: number,
  underFloor: number
};

const AgencySetting = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [originData, setOrginData] = useState<AgencySettingData[]>([
    {
      code: 1,
      buildingName: '101동',
      floor: 12,
      underFloor: 1
    },
    {
      code: 2,
      buildingName: '102동',
      floor: 3,
      underFloor: 2
    },
  ]);
  const [totalCount, setTotalCount] = useState<number>(originData.length);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 1,
    pageSize: 10,
  });

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const [formData, setFormData] = useState<AgencySettingData>({
    buildingName: '',
    floor: 0,
    underFloor: 0
  });

  const columns = useMemo<MRT_ColumnDef<any>[]>(()=> [
    {
      accessorKey:'code',
      header: '건물코드'
    },
    {
      accessorKey:'buildingName',
      header: '건물이름'
    },
    {
      accessorKey:'floor',
      header: '지상 층수'
    },
    {
      accessorKey:'underFloor',
      header: '지하 층수'
    },
  ],[]);

  const onModalToggle = () => {
    setModalOpen(!modalOpen);
    if (isEdit) {
      setIsEdit(false);
    };
  };

  const onChangeFormData = (e: any) => {
    var { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const onClose = () => {
    setFormData({
      code: '',
      buildingName: '',
      floor: 0,
      underFloor: 0
    });
    onModalToggle()
  };

  return (
    <SettingCard>
      <div className="flex justify-between items-start">
        <PageTitle>현장 사진</PageTitle>
        <Button 
          size="small" 
          variant="contained" 
          type="button" 
          style={{background:'#74788d'}}
          onClick={onModalToggle}
        >
          추가
        </Button>
      </div>
      <MaterialReactTable 
        columns={columns}
        data={originData}
        paginationDisplayMode="pages"
        enableSorting={false}
        enableTopToolbar={false}
        enableColumnActions={false}
        enableStickyHeader
        positionActionsColumn="last"
        manualPagination={true}
        rowCount={totalCount}
        state={{ isLoading: isLoading, pagination}}
        onPaginationChange={setPagination}
        muiTablePaperProps={{
          sx: {
            boxShadow: 'none',
            background: 'none',
            minHeight: '650px'
          }
        }}
        muiTableContainerProps={{
          sx: {
            minHeight: '590px'
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
      <Dialog
        open={modalOpen}
        onClose={onClose}
      >
        <DialogTitle>장비 코드 {isEdit ? '수정' : '추가'}</DialogTitle>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <DialogContent dividers>
          <form>
            <fieldset className="flex justify-start items-center gap-2 mb-2">
              <label className="w-20">건물코드</label>
              <TextField
                size='small'
                className="active:outline-none"
                name="code"
                value={formData.code}
                onChange={onChangeFormData}
              />
            </fieldset>
            <fieldset className="flex justify-start items-center gap-2 mb-2">
              <label className="w-20">건물이름</label>
              <TextField
                size='small'
                className="active:outline-none"
                name="buildingName"
                value={formData.buildingName}
                onChange={onChangeFormData}
              />
            </fieldset>
            <fieldset className="flex justify-start items-center gap-2 mb-2">
              <label className="w-20">지상 층수</label>
              <TextField
                size='small'
                className="active:outline-none"
                name="floor"
                value={formData.floor}
                onChange={onChangeFormData}
                type="number"
                inputProps={{min: "0"}}
              />
            </fieldset>
            <fieldset className="flex justify-start items-center gap-2 mb-2">
              <label className="w-20">지하 층수</label>
              <TextField
                size='small'
                className="active:outline-none"
                name="underFloor"
                value={formData.underFloor}
                onChange={onChangeFormData}
                inputProps={{min: "0"}}
                
              />
            </fieldset>
          </form>
        </DialogContent>
        <DialogActions className="justify-between"> 
          <CancelButton variant="contained" onClick={onClose}>취소</CancelButton>
          <SaveButton variant="contained">저장</SaveButton>
        </DialogActions>
      </Dialog>
    </SettingCard>
  )
};

export default AgencySetting;
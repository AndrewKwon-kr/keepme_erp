import { useMemo, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { MaterialReactTable, MRT_ColumnDef, MRT_PaginationState } from "material-react-table";
import { PageTitle } from "components/common/Text";
import { SettingCard } from "../common/Card";
import { Close } from "@mui/icons-material";
import { CancelButton, SaveButton } from "components/common/Button";

type DeviceSettingData = {
  code?: number | string,
  name: string,
  description: string
};

const DeviceSetting = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [originData, setOrginData] = useState<DeviceSettingData[]>([
    {
      code: 1,
      name: '비콘 수신기',
      description: '비콘 수신기'
    },
    {
      code: 2,
      name: '가스 탐지기',
      description: '일산화탄소가스 탐지기'
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

  const [formData, setFormData] = useState<DeviceSettingData>({
    name: '',
    description: ''
  });

  const columns = useMemo<MRT_ColumnDef<any>[]>(()=> [
    {
      accessorKey:'code',
      header: '장비코드'
    },
    {
      accessorKey:'name',
      header: '장비이름'
    },
    {
      accessorKey:'description',
      header: '설명'
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
      name: '',
      description: ''
    });
    onModalToggle()
  };

  return (
    <SettingCard>
      <div className="flex justify-between items-start">
        <PageTitle>장비 코드</PageTitle>
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
              <label className="w-20">장비코드</label>
              <TextField
                size='small'
                className="active:outline-none"
                name="code"
                value={formData.code}
                onChange={onChangeFormData}
              />
            </fieldset>
            <fieldset className="flex justify-start items-center gap-2 mb-2">
              <label className="w-20">장비이름</label>
              <TextField
                size='small'
                className="active:outline-none"
                name="name"
                value={formData.name}
                onChange={onChangeFormData}
              />
            </fieldset>
            <fieldset className="flex justify-start items-center gap-2 mb-2">
              <label className="w-20">설명</label>
              <TextField
                size='small'
                className="active:outline-none"
                name="description"
                value={formData.description}
                onChange={onChangeFormData}
                minRows={3}
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

export default DeviceSetting;
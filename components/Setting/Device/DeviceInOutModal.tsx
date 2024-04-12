import { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";
import { ResFieldWorkerList, ResDeviceInOutListProps } from "interface/response";
import dayjs, { Dayjs } from "dayjs";
import { ReqDeviceInOutProps } from "interface/request";
import { postDeviceInOut } from "api/Device";
import styled from "@emotion/styled";
import { ButtonType } from "app/setting/fieldworker/page";

type DeviceInOutProps = {
  open: boolean,
  toggle: any,
  employeeCode: number | undefined,
  agencyCode: string | undefined, 
  user: ResFieldWorkerList | ResDeviceInOutListProps | undefined,
  type: string,
  typeCode: number,
  update: Function
};

const DeviceInOutModal = (props: DeviceInOutProps) => {

  const { open, toggle, employeeCode, agencyCode, user, type, typeCode, update } = props;

  const [datetime, setDatetime] = useState<string | null>(dayjs().format('YYYY-MM-DDThh:mm'));
  const [isInOutCheck, setIsInOutCheck] = useState<boolean>(false);

  useEffect(() => {
    if (typeCode === 1) {
      if (user?.deviceInOutStateCode === '1') {
        setIsInOutCheck(true);
        setDatetime(user.deviceOut.replace(' ', 'T'));
      }
    }
  }, [user, typeCode]);

  const onChangeDateTime = (e: any) => {
    setDatetime(e.target.value);
  };

  const onSave = () => {
    var today = new Date();
    var requestData: ReqDeviceInOutProps = {
      workDate: dayjs(today).format('YYYYMMDD'),
      userCode: user?.userCode,
      agencyCode: agencyCode,
      deviceType: 1,
      deviceInOutStateCode: typeCode,
      deviceInOutTime: dayjs(datetime).format('YYYYMMDDHHmmss'),
      employeeCode: employeeCode
    };
    postDeviceInOut(requestData)
    .then((res: any) => {
      if(res.result === 0) {
        setIsInOutCheck(true);
        window.alert(`${type} 저장 되었습니다.`);
        update(true);
      } else {
        setIsInOutCheck(false);
        window.alert(`${type} 저장에 실패하였습니다.`)
      }
    })
  };

  return (
    <Dialog open={open} onClose={toggle}>
      <DialogTitle>기기 {type} 관리</DialogTitle>
      <IconButton 
        onClick={toggle}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}>
        <Close />
      </IconButton>
      <DialogContent dividers>
        <form>
          <fieldset className="flex justify-start items-center">
            <label className="w-24">이름</label>
            <TextField
              className="w-[250px] active:outline-none"
              id="outlined-controlled-user-name"
              value={user.name}
              size="small"
              disabled
              />
          </fieldset>
          <fieldset className="flex justify-start items-center mt-5">
            <label className="w-24">{type} 시간</label>
            <TextField 
              className="w-[250px] active:outline-none"
              type="datetime-local"
              size="small"
              value={datetime}
              onChange={onChangeDateTime}
              disabled={isInOutCheck}
            />
          </fieldset>
        </form>
      </DialogContent>
      <DialogActions className="justify-between">
        <CustomButton variant="contained" ver='#74788d' onClick={toggle}>취소</CustomButton>
        <CustomButton variant="contained" ver='#171C61' onClick={onSave} disabled={isInOutCheck}>저장</CustomButton>
      </DialogActions>
    </Dialog>
  )
};

const CustomButton = styled(Button)<ButtonType>`
  background-color: ${props => props.disabled ? '#7679a8' : props.ver} !important;
  color: white !important;
`;


export default DeviceInOutModal;
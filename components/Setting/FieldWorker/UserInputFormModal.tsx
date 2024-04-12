import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton, TextField, Select, MenuItem, DialogActions, Button, ToggleButtonGroup, ToggleButton, FormGroup, FormControlLabel, Checkbox } from "@mui/material"
import { ResAgencyList, ResDepartmentList, ResFieldWorkerList } from "interface/response";
import Image from "next/image";
import defaultImage from 'public/images/icon-user-circle.svg'
import { WorkerInsertData } from "interface/request";
import { getFieldWorkerValueExists, postFieldWorker, putFieldWorker } from "api/Worker";

type ModalProp = {
  open: boolean,
  toggle: any,
  isEdit: boolean,
  agencyItem: ResAgencyList[],
  departmentItem: ResDepartmentList[],
  selectWorker?: ResFieldWorkerList,
  employee: any,
  update: Function
};

type ButtonType = {
  ver: string
};

const UserInputFormModal = (props: ModalProp) => {
  
  const { open, toggle, isEdit, agencyItem, departmentItem, selectWorker, employee, update } = props;

  const [formData, setFormData] = useState<WorkerInsertData>({
    name: "",
    juminNumber: "",
    companyCode: 0,
    companyName: '',
    agencyCode: '',
    deptCode: 0,
    positionCode: 0,
    officeStatusCode: "1",
    email: "",
    phone: "",
    birthDay: "",
    startDate: "",
    endDate: "",
    picture: "",
    employeeCode: employee.code,
    foreignerYn: 1,
  });
  const [phoneDuplicate, setPhoneDuplicate] = useState<boolean | null>(null);
  const [alignment, setAlignment] = useState(1);

  const onClose = () => {
    setFormData({
      name: "",
      juminNumber: "",
      companyCode: 0,
      companyName: '',
      agencyCode: "",
      deptCode: 0,
      positionCode: 0,
      officeStatusCode: "1",
      email: "",
      phone: "",
      birthDay: "",
      startDate: "",
      picture: "",
      employeeCode: 0,
      userCode: 0,
      foreignerYn: 1
    });
    toggle();
  };

  useEffect(() => {
    if (isEdit) {
      if (selectWorker.foreignerYn === 0) {
        setFormData({
          name: selectWorker.name,
          juminNumber: "",
          companyName: selectWorker.companyName,
          agencyCode: selectWorker.agencyCode,
          deptCode: selectWorker.departmentCode,
          officeStatusCode: selectWorker.officeStatusCode,
          phone: selectWorker.mobileNumber,
          birthDay: selectWorker.birthDay,
          startDate: selectWorker.startDate,
          endDate: selectWorker.endDate,
          picture: selectWorker.picture,
          employeeCode: employee.code,
          userCode: selectWorker.userCode,
          companyCode: employee.companyCode,
          email: "",
          positionCode: 0,
          foreignerYn: selectWorker.foreignerYn,
          foreignName: selectWorker.foreignName,
          nation: selectWorker.nation,
          dateOfIssue: selectWorker.dateOfIssue,
          expirationPeriod: selectWorker.expirationPeriod,
          remark: selectWorker.remark,
          illegal: selectWorker.illegal
        });
      } else {
        setFormData({
          name: selectWorker.name,
          juminNumber: "",
          companyName: selectWorker.companyName,
          agencyCode: selectWorker.agencyCode,
          deptCode: selectWorker.departmentCode,
          officeStatusCode: selectWorker.officeStatusCode,
          phone: selectWorker.mobileNumber,
          birthDay: selectWorker.birthDay,
          startDate: selectWorker.startDate,
          endDate: selectWorker.endDate,
          picture: selectWorker.picture,
          employeeCode: employee.code,
          userCode: selectWorker.userCode,
          companyCode: employee.companyCode,
          email: "",
          positionCode: 0,
          foreignerYn: 1
        });
      }
    } else {
      setFormData({
        ...formData, 
        companyCode: employee.companyCode, 
        companyName: employee.companyName,
        employeeCode: employee.code, 
        deptCode: 0,
      });
    }
  },[isEdit]);

  const onChangeFormData = (e: any) => {
    var { name, value } = e.target;
    if (name === 'illegal') {
      if (e.target.checked) {
        setFormData({...formData, [name]: 0});
      } else {
        setFormData({...formData, [name]: 1});
      }
    } else {
      setFormData({...formData, [name]: value});
    }
  };

  const onCreate = () => {
    var insertData = formData;
    if (alignment) {
      insertData.juminNumber = insertData.birthDay.replaceAll('-','').slice(2) + insertData.juminNumber;
      insertData.nation = '대한민국';
    } else {
      insertData.juminNumber= "",
      insertData.registrationNumber= insertData.birthDay.replaceAll('-','').slice(2) + insertData.registrationNumber;
    }
    var data = postFieldWorker(insertData);
    data.then((res) => {
      if (res.state === 0) {
        window.alert('근로자를 등록하였습니다.');
        onClose();
      } else {
        window.alert('근로자 등록에 실패하였습니다.');
      }
    });
    update(true);
  };

  const onUpdate = () => {
    var updateData = formData;
    updateData.juminNumber = updateData.birthDay.replaceAll('-','').slice(2) + updateData.juminNumber;
    console.log(updateData)
    var data = putFieldWorker(updateData);
    data.then((res) => {
      if (res.state === 0) {
        window.alert('근로자를 수정하였습니다.');
        onClose();
      } else {
        window.alert('근로자 수정에 실패하였습니다.');
      }
    });
  };

  const onClickSave = (e: any) => {
    e.preventDefault();
    if(formData.name === '') {
      window.alert('이름을 입력하세요.');
      return;
    };
    if (formData.companyCode == 0) {
      window.alert('업체명을 선택해주세요.');
      return;
    };
    if(formData.agencyCode === "0") {
      window.alert('현장명을 선택해주세요.');
      return;
    };
    if(formData.deptCode == 0) {
      window.alert('부서명을 선택해주세요.');
      return;
    };
    if(formData.startDate === "") {
      window.alert('입사일을 입력해주세요.');
      return;
    };
    if (isEdit) onUpdate();
    else onCreate();
  };

  const onPhoneDuplicate = (e: any) => {
    if (!isEdit) {
      var { value } = e.target;
      var duplication;
      
      if(value.length >= 11) {
        duplication = getFieldWorkerValueExists(value.replaceAll('-',''), 0);
      } else if (value.length === 0) {
        setPhoneDuplicate(null);
        return;
      } else {
        duplication = getFieldWorkerValueExists(value, 0);
      }
  
      duplication.then((data: any) => {
        if (data.state === 0) {
          setPhoneDuplicate(true);
        } else {
          setPhoneDuplicate(false);
        }
      });
    };
  };

  const handleChangeAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: number) => {
    if (newAlignment != alignment) {
      setAlignment(newAlignment);
    } else {
      setAlignment(alignment);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md'>
      <DialogTitle>근로자 {isEdit ? '수정' : '추가'}</DialogTitle>
      <IconButton className='absolute top-2 right-2 text-[#7A7F94]' onClick={onClose}>
        <Close />
      </IconButton>
      <DialogContent dividers>
        <ToggleButtonGroup 
          fullWidth
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChangeAlignment}
        >
          <ToggleButton 
            value={1}
            size="small"
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
                borderRadius: '4px 0 0 4px',
              },
            }}>내국인</ToggleButton>
          <ToggleButton 
            value={0}
            size="small"
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
                borderRadius: '0 4px 4px 0',
              },
            }}>외국인</ToggleButton>
        </ToggleButtonGroup>
        <form className='mt-7 space-y-5'>
          <div className="flex justify-between gap-12">
            <fieldset className="flex flex-col justify-center items-center">
              <Image 
                src={defaultImage}
                alt='...'
                width={150}
                height={150}
              />
              {alignment === 0 && (
                <FormGroup className="mt-7">
                  <FormControlLabel 
                    control={
                    <Checkbox
                      sx={{
                        color: '#171C61',
                        '&.Mui-checked': {
                          color: '#171C61'
                        }
                      }}
                      name='illegal'
                      checked={formData.illegal === 0 ? true : false}
                      onChange={onChangeFormData}
                    />} 
                    label='체류기간만료'
                    labelPlacement="start"
                    sx={{
                      '&.MuiFormControlLabel-labelPlacementStart': {
                        color: '#787878',
                        columnGap: '35px'
                      }
                    }}
                  />
                </FormGroup>
              )}
            </fieldset>
            <fieldset className="justify-self-end">
              <div className="flex items-center mb-5 gap-x-8">
                <label className="text-grey w-14">이름</label>
                <TextField
                  className="w-[250px] active:outline-none"
                  id="name"
                  name="name"
                  value={formData.name}
                  size="small"
                  disabled={isEdit}
                  onChange={onChangeFormData}
                />
              </div>
              {alignment === 0 && (
                <div className="flex items-center mb-5 gap-x-8">
                  <label className="text-grey w-14">외국이름</label>
                  <TextField
                    className="w-[250px] active:outline-none"
                    id="foreignName"
                    name="foreignName"
                    value={formData.foreignName}
                    size="small"
                    disabled={isEdit}
                    onChange={onChangeFormData}
                  />
                </div>
              )}
              <div className="flex items-center mb-5 gap-x-8">
                <label className="text-grey w-14">연락처</label>
                <TextField
                  className="w-[250px] active:outline-none"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  size="small"
                  onChange={onChangeFormData}
                  onBlur={onPhoneDuplicate}  
                  error={phoneDuplicate !== null ? phoneDuplicate ? false : true : false}
                  inputProps={{maxLength: 13}}
                  helperText={phoneDuplicate !== null ? !phoneDuplicate ? '이미 사용중인 연락처입니다.' : '사용 가능한 연락처입니다.': null}
                />
                
              </div>
              <div className="flex items-center gap-x-8">
                <label className="text-grey w-14">생년월일</label>
                <TextField
                  className="w-[250px] active:outline-none"
                  id="birthday"
                  name='birthDay'
                  value={formData.birthDay}
                  size="small"
                  disabled={isEdit}
                  onChange={onChangeFormData}
                  type="date"
                />
              </div>
            </fieldset>
          </div>
          {alignment === 0 && (
            <>
              <fieldset className="mb-5">
                <label className="text-grey">국가</label>
                <TextField 
                  className="active:outline-none w-full"
                  size="small"
                  value={formData.nation}
                  name='nation'
                  onChange={onChangeFormData}
                />
              </fieldset>
              <fieldset className="mb-5">
                <label className="text-grey">비고</label>
                <TextField 
                  className="active:outline-none w-full"
                  size="small"
                  value={formData.remark}
                  name='remark'
                  onChange={onChangeFormData}
                />
              </fieldset>
            </>
          )}
          {alignment === 1 && (
            <fieldset className="mb-5">
              <label className="text-grey w-14">주민등록번호</label>
              <div className="flex gap-3 items-center mt-1">
                <div className="flex items-center w-full">
                  <TextField 
                    className="active:outline-none w-full"
                    size="small"
                    inputProps={{maxLength: 6}}
                    value={formData.birthDay.replaceAll('-','')}
                    onChange={onChangeFormData}
                    disabled
                  />
                  <span className="px-2">-</span>
                  <TextField 
                    className="active:outline-none w-full"
                    size="small"
                    type="password"
                    name='juminNumber'
                    inputProps={{maxLength: 7}}
                    value={formData.juminNumber}
                    onChange={onChangeFormData}
                    disabled={isEdit}
                  />
                </div>
              </div>
            </fieldset>
          )}
          {alignment === 0 && (
            <>
              <fieldset className="mb-5">
                <label className="text-grey w-14">외국인등록번호</label>
                <div className="flex gap-3 items-center mt-1">
                  <div className="flex items-center w-full">
                    <TextField 
                      className="active:outline-none w-full"
                      size="small"
                      inputProps={{maxLength: 6}}
                      value={formData.birthDay.replaceAll('-','')}
                      onChange={onChangeFormData}
                      disabled
                    />
                    <span className="px-2">-</span>
                    <TextField 
                      className="active:outline-none w-full"
                      size="small"
                      type="password"
                      name='registrationNumber'
                      inputProps={{maxLength: 7}}
                      value={formData.registrationNumber}
                      onChange={onChangeFormData}
                      disabled={isEdit}
                    />
                  </div>
                </div>
              </fieldset>
              <fieldset className="flex justify-between w-full gap-5 mb-5">
                <div className="flex flex-col justify-start items-start w-full">
                  <label className="text-grey w-14 mb-1">발급일자</label>
                  <TextField
                    className="active:outline-none"
                    id="dateOfIssue"
                    name="dateOfIssue"
                    value={formData.dateOfIssue}
                    size="small"
                    type="date"
                    onChange={onChangeFormData}
                    fullWidth
                  />
                </div>
                <div className="flex flex-col justify-start items-start w-full">
                  <label className="text-grey w-14 mb-1">유효기간</label>
                  <TextField
                    id='expirationPeriod'
                    name='expirationPeriod'
                    value={formData.expirationPeriod}
                    onChange={onChangeFormData}
                    size="small"
                    fullWidth
                    type="date"
                  />
                </div>
              </fieldset>
            </>
          )}
          <fieldset className="flex justify-between w-full gap-5 mb-5">
            <div className="flex flex-col justify-start items-start w-full">
              <label className="text-grey w-14 mb-1">업체명</label>
              <TextField
                className="active:outline-none"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                size="small"
                disabled
                onChange={onChangeFormData}
                fullWidth
              />
            </div>
            <div className="flex flex-col justify-start items-start w-full">
              <label className="text-grey w-14 mb-1">현장명</label>
              <Select
                id='worker-agency'
                name='agencyCode'
                value={formData.agencyCode}
                onChange={onChangeFormData}
                size="small"
                fullWidth
              >
                {agencyItem.filter(list => list.code !== '9999').map(list=>(
                  <MenuItem key={list.code} value={list.code}>{list.name}</MenuItem>
                ))}
              </Select>
            </div>
          </fieldset>
          <fieldset className="flex justify-between w-full gap-5">
            <div className="flex flex-col justify-start items-start w-full">
              <label className="text-grey w-14 mb-1">부서명</label>
              <Select
                id='worker-deptCode'
                name='deptCode'
                value={formData.deptCode}
                onChange={onChangeFormData}
                size="small"
                fullWidth
              >
                <MenuItem value={0} disabled>부서를 선택하세요.</MenuItem>
                {departmentItem.filter(list => list.code !== 9999).map(list=>(
                  <MenuItem key={list.code} value={list.code}>{list.name}</MenuItem>
                ))}
              </Select>
            </div>
            <div className="flex flex-col justify-start items-start w-full">
            <label className="text-grey w-14 mb-1">입사일</label>
              <TextField
                className="active:outline-none"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                size="small"
                type="date"
                onChange={onChangeFormData}
                fullWidth
              />
            </div>
          </fieldset>
        </form>
      </DialogContent>
      <DialogActions className="justify-between">
        <CustomButton variant="contained" ver='#74788d' onClick={onClose}>취소</CustomButton>
        <CustomButton variant="contained" ver='#171C61' onClick={onClickSave}>저장</CustomButton>
      </DialogActions>
    </Dialog>
  )
};

const CustomButton = styled(Button)<ButtonType>`
  background-color: ${props => props.disabled ? '#7679a8' : props.ver} !important;
  color: white !important;
`;

export default UserInputFormModal;

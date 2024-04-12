import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton, TextField, Select, MenuItem, DialogActions, Button } from "@mui/material"
import { ResAgencyList, ResDepartmentList, ResManangerList } from "interface/response";
import Image from "next/image";
import defaultImage from 'public/images/icon-user-circle.svg'
import { postSiteManager, putSiteManager } from "api/Manager";
import { WorkerInsertData } from "interface/request";
import { getAgencyList, getDeptList } from "api";

type ModalProp = {
  open: boolean,
  toggle: any,
  selectWorker?: ResManangerList,
  employee: any,
  isEdit: boolean,
  update: Function
};

type ButtonType = {
  ver: string
};

const UserInputFormModal = (props: ModalProp) => {
  const { open, toggle, isEdit, selectWorker, employee, update } = props;

  const [departmentItem, setDepartmentItem] = useState<ResDepartmentList[]>([]);
  const [agencyItem, setAgencyItem] = useState<ResAgencyList[]>([]);
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
  const [nationality, setNationality] = useState('rrn') // 내국인: rrn, 외국인: frn
  const [phoneDuplicate, setPhoneDuplicate] = useState<boolean | null>(null);
  const [leftButtonStyle, setLeftButtonStyle] = useState<string>('rounded-l border border-navy py-2 px-4 text-white bg-navy');
  const [rightButtonStyle, setRightButtonStyle] = useState<string>('rounded-r border border-navy py-2 px-4 color-navy');

  const onClose = () => {
    setFormData({
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
    toggle();
  };

  useEffect(() => {
    if (isEdit) {
      var birthYear = selectWorker.birthDay.slice(0, 4);
      var birthMonth = selectWorker.birthDay.slice(4, 6);
      var birthDay = selectWorker.birthDay.slice(6, 8);

      var startYear = selectWorker.startDate.slice(0, 4);
      var startMonth = selectWorker.startDate.slice(4, 6);
      var startDay = selectWorker.startDate.slice(6, 8);

      // var endYear, endMonth, endDay;
      // if (selectWorker.endDate !== '') {

      // }
      setFormData({
        name: selectWorker.name,
        juminNumber: selectWorker.juminNumber.slice(7),
        companyName: selectWorker.companyName,
        agencyCode: selectWorker.agencyCode,
        deptCode: Number(selectWorker.deptCode),
        // officeStatus: selectWorker.officeStatus,
        officeStatusCode: "1",
        phone: selectWorker.phone,
        birthDay: birthYear + '-' + birthMonth + '-' + birthDay,
        startDate: startYear + '-' + startMonth + '-' + startDay,
        endDate: selectWorker.endDate,
        picture: selectWorker.picture,
        employeeCode: employee.code,
        userCode: selectWorker.code,
        companyCode: employee.companyCode,
        email: "",
        positionCode: 0,
        foreignerYn: 1
      });
    } else {
      setFormData({
        ...formData, 
        companyCode: employee.companyCode, 
        companyName: employee.companyName,
        employeeCode: employee.code, 
      });
    }

    var depBody, agencyBody;
    if (employee !== undefined) {
      depBody = {
        companyCode: employee.companyCode,
        agencyCode: employee.agencyCode,
      };
      agencyBody = {
        companyCode: employee.companyCode,
        agencyCode: employee.agencyCode
      };
    };

    var deptList = getDeptList(depBody);
    deptList.then((res: ResDepartmentList[]) => {
      setDepartmentItem(res);
    });

    var agencyList = getAgencyList(agencyBody);
    agencyList.then((res: ResAgencyList[]) => {
      setAgencyItem(res);
    });
  },[]);

  const onChangeFormData = (e: any) => {
    var { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  const onNationalityChange = (e: any) => {
    var value = e.target.value
    setNationality(value);
    if (value === 'rrn') {
      setLeftButtonStyle('rounded-l border border-navy py-2 px-4 text-white bg-navy');
      setRightButtonStyle('rounded-r border border-navy py-2 px-4 text-navy');
    } else {
      setLeftButtonStyle('rounded-l border border-navy py-2 px-4 text-navy');
      setRightButtonStyle('rounded-r border border-navy py-2 px-4 text-white bg-navy');
    }
  };

  const onCreate = () => {
    var insertData = formData;
    insertData.juminNumber = insertData.birthDay.replaceAll('-','').slice(2) + insertData.juminNumber;
    var data = postSiteManager(insertData);
    data.then((res) => {
      if (res.state === 0) {
        window.alert('관리자를 등록하였습니다.');
      } else {
        window.alert('관리자 등록에 실패하였습니다.');
      }
    });
    update(true);
    onClose();
  };

  const onUpdate = () => {
    var updateData = formData;
    updateData.juminNumber = updateData.birthDay.replaceAll('-','').slice(2) + updateData.juminNumber;
    var data = putSiteManager(updateData);
    data.then((res) => {
      if (res.state === 0) {
        window.alert('관리자를 수정하였습니다.');
      } else {
        window.alert('관리자 수정에 실패하였습니다.');
      }
    });
    onClose();
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

  // const onPhoneDuplicate = (e: any) => {
  //   var { value } = e.target;
  //   var duplication;
    
  //   if(value.length >= 11) {
  //     duplication = getFieldWorkerValueExists(value.replaceAll('-',''), 0);
  //   } else {
  //     duplication = getFieldWorkerValueExists(value, 0);
  //   }

  //   duplication.then((data: any) => {
  //     if (data.state === 0) {
  //       setPhoneDuplicate(true);
  //     } else {
  //       setPhoneDuplicate(false);
  //     }
  //   })
  // };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md'>
      <DialogTitle>관리자 {isEdit ? '수정' : '추가'}</DialogTitle>
      <IconButton className='absolute top-2 right-2 text-[#7A7F94]' onClick={onClose}>
        <Close />
      </IconButton>
      <DialogContent dividers>
        <form className='grid grid-cols-2'>
          <fieldset className="col-span-1 justify-self-center self-center">
            <Image 
              src={defaultImage}
              alt='...'
              width={150}
              height={185}
            />
          </fieldset>
          <fieldset className="col-span-1 justify-self-end">
            <div className="flex flex-col justify-start mb-5">
              <label className="font-bold mb-1">이름</label>
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
            <div className="flex flex-col justify-start mb-5">
              <label className="font-bold mb-1">연락처</label>
              <TextField
                className="w-[250px] active:outline-none"
                id="phone"
                name="phone"
                value={formData.phone}
                size="small"
                onChange={onChangeFormData}
                // onBlur={onPhoneDuplicate}            
              />
              {phoneDuplicate !== null ? phoneDuplicate
                ? (<div className='text-green-700 mt-1'>사용 가능한 연락처입니다.</div>)
                : (<div className='text-red-400 mt-1'>이미 사용중인 연락처입니다.</div>)
                : null}
            </div>
            <div className="flex flex-col justify-start mb-5">
              <label className="font-bold mb-1">생년월일</label>
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
          <fieldset className="mb-5 col-span-2">
            <label className="font-bold mb-1">주민등록번호 / 외국인등록번호</label>
            <div className="flex gap-3 items-center mt-1">
              <div className="">
                <RadioButton 
                  type="radio"
                  autoComplete="off"
                  name="nationality" 
                  id="rrn" 
                  checked={nationality === 'rrn'} 
                  onChange={onNationalityChange}
                  value={`rrn`}
                  disabled={isEdit}
                />
                <label className={leftButtonStyle} htmlFor="rrn">내국인</label>
                <RadioButton 
                  type="radio"
                  autoComplete="off"
                  name="nationality" 
                  id="frn" 
                  checked={nationality === 'frn'} 
                  onChange={onNationalityChange}
                  value={`frn`}
                  disabled={isEdit}
                />
                <label className={rightButtonStyle} htmlFor="frn">외국인</label>
              </div>
              <div className="flex items-center">
                <TextField 
                  className="active:outline-none "
                  size="small"
                  inputProps={{maxLength: 6}}
                  value={formData.birthDay.replaceAll('-','')}
                  onChange={onChangeFormData}
                  disabled
                />
                <span className="px-2">-</span>
                <TextField 
                  className="active:outline-none "
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
          <fieldset className="flex justify-between w-full gap-5 mb-5 col-span-2">
            <div className="flex justify-start gap-3 items-center w-full">
              <label className="font-bold mb-1 w-16">업체명</label>
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
            <div className="flex justify-start gap-3 items-center w-full">
              <label className="font-bold mb-1 w-16">현장명</label>
              <Select
                id='worker-agency'
                name='agencyCode'
                value={formData.agencyCode}
                onChange={onChangeFormData}
                size="small"
                fullWidth
              >
                <MenuItem value={'0'} disabled>현장을 선택하세요.</MenuItem>
                {agencyItem.filter(list => list.code !== '9999').map(list=>(
                  <MenuItem key={list.code} value={list.code}>{list.name}</MenuItem>
                ))}
              </Select>
            </div>
          </fieldset>
          <fieldset className="flex justify-between w-full gap-5 col-span-2">
            <div className="flex justify-start gap-3 items-center w-full">
              <label className="font-bold mb-1 w-16">부서명</label>
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
            <div className="flex justify-start gap-3 items-center w-full">
            <label className="font-bold mb-1 w-16">입사일</label>
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

const RadioButton = styled.input`
  position: absolute;
  clip: rect(0, 0, 0, 0);
  pointer-events: none;
`;

const CustomButton = styled(Button)<ButtonType>`
  background-color: ${props => props.disabled ? '#7679a8' : props.ver} !important;
  color: white !important;
`;

export default UserInputFormModal;
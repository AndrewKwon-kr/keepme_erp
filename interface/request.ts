// agecncy list
export interface ReqAgencyList {
  companyCode: string,
  userId: number
};

// Device inout
export interface ReqDeviceInOutProps {
  workDate: string,
  userCode: number | undefined,
  agencyCode: string | undefined,
  deviceType: number,
  deviceInOutStateCode: number,
  deviceInOutTime: string,
  employeeCode: number | undefined
};

// Field Worker
export interface WorkerInsertData {
  name: string, // 근로자이름
  juminNumber: string, // 주민번호
  companyCode: number, // 회사코드
  companyName: string, // 회사이름
  agencyCode: string, // 소속코드
  deptCode: number, // 부서코드
  positionCode: number, // 직책코드
  email: string, // 이메일
  phone: string, // 연락처
  birthDay: string, // 생일
  startDate: string, // 근무 시작일
  picture: string, // 근로자 사진
  employeeCode: number, // 등록 관리자
  registrationNumber?: string, // 외국인번호
  foreignerYn: number, // 외국인 유무 외국인 : 0, 내국인 : 1
  foreignName?: string, // 외국인 이름
  nation?: string, // 국적
  dateOfIssue?: string, // 외국인 번호 발급일자
  expirationPeriod?: string, // 외국인 번호 유효기간
  illegal?: number, // 체류기간 말료 불체자 : 0, 정상 : 1
  remark?: string, // 비고
  userCode?: number, // 근로자 코드
  officeStatusCode?: string, // 근무 여부 퇴사 : 0, 근무 중 : 1
  endDate?: string // 퇴사 일자
};

/** Safe */
// Card Count
export interface ReqWorkerCounterProps {
  companyCode: string;
  agencyCode: string;
  userid: string;
};

// User Vital Sign List
export interface ReqUserVitalSignListProps {
  companyCode: string,
  agencyCode: string,
  vitalSignState: number,
  employeeCode: number,
  pageIndex: number,
  rowPerPage: number
};
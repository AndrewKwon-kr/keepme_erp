import axios, { AxiosResponse } from 'axios';
/** Axios Response 데이터 형식
 *  config : 요청에 대한 axios 구성 설정
 *  data 서버가 제공한 응답 데이터
 *  headers : 헤더 정보
 *  request : 요청
 *  status : 응답 HTTP 상태 코드
 *  statusText : 응답 HTTP 상태 메시지
 */

// 본인 서버에서 내려주는 응답 구조
export interface APIResponse<T> {
  statusCode: number; // 상태코드 (보인 서버상태코드)
  errorCode: number; // 에러코드 (본인 서버에러코드)
  message: string; // 메시지
  result: T; // 데이터 내용
  timestamp: Date; // 시간
  data: T; // 데이터 내용
  totalCount: number;
  result_text?: string;
  error_message?: string;
}

// 부서 리스트
export interface ResDepartmentList {
  code: number;
  name: string;
  manager: number;
  orderby: number;
}

// 현장 리스트
export interface ResAgencyList {
  code: string;
  companyCode: string;
  name: string;
  parentCode: string;
  level: number;
}

// 단말기 리스트
export interface TerminalList {
  code: number;
  terminalId: number;
  terminalName: string;
  agencyCode: string;
  agencyName: string;
}

// 현장 근로자 리스트
export interface ResFieldWorkerList {
  agencyCode: string;
  agencyManager: number;
  agencyName: string;
  agencyParentManager: number;
  agencyParentName: string;
  birthDay: string;
  companyName: string;
  dateOfIssue?: string;
  departmentCode: number;
  departmentName: string;
  deviceIn: string;
  deviceInOutStateCode: string;
  deviceInOutStateName: string;
  deviceOut: string;
  deviceTypeCode: string;
  deviceTypeName: string;
  endDate: string;
  expirationPeriod?: string;
  foreignName?: string;
  foreignerYn?: number;
  illegal?: number;
  mobileNumber: string;
  name: string;
  nation?: string;
  officeStatus: string;
  officeStatusCode: string;
  parentCode: string;
  picture: string;
  remark?: string;
  startDate: string;
  userCode: number;
  userId: string | number;
  terminalId?: number;
}

// 근로자 상태
export interface ResWorkerVitalSign {
  Code: number;
  userId: string;
  name: string;
  departmentCode: number;
  mobileNumber: string;
  startDate: string;
  agencyParentName: string;
  agencyCode: string;
  parentCode: string;
  companyName: string;
  agencyame: string;
  departmentName: string;
  agencyParentManager: number;
  agencyManager: number;
  temperature: number;
  temperatureState: string | null;
  temperatureCode: string | null;
  heartbeat: number;
  heartbeatState: string | null;
  heartbeatCode: string | null;
  spo2: number;
  spo2State: string | null;
  spo2Code: string | null;
  state: string;
  stateCode: string;
  deviceBattery: number;
  phoneBattery: number;
  vitalDate: string;
  latitude: number;
  longitude: number;
}

// Device
export interface ResDeviceInOutListProps {
  userCode: number;
  userId: string;
  name: string;
  officeStatus: string;
  agencyParentName: string;
  agencyCode: string;
  parentCode: string;
  companyName: string;
  agencyName: string;
  departmentName: string;
  deviceTypeName: string;
  deviceTypeCode: string;
  deviceInOutStateName: string;
  deviceInOutStateCode: string;
  deviceOut: string;
  deviceIn: string;
}

// Manager
export interface ResManangerList {
  code: number;
  id: string;
  name: string;
  juminNumber: string;
  companyCode: string;
  companyName: string;
  agencyCode: string;
  agencyName: string;
  deptCode: string;
  deptName: string;
  positionCode: string;
  email: string;
  phone: string;
  birthDay: string;
  startDate: string;
  endDate: string | null;
  officeStatus: string | null;
  workPlace: string | null;
  picture: string | null;
  passwordResetYN: string;
  passwordErrCnt: number;
  parentName: string;
}

// User Vital Sign
export interface ResUserVitalSignList {
  userCode: number;
  userId: string;
  name: string;
  departmentCode: string;
  mobileNumber: string;
  startDate: string;
  picture: string;
  agencyParentName: string;
  agencyCode: string;
  parentCode: string;
  companyName: string;
  agencyname: string;
  departmentName: string;
  agencyParentManager: number;
  agencyManager: number;
  temperature: number;
  temperatureState?: string;
  temperatureCode?: number;
  avgTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  heartbeat: number;
  heartbeatState?: string;
  heartbeatCode?: number;
  avgHeartbeat: number;
  maxHeartbeat: number;
  minHeartbeat: number;
  avgSpo2: number;
  maxSpo2: number;
  minSpo2: number;
  working: number;
  move: number;
  state: string;
  stateCode: string;
  deviceBattery: number;
  phoneBattery: number;
  latitude: number;
  longitude: number;
  time?: number | undefined;
  registerDateHeart: string;
  registerDateTemp: string;
  registerDateSpo2: string;
  registerDateIsWear: string;
  isWear: number;
  floor?: number;
}

// Card Count
export interface ResWorkerCounterDataProps {
  workerCount: number;
  workingCount: number;
  normalCount: number;
  warningCount: number;
  prevNormalCountPer: number;
  prevWarningCountPer: number;
  companyCode: string;
  companyName: string;
  agencyCode: string;
  agencyName: string;
  notIsWearCount: number;
  dangerZoneCount: number;
  offtimeCount: number;
  chargeCount: number;
  dangerCount: number;
}

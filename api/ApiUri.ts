/**
 * API URI
 */

// Agency
export const GET_AGENCY_LIST = '/Agency/AgencyList';

// Worker
export const GET_USER_LIST = '/User/UserList'; // 근로자 리스트
export const POST_USER = '/User/UserInsert'; // 근로자 등록
export const PUT_USER = '/User/UserUpdate'; // 근로자 수정
export const GET_USER = '/User/UserInfo'; // 근로자 정보
export const GET_FIELD_WORKER_EXIST = '/User/UserValueExists'; // 근로자 중복 체크
export const GET_MISS_MATCH_WORKER_LIST = '/Employee/EmployeeMissMatch'; // 근로자 MissMatching 리스트
export const GET_MISS_MATCH_WORKER_LIST_MODAL = '/Employee/EmployeeMissMatchPopUp'; // 근로자 MissMatching 리스트(팝업창)
export const POST_WORKER_SYNC = '/Employee/EmployeeMatchSync'; // 근로자 매칭

// Manager
export const GET_MANAGER = '/Employee/EmployeeSelect'; // 관리자 조회
export const POST_MANAGER = '/Employee/EmployeeInsert'; // 관리자 등록
export const PUT_MANAGER = '/Employee/EmployeeUpdate'; // 관리자 수정
export const RESET_MANAGER_PASSWORD = '/Employee/EmployeePasswordRest'; // 관리자 비밀번호 초기화
export const INIT_MANAGER_PASSWORD = '/Employee/EmployeeFirstPasswordChange'; // 관리자 비밀번호 초기화

// Worker VitalSign
export const POST_USER_VITAL_SIGN_LIST = '/UserVitalSign/UserVitalSignList'; // 근로자 생체신호 리스트
export const POST_USER_VITAL_SIGN = '/UserVitalSign/UserVitalSign'; // 근로자 생체신호
export const POST_USER_VITAL_SIGN_HISTORY = '/UserVitalSign/UserVitalSignHistory'; // 근로자 생체신호 이력

// Device
export const POST_DEVICE_IN_OUT = '/Device/DeviceInOut'; // 기기 입출고 - watch

// Dashboard
export const GET_ATTENDANCE_LIST = '/Dashboard/DashboardAttendanceCnt'; // 홈 대시보드 근태 Cnt
export const GET_MEAL_MEMBER_LIST = '/Dashboard/DashboardNumberOfMeals'; // 요일별 식사 인원 수

// Safe
export const GET_SAFE_WORKER_COUNT = '/Dashboard/WorkerCount'; // 전체인원 현황

// 안면인식기 (Terminal)
export const GET_TERMINAL_LIST = '/Terminal/TerminalList'; // 단말기 리스트

// Report
export const GET_DAILY_REPORT_LIST = '/DailyReport/DailyReportList'; // 작업일보 조회
export const POST_DAILY_REPORT_WORKER = '/DailyReport/DailyReportSave'; // 작업일보-직원저장
export const DELETE_DAILY_REPORT_WORKER = '/DailyReport/DailyReportEmpDelete'; // 작업일보-직원삭제
export const PUT_DAILY_REPORT_DETAIL = '/DailyReport/DailyReportDetailSave'; // 작업일보-상세저장

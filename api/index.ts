import axios, { Axios, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'; // 추가
import { APIResponse } from '../interface/response';
import LocalStorage from 'interface/localstorage';
import {
  GET_AGENCY_LIST,
  GET_ATTENDANCE_LIST,
  GET_MEAL_MEMBER_LIST,
  GET_MISS_MATCH_WORKER_LIST,
  GET_MISS_MATCH_WORKER_LIST_MODAL,
  GET_TERMINAL_LIST,
  POST_WORKER_SYNC,
  GET_DAILY_REPORT_LIST,
  POST_DAILY_REPORT_WORKER,
  DELETE_DAILY_REPORT_WORKER,
  PUT_DAILY_REPORT_DETAIL,
} from './ApiUri';

export const JWT_AUTH_USER = 'authUser'; // 인증 유저 데이터 저장 용
export const JWT_ACCESS_TOKEN = 'accessToken';
export const JWT_REFRESH_TOKEN = 'refreshToken';
// export const BASE_URL = 'https://gncs.inconus.kr/api'
export const BASE_URL = 'https://gncsdev.inconus.kr/api'; // 개발용

// axios 인스턴스 생성
const client: Axios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: AxiosError) => {
    return Promise.reject(err);
  },
);

export const setAuthToken = async (token?: string) => {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
    LocalStorage.setItem(JWT_ACCESS_TOKEN, token);
  } else {
    delete client.defaults.headers.common.Authorization;
    LocalStorage.removeItem(JWT_ACCESS_TOKEN);
  }
};

//TODO: GET 메서드
export const getData = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<APIResponse<T>> => {
  try {
    const response = await client.get<APIResponse<T>>(url, config);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

//TODO: POST 메서드
export const postData = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<APIResponse<T>> => {
  try {
    const response = await client.post<APIResponse<T>>(url, data, config);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

//TODO: PUT 메서드
export const putData = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<APIResponse<T>> => {
  try {
    const response = await client.put<APIResponse<T>>(url, data, config);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

//TODO: Delete 메서드
export const deleteData = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<APIResponse<T>> => {
  try {
    const response = await client.delete<APIResponse<T>>(url, config);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 임시 토큰 발행 api
export const getAuthUser = async (body: any) => {
  try {
    const response: any = await postData('/Account/login', body);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 근로자 부서리스트
export const getDeptList = async (body: any) => {
  try {
    const { data }: any = await postData('/User/DeptList', body);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 현장 리스트
export const getAgencyList = async (body: any) => {
  try {
    const { data }: any = await postData(GET_AGENCY_LIST, body);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

//근로자 바이탈 리스트
export const getUserVitalSignList = async (body: any) => {
  try {
    // const { data }: any = await postData('/UserVitalSign/UserVitalSignList', body);
    const { data }: any = await axios.post(
      'https://api.inconus.kr/api/UserVitalSign/UserVitalSignList',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return data.data;
    // return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 일일 현황(근태)
export const getAttDailyList = async (body: any) => {
  try {
    const response: any = await postData('/Attendance/AttDaily', body);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 월별 현황(근태)
export const getAttMonthlyList = async (body: any) => {
  try {
    const response: any = await postData('/Attendance/AttMonthly', body);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 홈 대시보드 근태 Cnt
export const getAttendanceCnt = async (body: any) => {
  try {
    const response: any = await postData(GET_ATTENDANCE_LIST, body);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 홈 대시보드 근태 Cnt
export const getMealMemberList = async (body: any) => {
  try {
    const response: any = await postData(GET_MEAL_MEMBER_LIST, body);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 단말기 리스트
export const getTerminalList = async () => {
  try {
    const { data }: any = await postData(GET_TERMINAL_LIST);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 근로자 MissMatching 리스트
export const getEmployeeMissMatchList = async (body: any) => {
  try {
    const response: any = await postData(GET_MISS_MATCH_WORKER_LIST, body);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 근로자 MissMatching 리스트(팝업)
export const getModalEmployeeMissMatchList = async (body: any) => {
  try {
    const response: any = await postData(GET_MISS_MATCH_WORKER_LIST_MODAL, body);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 근로자 매칭하기
export const postWorkerSync = async (body: any) => {
  try {
    const response: any = await postData(POST_WORKER_SYNC, body);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 작업일보
export const getDailyReportList = async (body: any) => {
  try {
    const response: any = await postData(GET_DAILY_REPORT_LIST, body);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 작업일보-상세저장
export const putDailyReportList = async (body: any) => {
  try {
    const response: any = await postData(PUT_DAILY_REPORT_DETAIL, body);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 작업일보-직원저장
export const postDailyReportWorker = async (body: any) => {
  try {
    const response: any = await postData(POST_DAILY_REPORT_WORKER, body);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

// 작업일보-직원저장
export const deleteDailyReportWorker = async (body: any) => {
  try {
    const response: any = await postData(DELETE_DAILY_REPORT_WORKER, body);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

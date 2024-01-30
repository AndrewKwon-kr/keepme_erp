import axios, { Axios, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'; // 추가
import { APIResponse } from '../interface/response';

export const JWT_AUTH_USER = 'authUser'; // 인증 유저 데이터 저장 용
export const JWT_ACCESS_TOKEN = 'accessToken';
export const JWT_REFRESH_TOKEN = 'refreshToken';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMDEwNDQ0NTUxMDciLCJleHAiOjE3MDYxNTY5ODEsImlzcyI6Imh0dHBzOi8vYXBpLmluY29udXMua3IiLCJhdWQiOiJNeSBrZWVwbWUgVXNlcnMifQ.-uPrzhUga7C_ydoODeFxWj4cVkPEtdyRpkR_FN-aNTU';
// axios 인스턴스 생성
const client: Axios = axios.create({
  baseURL: 'https://test.inconus.kr/api',
  headers: {
    'Content-Type': 'application/json',
    // Authorization: `Bearer ${token}`,
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
    localStorage.setItem(JWT_ACCESS_TOKEN, token);
  } else {
    delete client.defaults.headers.common.Authorization;
    localStorage.removeItem(JWT_ACCESS_TOKEN);
  }
};

//TODO: GET 메서드
export const getData = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<APIResponse<T>> => {
  try {
    setAuthToken(token);
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
export const getAuthUser = async () => {
  try {
    const response = await postData('/Account/login', {
      id: '01044455107',
      password: '0',
      deviceToken: '0',
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

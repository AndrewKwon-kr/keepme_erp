import { postData } from "api";
import { GET_FIELD_WORKER_EXIST, POST_USER, POST_USER_VITAL_SIGN, POST_USER_VITAL_SIGN_HISTORY, PUT_USER } from "./ApiUri";
import { ResWorkerVitalSign } from "interface/response";
import { WorkerInsertData } from "interface/request";

export const getUserVitalSignHistory = async (body: any) => {
  try {
    const data: any = await postData<ResWorkerVitalSign[]>(POST_USER_VITAL_SIGN_HISTORY, body);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserVitalSign = async (body: any) => {
  try {
    const data: any = await postData(POST_USER_VITAL_SIGN, body);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const postFieldWorker = async (body: WorkerInsertData) => {
  try {
    const data = await postData(POST_USER, body);
    var { result, result_text } = data;
    if ( result === 0) {
      return {state: result, text: result_text}
    } else {
      return {state: 404, text: 'err'}
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const putFieldWorker =async (body: WorkerInsertData) => {
  try {
    const data = await postData(PUT_USER, body);
    var { result, result_text} = data;
    if ( result === 0) {
      return {state: result, text: result_text}
    } else {
      return {state: 404, text: 'err'}
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * getFieldWorkerValueExists 근로자 중복 체크
 * @param value 값
 * @param state 0: 전화번호 1: 주민번호
 * @returns 
 */
export const getFieldWorkerValueExists =async (value: string, state: number) => {
  const body = { checkValue: value, checkState: state };
  try {
    const data = await postData(GET_FIELD_WORKER_EXIST, body);
    var { result, result_text } = data;
    if ( result === 0) {
      return {state: result, text: result_text}
    } else {
      return {state: 404, text: 'err'}
    }
  } catch (error) {
    return {state: 404, text: 'err'}
  }
}
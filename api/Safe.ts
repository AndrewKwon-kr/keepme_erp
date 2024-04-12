import { postData } from "api"
import { ReqUserVitalSignListProps, ReqWorkerCounterProps } from "interface/request";
import { GET_SAFE_WORKER_COUNT, POST_USER_VITAL_SIGN_LIST } from "./ApiUri";
import { ResUserVitalSignList, ResWorkerCounterDataProps } from "interface/response";

export const getDangerWorkerList = async (body: ReqUserVitalSignListProps) => {
  try {
    const data = await postData<ResUserVitalSignList[]>(POST_USER_VITAL_SIGN_LIST, body);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getSafeCardCount = async (body: ReqWorkerCounterProps) => {
  try {
    const data = await postData<ResWorkerCounterDataProps[]>(GET_SAFE_WORKER_COUNT, body);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

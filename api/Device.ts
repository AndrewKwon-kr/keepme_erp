import { postData } from "api";
import { ReqDeviceInOutProps } from "interface/request";
import { POST_DEVICE_IN_OUT } from "./ApiUri";

export const postDeviceInOut = async (body: ReqDeviceInOutProps) => {
  try {
    const data: any =  await postData(POST_DEVICE_IN_OUT, body)
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
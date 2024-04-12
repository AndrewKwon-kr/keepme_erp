import { postData } from "api";
import { WorkerInsertData } from "interface/request";
import { POST_MANAGER, PUT_MANAGER } from "./ApiUri";

export const postSiteManager = async (body: WorkerInsertData) => {
  try {
    const data = await postData(POST_MANAGER, body);
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

export const putSiteManager = async (body: WorkerInsertData) => {
  try {
    const data = await postData(PUT_MANAGER, body);
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
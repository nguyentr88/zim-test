import { API_CONSTANT } from "@/constant";
import { apiBase, METHOD, REQUEST_TYPE } from "@/utility";
import { ActionType, AppDispatch, RootState } from "@/redux";

const { start_get_all_memorable_moments, stop_get_all_memorable_moments } =
  ActionType;

const { API_GET_MEMORABLE_MOMENTS } = API_CONSTANT;

export const getAllStore = () => {
  return (dispatch: AppDispatch) => {
    const body = {};
    dispatch(start_get_all_memorable_moments());
    apiBase(API_GET_MEMORABLE_MOMENTS, METHOD.POST, body)
      .then((response: any) => {
        console.log("getAllStore success", response);
        const { object } = response;
        dispatch(stop_get_all_memorable_moments(object));
      })
      .catch((error) => {
        console.log("getAllStore error", error);
        dispatch(
          stop_get_all_memorable_moments([], true, false, "Không có data"),
        );
      });
  };
};

const MOCK_DATA = [
    
]
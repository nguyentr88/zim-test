import { ActionType } from "@/redux";
import { homeState } from "./state";
import { createReducer } from "@/redux/reducer";

const { start_get_all_memorable_moments, stop_get_all_memorable_moments } =
  ActionType;

const homeReducer = createReducer(homeState, (builder: any) => {
  builder
    .addCase(start_get_all_memorable_moments, (state: any, action: any) => {
      return {
        ...state,
        stateMemorableMoments: {
          isLoading: true,
        },
      };
    })
    .addCase(stop_get_all_memorable_moments, (state: any, action: any) => {
      const { memorableMomentsList, isError, isEmpty, description } =
        action.payload;
      return {
        ...state,
        memorableMoments: memorableMomentsList,
        stateMemorableMoments: {
          isLoading: false,
          isError,
          isEmpty,
          description,
        },
      };
    })
    .addDefaultCase((state: any, action: any) => state);
});

export { homeReducer };

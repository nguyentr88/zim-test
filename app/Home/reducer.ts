import { ActionType, reducer } from "@/redux";
import { homeState } from "./state";

const { createReducer } = reducer;

const { startGetAllMemorableMoments, stopGetAllMemorableMoments } = ActionType;

const homeReducer = createReducer(homeState, (builder: any) => {
  builder
    .addCase(startGetAllMemorableMoments, (state: any, action: any) => {
      return {
        ...state,
        stateMemorableMoments: {
          isLoading: true,
        },
      };
    })
    .addCase(stopGetAllMemorableMoments, (state: any, action: any) => {
      const { memorableMomentsList, isError, isEmpty, description } = action.payload;
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

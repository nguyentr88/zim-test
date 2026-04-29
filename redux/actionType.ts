import { createAction } from "./reducer";

// ============================= Action Type Constants ============================= //

// Home
const START_GET_ALL_MEMORABLE_MOMENTS = "START_GET_ALL_MEMORABLE_MOMENTS";
const STOP_GET_ALL_MEMORABLE_MOMENTS = "STOP_GET_ALL_MEMORABLE_MOMENTS";

// ============================= Action Creator ============================= //

// Home
export const start_get_all_memorable_moments = createAction(
  START_GET_ALL_MEMORABLE_MOMENTS,
);
export const stop_get_all_memorable_moments = createAction(
  STOP_GET_ALL_MEMORABLE_MOMENTS,
  (
    memorableMomentsList: any[] = [],
    isError: boolean = false,
    isEmpty: boolean = false,
    description: string = "",
  ) => ({
    payload: { memorableMomentsList, isError, isEmpty, description },
  }),
);

import { HomeStateType } from "./type";

export const homeState: HomeStateType = {
  stateMemorableMoments: {
    isLoading: false,
    isError: false,
    isEmpty: false,
    description: "",
  },
  memorableMoments: [],
};

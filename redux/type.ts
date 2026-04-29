import { ActionType, StateType } from "typesafe-actions";
import { mapDispatchToProps } from "./actionCreator";
import * as AppState from "./appState";
import { type Dispatch } from "./reducer";

export type Store = StateType<typeof import("./store").default>;
export type AppDispatch = Dispatch<ActionType<any>>;
export type RootState = typeof AppState;

export type AppAction = ReturnType<typeof mapDispatchToProps>;

export type HomeActionType = AppAction['homeAction'];

import createStore, { type StoreType } from './createStore';
import { createAction, createReducer } from '@reduxjs/toolkit';
import { connect, Provider as ReduxProvider } from 'react-redux';
//@ts-ignore
import { bindActionCreators, type Dispatch } from 'redux';

interface ThunkDispatch<S, E, A extends Dispatch> {
  <R>(thunkAction: ThunkAction<R, S, E, A>): R;
  <T extends A>(action: T): T;
}

type ThunkAction<R, S, E, A extends Dispatch> = (
  dispatch: ThunkDispatch<S, E, A>,
  getState: () => S,
  extraArgument: E
) => R;

declare module 'redux' {
  //@ts-ignore
  function bindActionCreators<M extends ActionCreatorsMapObject<any>>(
    actionCreators: M,
    dispatch: Dispatch
  ): {
      [N in keyof M]: ReturnType<M[N]> extends ThunkAction<any, any, any, any>
      ? (...args: Parameters<M[N]>) => ReturnType<ReturnType<M[N]>>
      : M[N]
    };
}

export {
  ReduxProvider,
  createStore,
  createAction,
  createReducer,
  //@ts-ignore
  bindActionCreators,
  connect,
  type Dispatch,
  type StoreType
};
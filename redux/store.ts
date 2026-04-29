import { enableMapSet } from 'immer';
import { createStore } from './createStore';
import { AppState, appReducer } from '.';

enableMapSet();

const store = createStore(appReducer, AppState);
export default store;

import { combineReducers, configureStore, createReducer } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
// @ts-ignore
import logger from 'redux-logger';

const listMiddleware: Array<any> = [thunk];
// @ts-ignore
if (__DEV__) {
    listMiddleware.push(logger);
}

export type StoreType = ReturnType<typeof configureStore> & {
    injectReducer?: (asyncReducer: any, asyncAppState: any) => void;
    asyncReducers?: any;
    asyncAppStates?: any;
    reducer?: any;
};

export const createStore = (appReducer: any, appState: any) => {

    const store: StoreType = configureStore({
        reducer: getReducer(appReducer, appState),
middleware: (getDefaultMiddleware) => listMiddleware.filter(m => typeof m === 'function') as any,        preloadedState: appState
    });

    store.asyncReducers = {};

    store.injectReducer = (asyncReducer: any, asyncAppState: any) => {
        Object.keys(asyncReducer).forEach((key) => {
            if (!appReducer.hasOwnProperty(key)) {
                store.asyncReducers[key] = asyncReducer[key];
            }
        })
        //@ts-ignore
        store.replaceReducer(getReducer({ ...appReducer, ...store.asyncReducers }, { ...appState, ...asyncAppState }) as any);
    };

    return store;
};

const getReducer = (appReducer: any, appState: any) => (
    createReducer(appState, (builder: any) => {
        //@ts-ignore
        builder.addDefaultCase(combineReducers(appReducer));
    })
);

export default createStore;
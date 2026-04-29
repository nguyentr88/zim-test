import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from '@/navigation/MainNavigator';
import { ReduxProvider, createStore } from '@/redux/reducer';
import { AppState, appReducer } from '@/redux';

const store = createStore(appReducer, AppState);

export default function App() {
  return (
    <ReduxProvider store={store}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </ReduxProvider>
  );
}

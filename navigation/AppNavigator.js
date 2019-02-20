import React from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import AuthStackNavigator from './AuthStackNavigator';
import DrawerNavigator from './DrawerNavigator';
const MainAppNavigator = createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    AuthLoadingScreen: AuthLoadingScreen,
    Auth: AuthStackNavigator,
    App: DrawerNavigator,
});

const AppNavigator = createAppContainer(MainAppNavigator)
export default AppNavigator

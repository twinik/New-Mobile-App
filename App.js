import React, { useEffect } from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { StatusBar } from "expo-status-bar";
import bottomTabBarScreen from "./components/bottomTabBarScreen";
import LoadingScreen from "./components/loadingScreen";
import signinScreen from "./screens/auth/signinScreen";
import signupScreen from "./screens/auth/signupScreen";
import verificationScreen from "./screens/auth/verificationScreen";
import editProfileScreen from "./screens/editProfile/editProfileScreen";
import notificationsScreen from "./screens/notifications/notificationsScreen";
import showMapScreen from "./screens/showMap/showMapScreen";
import splashScreen from "./screens/splashScreen";
import NewTaskScreen from "./screens/newTask/newTaskScreen";
import TimeSlotScreenStartBefore from "./components/TimeSlotScreenStartBefore";
import TimeSlotScreenEndBefore from "./components/TimeSlotScreenEndBefore";
import JobForm from "./screens/forms/testForm";
import MapView from "./screens/order/MapView";
import { LogBox } from "react-native";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";

/* LogBox.ignoreLogs([
  "ViewPropTypes will be removed",
  "ColorPropType will be removed",
]); */

const queryClient = new QueryClient();

const switchNavigator = createSwitchNavigator(
  {
    Loading: LoadingScreen,
    mainFlow: createStackNavigator({
      Splash: splashScreen,
      Signin: signinScreen,
      Signup: signupScreen,
      Verification: verificationScreen,
      BottomTabBar: bottomTabBarScreen,
      Notifications: notificationsScreen,
      EditProfile: editProfileScreen,
      ShowMap: showMapScreen,
      NewTask: NewTaskScreen,
      TimeSlotScreenStartBefore: TimeSlotScreenStartBefore,
      TimeSlotScreenEndBefore: TimeSlotScreenEndBefore,
      MapView: MapView,
      JobForm: JobForm,
    }),
  },
  {
    initialRouteName: "Loading",
    transitionSpec: {
      duration: 100,
    },
  }
);

const App = createAppContainer(switchNavigator);

const AppEnhancer = () => {
  return <App />;
};
export default () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ApplicationProvider {...eva} theme={eva.light}>
          <AppEnhancer />
          <StatusBar style="auto" />
        </ApplicationProvider>
      </Provider>
    </QueryClientProvider>
  );
};

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import LandingScreenIntro from '../screens/Auth/LandingScreenIntro';
import LandingScreen from '../screens/Auth/LandingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import AdminUploadPage from '../screens/AdminUploadPage';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminNavigator from './AdminNavigator';
import DashboardScreen from '../screens/DashboardScreen';
import AttendeeDashboardPage from '../screens/AttendeeDashboardPage';
import MyUnitsPage from '../screens/Attendee/MyUnitsPage';
import AttendanceHistoryPage from '../screens/Attendee/AttendanceHistoryPage';
import MessagesPage from '../screens/Attendee/MessagesPage';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="LandingIntro" component={LandingScreenIntro} />
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="AdminUpload" component={AdminUploadPage} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminNav" component={AdminNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen
        name="AttendeeDashboard"
        component={AttendeeDashboardPage}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#A020F0" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "700" },
          title: "Dashboard"
        }}
      />
      <Stack.Screen
        name="MyUnits"
        component={MyUnitsPage}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#A020F0" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "700" },
          title: "My Units"
        }}
      />
      <Stack.Screen
        name="AttendanceHistory"
        component={AttendanceHistoryPage}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#A020F0" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "700" },
          title: "Attendance History"
        }}
      />
      <Stack.Screen
        name="Messages"
        component={MessagesPage}
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#A020F0" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "700" },
          title: "Messages"
        }}
      />
    </Stack.Navigator>
  );
}
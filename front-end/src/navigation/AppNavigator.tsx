import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import LandingScreenIntro from '../screens/Auth/LandingScreenIntro';
import LandingScreen from '../screens/Auth/LandingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CSVUploadScreen from '../screens/Admin/CSVUploadScreen';
import AdminDashboard from '../screens/Admin/AdminDashboard';
import AttendantDashboard from '../screens/Attendant/AttendantDashboard';
import AttendeeDashboard from '../screens/Attendee/AttendeeDashboard';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="LandingIntro" component={LandingScreenIntro} />
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="CSVUpload" component={CSVUploadScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="AttendantDashboard" component={AttendantDashboard} />
      <Stack.Screen name="AttendeeDashboard" component={AttendeeDashboard} />
    </Stack.Navigator>
  );
}
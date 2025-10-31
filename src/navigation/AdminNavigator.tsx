import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ManageUsers from "../screens/Admin/ManageUsers";
import ManageSessions from "../screens/Admin/ManageSessions";
import ViewAnalytics from "../screens/Admin/ViewAnalytics";

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#9b5cff" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontSize: 18, fontWeight: "600" },
      }}
    >
      <Stack.Screen
        name="Manage Users"
        component={ManageUsers}
      />
      <Stack.Screen
        name="Manage Sessions"
        component={ManageSessions}
      />
      <Stack.Screen
        name="View Analytics"
        component={ViewAnalytics}
      />
    </Stack.Navigator>
  );
}
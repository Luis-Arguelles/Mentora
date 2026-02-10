import { useTheme } from "@/providers/ThemeProvider";
import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";

const calendarBlue = require("@/assets/images/navbar-icons/calendar.png");
const openBookBlue = require("@/assets/images/navbar-icons/open_book.png");
const homeBlue = require("@/assets/images/navbar-icons/home.png");
const graduationHatBlue = require("@/assets/images/navbar-icons/graduation_hat.png");
const userBlue = require("@/assets/images/navbar-icons/user.png");

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "black",
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          elevation: 0, // 4. Removes the shadow on Android
          shadowOpacity: 0, // 5. Removes the shadow on iOS
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="study"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              source={graduationHatBlue}
              style={{
                width: size,
                height: size,
                tintColor: color,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              source={openBookBlue}
              style={{
                width: size,
                height: size,
                tintColor: color,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              source={homeBlue}
              style={{
                width: size,
                height: size,
                tintColor: color,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              source={calendarBlue}
              style={{
                width: size,
                height: size,
                tintColor: color,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              source={userBlue}
              style={{
                width: size,
                height: size,
                tintColor: color,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}

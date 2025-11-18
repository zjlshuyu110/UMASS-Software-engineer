import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/src/components/haptic-tab';
import { IconSymbol } from '@/src/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="discover"
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#8C1C1C"
      }}>
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="grid" color={color} />,
          
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: 'Games',
          tabBarIcon: ({ color }) => <Ionicons size={28} name='basketball' color={color} />,
        }} 
      />
      <Tabs.Screen 
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color }) => <Ionicons size={28} name='chatbubble' color={color}/>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="person" color={color} />,
        }}
      />

    </Tabs>
  );
}

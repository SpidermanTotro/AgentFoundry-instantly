import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ChatScreen from '../screens/ChatScreen';
import GenSparkScreen from '../screens/GenSparkScreen';
import DeveloperScreen from '../screens/DeveloperScreen';
import GitHubScreen from '../screens/GitHubScreen';
import ToolsScreen from '../screens/ToolsScreen';

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: '#6366F1',
          background: '#0f172a',
          card: '#111827',
          text: '#F9FAFB',
          border: '#1F2937',
          notification: '#22D3EE',
        },
      }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#6366F1',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarStyle: {
            backgroundColor: '#0f172a',
            borderTopColor: '#1F2937',
            paddingBottom: 6,
            height: 58,
          },
          tabBarIcon: ({ color, size }) => {
            const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
              Chat: 'chatbubble-ellipses',
              GenSpark: 'sparkles',
              Developer: 'code-slash',
              GitHub: 'logo-github',
              Tools: 'construct',
            };
            return <Ionicons name={icons[route.name] || 'ellipse'} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="GenSpark" component={GenSparkScreen} />
        <Tab.Screen name="Developer" component={DeveloperScreen} />
        <Tab.Screen name="GitHub" component={GitHubScreen} />
        <Tab.Screen name="Tools" component={ToolsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

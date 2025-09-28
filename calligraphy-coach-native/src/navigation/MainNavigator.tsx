import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import i18n from '../locales';
import { MainTabParamList } from './types';

// 임시 스크린 컴포넌트
import LearnScreen from '../screens/LearnScreen';
import CalligraphyScreen from '../screens/CalligraphyScreen';
import ProgressScreen from '../screens/ProgressScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help';

          switch (route.name) {
            case 'Learn':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'Calligraphy':
              iconName = focused ? 'brush' : 'brush-outline';
              break;
            case 'Progress':
              iconName = focused ? 'trending-up' : 'trending-up-outline';
              break;
            case 'Community':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6B46C1',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#6B46C1',
        },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen 
        name="Learn" 
        component={LearnScreen}
        options={{ 
          title: i18n.t('navigation.learn'),
          headerTitle: i18n.t('sections.learnKorean'),
        }}
      />
      <Tab.Screen 
        name="Calligraphy" 
        component={CalligraphyScreen}
        options={{ 
          title: i18n.t('navigation.calligraphy'),
          headerTitle: i18n.t('sections.calligraphyMaster'),
          tabBarBadge: 'NEW',
        }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{ 
          title: i18n.t('navigation.progress'),
        }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{ 
          title: i18n.t('navigation.community'),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: i18n.t('navigation.profile'),
        }}
      />
    </Tab.Navigator>
  );
}
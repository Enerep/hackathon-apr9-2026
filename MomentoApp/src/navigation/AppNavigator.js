import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Home, Search, Camera, Heart, User } from 'lucide-react-native';
import { useAuth } from '../hooks/useAuth';
import { colors, moderateScale, fontScale } from '../theme';

import HomeScreen from '../screens/HomeScreen';
import CommunityScreen from '../screens/CommunityScreen';
import CameraScreen from '../screens/CameraScreen';
import ActivityScreen from '../screens/ActivityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import VerifyIDScreen from '../screens/VerifyIDScreen';
import VerificationStatusScreen from '../screens/VerificationStatusScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabIcons = {
  Home: Home,
  Community: Search,
  Camera: Camera,
  Activity: Heart,
  Profile: User,
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          const IconComponent = tabIcons[route.name];
          return (
            <IconComponent
              size={moderateScale(22)}
              strokeWidth={focused ? 2.2 : 1.6}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: colors.dark,
        tabBarInactiveTintColor: `${colors.brown}66`,
        tabBarLabelStyle: {
          fontSize: fontScale(10),
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: `${colors.paper}F2`,
          borderTopWidth: 1,
          borderTopColor: `${colors.tan}4D`,
          paddingBottom: moderateScale(4),
          paddingTop: moderateScale(4),
          height: moderateScale(56),
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <Text style={styles.loadingTitle}>.Human</Text>
      <ActivityIndicator color={colors.brown} style={{ marginTop: moderateScale(16) }} />
    </View>
  );
}

export default function AppNavigator() {
  const { user, isAuthenticated, ready } = useAuth();

  if (!ready) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </>
      ) : user && user.verificationStatus === 'none' ? (
        <>
          <Stack.Screen name="VerifyID" component={VerifyIDScreen} />
          <Stack.Screen name="VerificationStatus" component={VerificationStatusScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      ) : user && (user.verificationStatus === 'pending' || user.verificationStatus === 'denied') ? (
        <>
          <Stack.Screen name="VerificationStatus" component={VerificationStatusScreen} />
          <Stack.Screen name="VerifyID" component={VerifyIDScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="VerifyID" component={VerifyIDScreen} />
          <Stack.Screen name="VerificationStatus" component={VerificationStatusScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingTitle: {
    fontStyle: 'italic',
    fontSize: fontScale(36),
    color: colors.dark,
    fontWeight: '700',
  },
});

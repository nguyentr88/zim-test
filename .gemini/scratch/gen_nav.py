import os

base_dir = '/Users/trnguyenh8/Documents/work/React Native/Zim'

# 1. Create constant/navigation.ts
nav_const_path = os.path.join(base_dir, 'constant', 'navigation.ts')
os.makedirs(os.path.dirname(nav_const_path), exist_ok=True)
with open(nav_const_path, 'w') as f:
    f.write('''export const HOME_NAVIGATOR = 'HOME_NAVIGATOR';
export const HOME_SCREEN = 'HOME_SCREEN';
export const TAB_NAVIGATOR = 'TAB_NAVIGATOR';
''')

# 2. Update navigation/HomeNavigator.tsx
home_nav_path = os.path.join(base_dir, 'navigation', 'HomeNavigator.tsx')
os.makedirs(os.path.dirname(home_nav_path), exist_ok=True)
with open(home_nav_path, 'w') as f:
    f.write('''import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HOME_SCREEN } from '@/constant/navigation';
import HomeScreen from '@/app/Home';

const Stack = createNativeStackNavigator();

export default function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={HOME_SCREEN} component={HomeScreen} />
    </Stack.Navigator>
  );
}
''')

# 3. Create navigation/TabNavigator.tsx
tab_nav_path = os.path.join(base_dir, 'navigation', 'TabNavigator.tsx')
with open(tab_nav_path, 'w') as f:
    f.write('''import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HOME_NAVIGATOR } from '@/constant/navigation';
import HomeNavigator from './HomeNavigator';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name={HOME_NAVIGATOR} component={HomeNavigator} />
    </Tab.Navigator>
  );
}
''')

# 4. Create navigation/MainNavigator.tsx
main_nav_path = os.path.join(base_dir, 'navigation', 'MainNavigator.tsx')
with open(main_nav_path, 'w') as f:
    f.write('''import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TAB_NAVIGATOR } from '@/constant/navigation';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={TAB_NAVIGATOR} component={TabNavigator} />
    </Stack.Navigator>
  );
}
''')

# 5. Update app/_layout.tsx
app_layout_path = os.path.join(base_dir, 'app', '_layout.tsx')
with open(app_layout_path, 'w') as f:
    f.write('''import React from 'react';
import MainNavigator from '@/navigation/MainNavigator';

export default function RootLayout() {
  return <MainNavigator />;
}
''')

# Remove app/index.tsx as Expo router will use _layout.tsx which directly renders MainNavigator,
# and MainNavigator doesn't rely on file-based routing.
# Actually, Expo router requires at least one route if it has a _layout, but if _layout returns normal React Native views, it should be fine.
app_index_path = os.path.join(base_dir, 'app', 'index.tsx')
if os.path.exists(app_index_path):
    os.remove(app_index_path)

print("Navigation structure generated successfully.")

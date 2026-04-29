import os
import shutil

base_dir = '/Users/trnguyenh8/Documents/work/React Native/Zim'

# 1. Move container/Home to app/Home
container_home_dir = os.path.join(base_dir, 'container', 'Home')
app_home_dir = os.path.join(base_dir, 'app', 'Home')

if os.path.exists(container_home_dir):
    shutil.move(container_home_dir, app_home_dir)

container_dir = os.path.join(base_dir, 'container')
if os.path.exists(container_dir) and not os.listdir(container_dir):
    os.rmdir(container_dir)

# 2. Update app/index.tsx to import from app/Home
app_index_path = os.path.join(base_dir, 'app', 'index.tsx')
if os.path.exists(app_index_path):
    with open(app_index_path, 'r') as f:
        content = f.read()
    content = content.replace('@/container/Home', '@/app/Home')
    with open(app_index_path, 'w') as f:
        f.write(content)

# 3. Create navigation/HomeNavigator.tsx from app/_layout.tsx logic
home_navigator_path = os.path.join(base_dir, 'navigation', 'HomeNavigator.tsx')
with open(home_navigator_path, 'w') as f:
    f.write('''import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function HomeNavigator() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Home/index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
''')

# 4. Update app/_layout.tsx to just import and render HomeNavigator
app_layout_path = os.path.join(base_dir, 'app', '_layout.tsx')
with open(app_layout_path, 'w') as f:
    f.write('''import React from 'react';
import HomeNavigator from '@/navigation/HomeNavigator';

export default function RootLayout() {
  return <HomeNavigator />;
}
''')

print("Moved Home to app/ and refactored layout to HomeNavigator.")

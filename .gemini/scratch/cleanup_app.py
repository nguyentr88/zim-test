import os
import shutil

app_dir = '/Users/trnguyenh8/Documents/work/React Native/Zim/app'

# 1. Remove unnecessary files and folders
for item in ['(tabs)', 'modal.tsx']:
    path = os.path.join(app_dir, item)
    if os.path.exists(path):
        if os.path.isdir(path):
            shutil.rmtree(path)
        else:
            os.remove(path)

# 2. Write new app/index.tsx
with open(os.path.join(app_dir, 'index.tsx'), 'w') as f:
    f.write('''import Home from '@/container/Home';

export default function Index() {
  return <Home />;
}
''')

# 3. Rewrite app/_layout.tsx
with open(os.path.join(app_dir, '_layout.tsx'), 'w') as f:
    f.write('''import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
''')

print('App structure cleaned up successfully.')

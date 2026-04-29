import os
import shutil

src_dir = '/Users/trnguyenh8/Documents/work/React Native/Zim/src'

# 1. Clean up src/container/Home
home_dir = os.path.join(src_dir, 'container', 'Home')
if os.path.exists(home_dir):
    shutil.rmtree(home_dir)
os.makedirs(home_dir)

# Create only required files in Home
home_files = ['index.tsx', 'action.ts', 'state.ts', 'reducer.ts', 'type.d.ts']
for f in home_files:
    path = os.path.join(home_dir, f)
    if f == 'index.tsx':
        content = """import React from 'react';
import { View, StyleSheet } from 'react-native';

const Home = () => {
  return (
    <View style={styles.container}>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default Home;
"""
    else:
        content = "export {};\n"
    with open(path, 'w') as file:
        file.write(content)

# 2. Clean up src/components
comp_dir = os.path.join(src_dir, 'components')
if os.path.exists(comp_dir):
    shutil.rmtree(comp_dir)
os.makedirs(comp_dir)

# Create basic components
comp_files = ['ScreenWrapper.tsx', 'index.tsx']
for f in comp_files:
    path = os.path.join(comp_dir, f)
    if f == 'ScreenWrapper.tsx':
        content = """import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ScreenWrapperProps {
  children?: React.ReactNode;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default ScreenWrapper;
"""
    else:
        content = "export { default as ScreenWrapper } from './ScreenWrapper';\n"
    with open(path, 'w') as file:
        file.write(content)

# 3. Create other requested folders
folders_to_create = ['redux', 'context', 'hook', 'constant', 'navigation']
for folder in folders_to_create:
    folder_path = os.path.join(src_dir, folder)
    os.makedirs(folder_path, exist_ok=True)
    with open(os.path.join(folder_path, 'index.ts'), 'w') as file:
        file.write("export {};\n")

print("Done")

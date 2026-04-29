import os

components_files = [
    "ImageViewer.tsx",
    "index.tsx",
    "ErrorWebLoginSheet.tsx",
    "LoggerButton.tsx",
    "MyWrapper.tsx",
    "Logger.tsx",
    "PickerLocation/index.tsx",
    "PickerLocation/action.tsx",
    "PickerLocation/PickerLocation.tsx",
    "PickerLocation/ProvinceWardPicker.tsx",
    "PickerLocation/reducer.tsx",
    "PickerLocation/hook.tsx",
    "PickerLocation/LocationSheet.tsx",
    "PickerLocation/state.tsx",
    "PickerLocation/type.d.ts",
    "ModalLogger.tsx",
    "ModalWebView.tsx",
    "PadlockStoreSearch/index.tsx",
    "PadlockStoreSearch/action.tsx",
    "PadlockStoreSearch/reducer.tsx",
    "PadlockStoreSearch/components/index.tsx",
    "PadlockStoreSearch/components/SearchStoreSkeleton.tsx",
    "PadlockStoreSearch/components/ListSearchStore.tsx",
    "PadlockStoreSearch/state.tsx",
    "PadlockStoreSearch/type.d.ts",
    "PadlockStoreSearch/PadlockStoreSearch.tsx",
    "html/html.html",
    "TermsOfUse.tsx",
    "BaseIcon.tsx",
    "ScreenWrapper.tsx",
    "Version.tsx"
]

home_files = [
    "index.tsx",
    "state.ts",
    "FeatureManagement/index.tsx",
    "HomePage/index.tsx",
    "helper.ts",
    "EditFilter/index.tsx",
    "SearchFeature/index.tsx",
    "action.ts",
    "components/index.tsx",
    "components/CategoryList.tsx",
    "components/CategorySheet.tsx",
    "components/new-tag.json",
    "components/FloatingBotButton.tsx",
    "components/MenuItem.tsx",
    "components/FavoriteFeature.tsx",
    "components/CategoryItem.tsx",
    "components/HomeSkeleton.tsx",
    "components/WifiAlert.tsx",
    "components/EsgNewsBanner.tsx",
    "components/TimeKeeping.tsx",
    "reducer.ts",
    "type.d.ts"
]

component_template = """import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const {name} = () => {
  return (
    <View style={styles.container}>
      <Text>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default {name};
"""

def create_files(base_dir, files):
    for f in files:
        full_path = os.path.join(base_dir, f)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        name = os.path.basename(f).split('.')[0]
        if name == 'index':
            name = os.path.basename(os.path.dirname(full_path)) or 'Index'
        
        # Format name to be a valid React component name (PascalCase)
        name = ''.join(word.capitalize() for word in name.replace('-', '_').split('_'))

        if f.endswith('.tsx') or (f.endswith('.ts') and f.startswith('components/')):
            content = component_template.replace('{name}', name)
        elif f.endswith('.json'):
            content = "{}"
        else:
            content = "export {};\n"
            
        with open(full_path, 'w') as out_f:
            out_f.write(content)

create_files('src/components', components_files)
create_files('src/container/Home', home_files)

print("Files created successfully.")

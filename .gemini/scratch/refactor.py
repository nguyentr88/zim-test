import os
import shutil

base_dir = '/Users/trnguyenh8/Documents/work/React Native/Zim'
src_dir = os.path.join(base_dir, 'src')

# 1. Rename hooks -> hook, constants -> constant
if os.path.exists(os.path.join(base_dir, 'hooks')):
    os.rename(os.path.join(base_dir, 'hooks'), os.path.join(base_dir, 'hook'))
if os.path.exists(os.path.join(base_dir, 'constants')):
    os.rename(os.path.join(base_dir, 'constants'), os.path.join(base_dir, 'constant'))

# 2. Move folders from src to root
folders_to_move = ['container', 'redux', 'context', 'navigation']
for f in folders_to_move:
    src_f = os.path.join(src_dir, f)
    dst_f = os.path.join(base_dir, f)
    if os.path.exists(src_f):
        if os.path.exists(dst_f):
            shutil.rmtree(dst_f)
        shutil.move(src_f, dst_f)

# Merge constant and hook from src to root if they have content
for f in ['hook', 'constant']:
    src_f = os.path.join(src_dir, f, 'index.ts')
    dst_f = os.path.join(base_dir, f, 'index.ts')
    if os.path.exists(src_f):
        if not os.path.exists(dst_f):
            shutil.move(src_f, dst_f)

# 3. Handle hooks naming and contents
hook_dir = os.path.join(base_dir, 'hook')
if os.path.exists(hook_dir):
    hook_files = os.listdir(hook_dir)
    for hf in hook_files:
        if 'use-color-scheme.ts' in hf:
            os.rename(os.path.join(hook_dir, hf), os.path.join(hook_dir, 'useColorScheme.ts'))
        elif 'use-color-scheme.web.ts' in hf:
            os.rename(os.path.join(hook_dir, hf), os.path.join(hook_dir, 'useColorScheme.web.ts'))
        elif 'use-theme-color.ts' in hf:
            os.rename(os.path.join(hook_dir, hf), os.path.join(hook_dir, 'useThemeColor.ts'))

    # Read and modify useThemeColor.ts
    use_theme_color_path = os.path.join(hook_dir, 'useThemeColor.ts')
    if os.path.exists(use_theme_color_path):
        with open(use_theme_color_path, 'r') as file:
            content = file.read()
        content = content.replace('@/constants/theme', '@/constant/theme')
        content = content.replace('@/hooks/use-color-scheme', '@/hook/useColorScheme')
        with open(use_theme_color_path, 'w') as file:
            file.write(content)

# 4. Handle components
comp_dir = os.path.join(base_dir, 'components')

# rename themed-view to ThemeView
if os.path.exists(os.path.join(comp_dir, 'themed-view.tsx')):
    os.rename(os.path.join(comp_dir, 'themed-view.tsx'), os.path.join(comp_dir, 'ThemeView.tsx'))
    
if os.path.exists(os.path.join(comp_dir, 'ThemeView.tsx')):
    with open(os.path.join(comp_dir, 'ThemeView.tsx'), 'r') as file:
        content = file.read()
    content = content.replace('@/hooks/use-theme-color', '@/hook/useThemeColor')
    content = content.replace('ThemedView', 'ThemeView')
    with open(os.path.join(comp_dir, 'ThemeView.tsx'), 'w') as file:
        file.write(content)

# rename themed-text to ThemeText
if os.path.exists(os.path.join(comp_dir, 'themed-text.tsx')):
    os.rename(os.path.join(comp_dir, 'themed-text.tsx'), os.path.join(comp_dir, 'ThemeText.tsx'))

if os.path.exists(os.path.join(comp_dir, 'ThemeText.tsx')):
    with open(os.path.join(comp_dir, 'ThemeText.tsx'), 'r') as file:
        content = file.read()
    content = content.replace('@/hooks/use-theme-color', '@/hook/useThemeColor')
    content = content.replace('ThemedText', 'ThemeText')
    with open(os.path.join(comp_dir, 'ThemeText.tsx'), 'w') as file:
        file.write(content)

# delete old expo components
for old in ['external-link.tsx', 'haptic-tab.tsx', 'hello-wave.tsx', 'parallax-scroll-view.tsx']:
    path = os.path.join(comp_dir, old)
    if os.path.exists(path):
        os.remove(path)

if os.path.exists(os.path.join(comp_dir, 'ui')):
    shutil.rmtree(os.path.join(comp_dir, 'ui'))

# Move ScreenWrapper.tsx
if os.path.exists(os.path.join(src_dir, 'components', 'ScreenWrapper.tsx')):
    shutil.move(os.path.join(src_dir, 'components', 'ScreenWrapper.tsx'), os.path.join(comp_dir, 'ScreenWrapper.tsx'))

if os.path.exists(os.path.join(src_dir, 'components', 'index.tsx')):
    shutil.move(os.path.join(src_dir, 'components', 'index.tsx'), os.path.join(comp_dir, 'index.tsx'))

# Re-write components/index.tsx to export the remaining components
with open(os.path.join(comp_dir, 'index.tsx'), 'w') as f:
    f.write('''export { default as ScreenWrapper } from './ScreenWrapper';
export * from './ThemeView';
export * from './ThemeText';
''')

# Delete src dir
if os.path.exists(src_dir):
    shutil.rmtree(src_dir)

print('Refactor successful')

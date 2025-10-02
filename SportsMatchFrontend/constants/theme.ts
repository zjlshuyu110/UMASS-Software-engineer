/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform, StyleSheet } from 'react-native';

const tintColorLight = '#8c1c1c';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Typescale = StyleSheet.create({
  displayL: {
    fontSize: 64,
    fontWeight: 400
  },
  displayM: {
    fontSize: 48,
    fontWeight: 400
  },
  displayS: {
    fontSize: 40,
    fontWeight: 400
  },
  headlineL: {
    fontSize: 32,
    fontWeight: 400
  },
  headlineM: {
    fontSize: 28,
    fontWeight: 400
  },
  headlineS: {
    fontSize: 24,
    fontWeight: 400
  },
  titleL: {
    fontSize: 20,
    fontWeight: 400
  },
  titleM: {
    fontSize: 16,
    fontWeight: 500
  },
  titleS: {
    fontSize: 14,
    fontWeight: 500
  },
  bodyL: {
    fontSize: 16,
    fontWeight: 400
  },
  bodyM: {
    fontSize: 14,
    fontWeight: 400
  },
  bodyS: {
    fontSize: 12,
    fontWeight: 400
  },
  labelL: {
    fontSize: 14,
    fontWeight: 500
  },
  labelM: {
    fontSize: 12,
    fontWeight: 500
  },
  labelS: {
    fontSize: 10,
    fontWeight: 500
  },
})

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

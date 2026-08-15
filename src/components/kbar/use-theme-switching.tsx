import { useRegisterActions } from 'kbar';
import { useMemo } from 'react';
import { useTheme } from 'next-themes';
import { useThemeConfig } from '@/components/themes/active-theme';
import { THEMES } from '@/components/themes/theme.config';

const useThemeSwitching = () => {
  const { theme, setTheme } = useTheme();
  const { activeTheme, setActiveTheme } = useThemeConfig();

  const themeActions = useMemo(
    () => [
      {
        id: 'cycleTheme',
        name: 'Switch Theme',
        shortcut: ['t', 't'],
        section: 'Theme',
        perform: () => {
          const currentIndex = THEMES.findIndex((item) => item.value === activeTheme);
          const nextIndex = (currentIndex + 1) % THEMES.length;
          setActiveTheme(THEMES[nextIndex].value);
        }
      },
      {
        id: 'toggleDarkLight',
        name: 'Toggle Dark/Light Mode',
        shortcut: ['d', 'm'],
        section: 'Theme',
        perform: () => setTheme(theme === 'light' ? 'dark' : 'light')
      },
      {
        id: 'setLightTheme',
        name: 'Set Light Theme',
        section: 'Theme',
        perform: () => setTheme('light')
      },
      {
        id: 'setDarkTheme',
        name: 'Set Dark Theme',
        section: 'Theme',
        perform: () => setTheme('dark')
      }
    ],
    [activeTheme, setActiveTheme, setTheme, theme]
  );

  useRegisterActions(themeActions, [themeActions]);
};

export default useThemeSwitching;

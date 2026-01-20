import React from 'react'
import { DefaultTheme, ThemeProvider as RNThemeProvider } from 'styled-components'

type Props = {
  children?: React.ReactNode
  theme?: DefaultTheme
}

const defaultTheme: DefaultTheme = {
  borderRadius: 8,

  error: { background: '#FFE5E6', text: '#FA262A' },
  success: { background: '#E5F9E5', text: '#00A86B' },

  colors: {
    primary: '#007AFF',
    black: '#000000',
    white: '#ffffff',
    gray: '#A1A1A1',
    background: '#FDFDFD',
    backgroundSecondary: '#f8f8f8',
    border: '#D1D1D6', // Border, Ruller, Divider
    link: '#007AFF'
  },

  text: {
    textMuted: '#A1A1A1'
  },

  textinputs: {
    primary: {
      placeholder: {
        color: '#8D8D8D'
      }
    },
    secondary: {
      background: '#ffffff'
    },
    border: '#94A0AB',
    label: '#000000',
    background: '#EBEBEB',
    disabled: { background: '#EBEBEB' }
  },

  buttons: {
    primary: {
      background: '#007AFF',
      border: 'transparent',
      label: '#FFFFFF'
    },
    secondary: {
      background: '#E5E5E5',
      border: 'transparent',
      label: '#000000'
    },
    tertiary: {
      background: 'transparent',
      border: '#007AFF',
      label: '#007AFF'
    },
    danger: {
      background: '#FFE5E6',
      border: 'transparent',
      label: '#FFFFFF'
    },
    dangerSecondary: {
      background: '#E5E5E5',
      border: 'transparent',
      label: '#FF4647'
    },

    label: {
      primary: '#FFFFFF',
      secondary: '#007AFF',
      tertiary: '#000000',
      danger: '#ffffff',
      dangerSecondary: '#FF4647'
    }
  }
}

const ThemeProvider = ({ children, theme }: Props) => {
  return <RNThemeProvider theme={theme || defaultTheme}>{children}</RNThemeProvider>
}

export { DefaultTheme, ThemeProvider }

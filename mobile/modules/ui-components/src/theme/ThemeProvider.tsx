import React from 'react'
import { DefaultTheme, ThemeProvider as RNThemeProvider } from 'styled-components'

type Props = {
  children?: React.ReactNode
}

const ThemeProvider = ({ children }: Props) => {
  const theme: DefaultTheme = {
    borderRadius: 20,

    error: { background: '#FFE5E6', text: '#FA262A' },
    success: { background: '#E5F9E5', text: '#00A86B' },

    colors: {
      primary: '#4690FF',

      black: '#000000',
      white: '#ffffff',

      gray: '#A1A1A1'
    },

    textinputs: {
      primary: {
        placeholder: {
          color: '#000000'
        },
        background: '#4690FF'
      },
      secondary: {
        background: '#ffffff'
      }
    },

    buttons: {
      primary: '#000000',
      secondary: '#E5E5E5',
      tertiary: '#4c8ae7',
      danger: '#FF4647',

      label: {
        primary: '#ffffff',
        secondary: '#000000',
        tertiary: '#000000',
        danger: '#ffffff'
      }
    }
  }

  return <RNThemeProvider theme={theme}>{children}</RNThemeProvider>
}

export { DefaultTheme, ThemeProvider }

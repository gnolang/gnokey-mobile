import 'styled-components/native'

declare module 'styled-components/native' {
  export interface DefaultTheme {
    borderRadius: number

    error: { background: string; text: string }
    success: { background: string; text: string }

    buttons: {
      primary: string
      secondary: string
      tertirary: string
      danger: string

      label: {
        primary: string
        secondary: string
        tertirary: string
        danger: string
      }
    }

    textinputs: {
      primary: {
        placeholder: {
          color: string
        }
      }
      secondary: {
        background: string
      }
      border: string
      label: string
      background: string
    }

    colors: {
      primary: string

      black: string
      white: string

      gray: string

      background: string // container background color, used for the main app background
      backgroundSecondary: string // Secondary background color, used for surfaces like cards, panels, etc.

      border: string // Border, Ruller, Divider

      link: string // Link color, used for links in text, buttons, etc.
    }

    text: {
      textMuted: string // Muted text, hint text
    }
  }
}

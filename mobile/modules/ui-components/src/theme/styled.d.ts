import 'styled-components/native'

declare module 'styled-components/native' {
	export interface DefaultTheme {
		borderRadius: number

		error: { background: string; text: string }

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
			background: string
			placeholder: {
				color: string
			}
		}

		colors: {
			primary: string

			black: string
			white: string

      gray: string
		}
	}
}

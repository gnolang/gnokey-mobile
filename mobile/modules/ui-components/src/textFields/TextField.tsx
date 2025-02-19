import React from 'react'
import { TextInputProps } from 'react-native'
import styled, { DefaultTheme } from 'styled-components/native'
import { FontAwesome } from '@expo/vector-icons'

export type Props = {
	type?: 'password' | 'text'
} & TextInputProps

type PropsWithTheme = Props & { theme: DefaultTheme }

export const TextField: React.FC<Props> = ({ type = 'text', ...rest }) => {
	const [isSecureText, setShowSecureText] = React.useState(type === 'password')

	return (
		<Container>
			<TextFieldStyled {...rest} secureTextEntry={isSecureText} />
			{type === 'password' ? (
				<ToggleIcon>
					<FontAwesome size={28} name={isSecureText ? 'eye-slash' : 'eye'} onPress={() => setShowSecureText(prev => !prev)} />
				</ToggleIcon>
			) : null}
		</Container>
	)
}

const Container = styled.View<Props>`
	flex-direction: row;
	align-items: center;
	padding: 2px;
	border-color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.black};
	border-width: 1px;
	border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius-12}px;
	color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.black};
	background-color: ${({ theme }: { theme: DefaultTheme }) => theme.textinputs?.background};
`

const TextFieldStyled = styled.TextInput.attrs((props: PropsWithTheme) => ({
	placeholderTextColor: props.theme.textinputs?.placeholder.color || props.theme.colors.black,
}))`
	flex: 1;
	height: 40px;
	width: 100%;
	font-weight: 500;
	line-height: 20px;
	font-size: 18px;
	padding-horizontal: 16px;
	placeholder: ${({ theme }: { theme: DefaultTheme }) => theme.colors.black};
	border-style: solid;
`

const ToggleIcon = styled.TouchableOpacity`
	color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.black};
	padding: 2px;
`

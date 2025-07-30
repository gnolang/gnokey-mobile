import React, { forwardRef, useEffect } from 'react'
import { TextInputProps, TextInput } from 'react-native'
import styled, { DefaultTheme } from 'styled-components/native'
import { FontAwesome } from '@expo/vector-icons'
import { ErrorBox } from '../alert'
import { Text } from '..'

export type Props = {
  label?: string
  description?: string
  type?: 'password' | 'text'
  error?: string
  color?: 'secondary'
  hideError?: boolean
} & TextInputProps

type PropsWithTheme = Props & { theme: DefaultTheme }

export const TextField = forwardRef<TextInput, Props>((props, ref) => {
  const { type = 'text', label, description, error, value, hideError = true, ...rest } = props
  const [isSecureText, setShowSecureText] = React.useState(type === 'password')
  const [inputValue, setInputValue] = React.useState<string | undefined>(value)

  const handleChangeText = (text: string) => {
    setInputValue(text)
    if (rest.onChangeText) {
      rest.onChangeText(text)
    }
  }

  useEffect(() => {
    setInputValue(value)
  }, [value])

  return (
    <>
      <Container>
        {label && <Label>{label}</Label>}
        {description && <Description>{description}</Description>}
        <Content {...rest}>
          <TextFieldStyled
            ref={ref}
            {...rest}
            value={inputValue}
            secureTextEntry={isSecureText}
            onChangeText={handleChangeText}
          />
          {type === 'password' ? (
            <ToggleIcon>
              <FontAwesome
                size={28}
                name={isSecureText ? 'eye-slash' : 'eye'}
                color={rest.editable === false ? '#b0b0b0' : '#b0b0b0'}
                onPress={() => setShowSecureText((prev) => !prev)}
              />
            </ToggleIcon>
          ) : null}
        </Content>
      </Container>
      {hideError ? null : <ErrorBox>{error}</ErrorBox>}
    </>
  )
})

TextField.displayName = 'TextField'

const Container = styled.View`
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding-bottom: 2px;
`
export const Label = styled(Text.Body_Bold)`
  color: ${(props) => props.theme.textinputs.label};
`
export const Description = styled.Text`
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: -0.24px;
  padding-bottom: 12px;
  padding-top: 4px;
  color: ${(props) => props.theme.text.textMuted};
`
const Content = styled.View<PropsWithTheme>`
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
  padding: 0 8px;
  color: ${(p) => p.theme.colors.black};
  background-color: ${(p) => (p.editable === false ? '#f0f0f0' : p.theme.textinputs.background)};
`

const TextFieldStyled = styled.TextInput.attrs((props: PropsWithTheme) => ({
  placeholderTextColor: props.theme.textinputs.primary.placeholder.color || props.theme.textinputs.primary.placeholder.color
}))`
  flex: 1;
  height: 46px;
  width: 100%;
  font-weight: 500;
  line-height: 20px;
  font-size: 18px;
  placeholder: ${(p) => p.theme.textinputs.label};
  border-style: solid;
`

const ToggleIcon = styled.TouchableOpacity`
  color: ${(p) => p.theme.text.textMuted};
  padding: 2px;
`

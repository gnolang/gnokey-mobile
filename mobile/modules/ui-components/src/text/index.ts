import { TextProps } from 'react-native'
import styled from 'styled-components/native'
import { ButtonColor } from '../../index'

export const H1 = styled.Text`
  font-weight: 400;
  font-size: 64px;
  line-height: 64px;
  letter-spacing: -0.32px;
  color: ${(props) => props.theme.colors.black};
`

export const H2 = styled.Text`
  font-weight: 400;
  font-size: 32px;
  letter-spacing: -0.32px;
  color: ${(props) => props.theme.colors.black};
`

export const H3 = styled.Text`
  font-weight: 400;
  font-size: 22px;
  letter-spacing: -0.32px;
  color: ${(props) => props.theme.colors.black};
`

export const Body = styled.Text<TextProps>`
  font-weight: 400;
  font-size: 16px;
  color: ${(props) => props.theme.colors.black};
`

export const Body5 = styled.Text<TextProps>`
  font-size: 18px;
  line-height: 25px;
  color: ${(props) => props.theme.colors.black};
`

export const Body6 = styled.Text<TextProps>`
  font-size: 15px;
  line-height: 21px;
  color: ${(props) => props.theme.colors.black};
`

export const Caption = styled.Text<TextProps>`
  font-weight: 400;
  font-size: 12px;
  letter-spacing: 0.8px;
  color: ${(props) => props.theme.colors.black};
`

export const ButtonLabel = styled.Text<{ $color?: ButtonColor }>`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.32px;
  color: ${(props) => (props.$color ? props.theme.buttons.label[props.$color] : props.theme.buttons.label.primary)};
`

export const ButtonLabelBlack = styled(ButtonLabel)`
  color: ${(props) => props.theme.colors.black};
`

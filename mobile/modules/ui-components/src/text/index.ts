import { TextProps } from 'react-native'
import styled from 'styled-components/native'
import { ButtonColor } from '../../index'

export const H1 = styled.Text`
  font-weight: 700;
  font-size: 40px;
  line-height: 48px;
  letter-spacing: 0.41px;
  color: ${(props) => props.theme.colors.black};
`

export const H2 = styled.Text`
  font-weight: 700;
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

export const H4 = styled.Text`
  font-weight: 700;
  font-size: 20px;
  line-height: 25px;
  letter-spacing: 0.38px;
  color: ${(props) => props.theme.text.textMuted};
`

export const H4_Regular = styled.Text`
  font-weight: 400;
  font-size: 20px;
  line-height: 25px;
  letter-spacing: 0.38px;
  color: ${(props) => props.theme.text.textMuted};
`

export const Body = styled.Text<TextProps>`
  font-size: 15px;
  color: ${(props) => props.theme.colors.black};
`

export const Caption = styled.Text<TextProps>`
  font-weight: 400;
  font-size: 13px;
  line-height: 25px;
  letter-spacing: 0.38px;
  color: ${(props) => props.theme.text.textMuted};
`

export const Link = styled.Text<TextProps>`
  font-weight: 400;
  font-size: 12px;
  letter-spacing: 0.8px;
  color: ${(props) => props.theme.colors.primary};
`

export const ButtonLabel = styled.Text<{ $color?: ButtonColor }>`
  font-weight: 400;
  font-size: 17px;
  line-height: 22px;
  letter-spacing: -0.41px;
  color: ${(props) => (props.$color ? props.theme.buttons.label[props.$color] : props.theme.buttons.label.primary)};
`

export const ButtonLabelBlack = styled(ButtonLabel)`
  color: ${(props) => props.theme.colors.black};
`

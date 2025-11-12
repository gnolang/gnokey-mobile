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

// export const Body = styled.Text<TextProps>`
//   font-size: 15px;
//   color: ${(props) => props.theme.colors.black};
// `

export const Caption = styled.Text<TextProps>`
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;
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
  font-weight: 600;
  font-size: 17px;
  line-height: 22px;
  letter-spacing: -0.41px;
  align-self: center;
  text-align: center;
  color: ${(props) => (props.$color ? props.theme.buttons[props.$color].label : props.theme.buttons.primary.label)};
`

export const ButtonLabelBlack = styled(ButtonLabel)`
  color: ${(props) => props.theme.colors.black};
`
// -------------------------------------------------

interface BaseTextProps {
  color?: string
  weight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
}

// Base text component with iOS system font
const BaseText = styled.Text<BaseTextProps>`
  font-family: 'SF Pro Text';
  color: ${(props) => props.color || '#000000'};
  include-font-padding: false;
  text-align-vertical: center;
`

// iOS Typography Scale Components

// Large Titles
export const LargeTitle = styled(BaseText)<BaseTextProps>`
  font-size: 34px;
  font-weight: ${(props) => props.weight || '700'};
  line-height: 41px;
  letter-spacing: 0.37px;
`

// Titles
export const Title1 = styled(BaseText)`
  font-size: 28px;
  font-weight: ${(props) => props.weight || '700'};
  line-height: 34px;
  letter-spacing: 0.36px;
`

export const Title2 = styled(BaseText)`
  font-size: 22px;
  font-weight: ${(props) => props.weight || '700'};
  line-height: 28px;
  letter-spacing: 0.35px;
`

export const Title3 = styled(BaseText)`
  font-size: 20px;
  font-weight: ${(props) => props.weight || '600'};
  line-height: 25px;
  letter-spacing: 0.38px;
`

export const Title3_Muted = styled(Title3)`
  color: ${(props) => props.theme.text.textMuted};
  font-weight: 400;
`

// Headlines
export const Headline = styled(BaseText)`
  font-size: 17px;
  font-weight: ${(props) => props.weight || '600'};
  line-height: 22px;
  letter-spacing: -0.41px;
`

// Body Text
export const Body = styled(BaseText)`
  font-size: 17px;
  font-weight: ${(props) => props.weight || '400'};
  line-height: 22px;
`

export const Callout = styled(BaseText)`
  font-size: 16px;
  font-weight: ${(props) => props.weight || '400'};
  line-height: 21px;
  letter-spacing: -0.32px;
`

export const Subheadline = styled(BaseText)`
  font-size: 15px;
  font-weight: ${(props) => props.weight || '400'};
  line-height: 20px;
  letter-spacing: -0.24px;
`

export const SubheadlineSemiBold = styled(Subheadline)`
  font-weight: ${(props) => props.weight || '600'};
`

export const SubheadlineMuted = styled(Subheadline)`
  color: ${(props) => props.theme.text.textMuted};
`

export const Footnote = styled(BaseText)`
  font-size: 13px;
  font-weight: ${(props) => props.weight || '400'};
  line-height: 18px;
  letter-spacing: -0.08px;
`

export const Caption1 = styled(BaseText)`
  font-size: 12px;
  font-weight: ${(props) => props.weight || '400'};
  line-height: 16px;
  letter-spacing: 0px;
`

export const Caption2 = styled(BaseText)`
  font-size: 11px;
  font-weight: ${(props) => props.weight || '400'};
  line-height: 13px;
  letter-spacing: 0.07px;
`

// iOS Color Variants
export const Label = styled(BaseText)`
  font-size: 17px;
  font-weight: ${(props) => props.weight || '400'};
  line-height: 22px;
  letter-spacing: -0.41px;
  color: ${(props) => props.color || '#000000'};
`

export const SecondaryLabel = styled(Label)`
  color: ${(props) => props.color || '#3C3C43'};
  opacity: 0.6;
`

export const TertiaryLabel = styled(Label)`
  color: ${(props) => props.color || '#3C3C43'};
  opacity: 0.3;
`

export const QuaternaryLabel = styled(Label)`
  color: ${(props) => props.color || '#3C3C43'};
  opacity: 0.18;
`

// Semantic Text Components
export const ErrorText = styled(Footnote)`
  color: #ff3b30;
`

export const SuccessText = styled(Footnote)`
  color: #34c759;
`

export const WarningText = styled(Footnote)`
  color: #ff9500;
`

export const LinkHeader = styled(Headline)`
  color: #007aff;
  font-weight: 400;
`

export const LinkText = styled(Body)`
  color: #007aff;
`

export const LinkTextMutedSmall = styled(Footnote)`
  color: ${({ theme }) => theme.text.textMuted};
`

export const PlaceholderText = styled(Body)`
  color: #3c3c43;
  opacity: 0.3;
`

// Color system
export const colors = {
  // iOS System Colors
  label: '#000000',
  secondaryLabel: 'rgba(60, 60, 67, 0.6)',
  tertiaryLabel: 'rgba(60, 60, 67, 0.3)',
  quaternaryLabel: 'rgba(60, 60, 67, 0.18)',

  // Semantic Colors
  systemRed: '#FF3B30',
  systemOrange: '#FF9500',
  systemYellow: '#FFCC00',
  systemGreen: '#34C759',
  systemMint: '#00C7BE',
  systemTeal: '#30B0C7',
  systemCyan: '#32D2FF',
  systemBlue: '#007AFF',
  systemIndigo: '#5856D6',
  systemPurple: '#AF52DE',
  systemPink: '#FF2D92',
  systemBrown: '#A2845E',
  systemGray: '#8E8E93',

  // Background Colors
  systemBackground: '#FFFFFF',
  secondarySystemBackground: '#F2F2F7',
  tertiarySystemBackground: '#FFFFFF'
}

// Weight variants for any component
export const weights: Record<
  'ultraLight' | 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy' | 'black',
  '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
> = {
  ultraLight: '100',
  thin: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
  black: '900'
}

// -----------------------------------------------------------------------------
export const Body_Bold = styled(Body)`
  font-weight: ${weights.bold};
`
export const BodyCenterGray = styled(Body)`
  text-align: center;
  color: ${({ theme }) => theme.text.textMuted};
`

export const Json = styled(LinkText)`
  weight: 500;
  flex-shrink: 1;
  text-align: right;
`

export const Title3CenterGray = styled(Title3)`
  text-align: center;
  color: ${({ theme }) => theme.text.textMuted};
`

export const CalloutMutedBold = styled(Callout)`
  color: ${(props) => props.theme.text.textMuted};
  font-weight: ${weights.bold};
`

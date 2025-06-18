import { StatusBar, Platform, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

interface SafeAreaViewProps {
  children: React.ReactNode
  style?: ViewStyle | ViewStyle[]
}

const StyledSafeArea = styled.SafeAreaView<{ customStyle?: ViewStyle | ViewStyle[] }>`
  flex: 1;
  padding-top: ${Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 50 : 0}px;
`

export const SafeAreaView = ({ children, style }: SafeAreaViewProps) => <StyledSafeArea style={style}>{children}</StyledSafeArea>

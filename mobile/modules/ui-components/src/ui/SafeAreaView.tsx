import { StatusBar, Platform, ViewStyle } from 'react-native'
import styled from 'styled-components/native'
import { SafeAreaView as SafeAreaViewNative } from 'react-native-safe-area-context'

interface SafeAreaViewProps {
  children: React.ReactNode
  style?: ViewStyle | ViewStyle[]
}

const StyledSafeArea = styled(SafeAreaViewNative)<{ customStyle?: ViewStyle | ViewStyle[] }>`
  flex: 1;
  padding-top: ${Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 50 : 0}px;
`

export const SafeAreaView = ({ children, style }: SafeAreaViewProps) => <StyledSafeArea style={style}>{children}</StyledSafeArea>

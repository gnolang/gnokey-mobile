import { View, ViewProps } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

const ModalView = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border-top-end-radius: 16px;
  border-top-start-radius: 16px;
  padding: 14px;
  padding-top: 0px;
  shadow-color: #000;
  shadow-opacity: 0.25;
  elevation: 5;
  shadow-offset: 0px 2px;
  shadow-radius: 4px;
`

const ModalContent: React.FC<ViewProps> = (props: ViewProps) => {
  const theme = useTheme()
  return (
    <View
      style={{
        height: '25%',
        width: '100%',
        backgroundColor: theme.colors.background,
        borderTopRightRadius: 18,
        borderTopLeftRadius: 18,
        position: 'absolute',
        bottom: 0
      }}
    >
      <ModalView>{props.children}</ModalView>
    </View>
  )
}

export default ModalContent

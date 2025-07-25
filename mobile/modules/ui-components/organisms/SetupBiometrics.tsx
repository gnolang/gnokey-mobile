import { Spacer, Text } from '../src'
import { LocalSvg } from 'react-native-svg/css'
import styled from 'styled-components/native'

export const SetupBiometrics = () => {
  return (
    <Content>
      <LocalSvg
        width={98}
        height={98}
        style={{
          alignSelf: 'center'
        }}
        asset={require('../../../assets/images/biometrics.svg')}
      />
      <Spacer space={24} />
      <Text.H4 style={{ color: 'black', padding: 8, textAlign: 'center' }}>Secure your account access</Text.H4>
      <Text.H4_Regular style={{ textAlign: 'center' }}>
        Enable password and Face ID to secure access to your accounts. This is highly recommended
      </Text.H4_Regular>
    </Content>
  )
}

const Content = styled.View`
  flex: 1;
  padding: 16px;
  align-items: center;
  justify-content: center;
`

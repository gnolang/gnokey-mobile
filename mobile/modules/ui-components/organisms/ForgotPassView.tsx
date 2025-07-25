import styled from 'styled-components/native'
import { Text } from '../src'

export const ForgotPassView = () => {
  return (
    <Container>
      <Title>Important</Title>
      <Text.H4_Regular>
        {`There is no way to recover your lost or forgotten GKM password. You can only reset the GKM wallet and that will remove all accounts you created or imported.

You will lose access to those accounts - and all of their assets.`}
      </Text.H4_Regular>
    </Container>
  )
}

const Title = styled(Text.H4)`
  color: ${(props) => props.theme.colors.black};
  padding-bottom: 4px;
`
const Container = styled.View`
  align-items: flex-start;
  justify-content: center;
`

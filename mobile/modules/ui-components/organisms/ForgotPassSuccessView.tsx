import styled from 'styled-components/native'
import { Text } from '../src'

export const ForgotPassSuccessView = () => {
  return (
    <Container>
      <Title>Your account is now erased</Title>
      <Text.H4_Regular>
        {`All the account data have been removed and are now impossible to retrieve. Please create a new account.`}
      </Text.H4_Regular>
    </Container>
  )
}

const Title = styled(Text.H1)`
  color: ${(props) => props.theme.colors.black};
  padding-bottom: 16px;
`
const Container = styled.View`
  flex: 1;
  align-items: flex-start;
  justify-content: center;
`

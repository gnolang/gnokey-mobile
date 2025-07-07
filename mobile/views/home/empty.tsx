import { Container, Spacer, Text } from '@/modules/ui-components'
import styled from 'styled-components/native'

export const EmptyView = () => {
  return (
    <Container>
      <CenteredView>
        <Text.H1>Create your first account</Text.H1>
        <Spacer />
        <Text.Body>
          As a new user, your first step is to create a new gno session account in the app to securely store your data.
        </Text.Body>
      </CenteredView>
    </Container>
  )
}

const CenteredView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 4px;
  text-align: center;
`

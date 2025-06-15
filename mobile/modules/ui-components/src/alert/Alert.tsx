import styled from 'styled-components/native'
import { Spacer } from '../layout'

export interface Props {
  message?: string
  severity: 'error' | 'warning' | 'info' | 'success'
}

const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 4px;
`

const InnerContent = styled.View<{ severity: Props['severity'] }>`
  flex-direction: row;
  align-items: center;
  border-radius: 16px;
  padding-left: 12px;
  padding-right: 12px;
  background-color: ${({ severity, theme }) => {
    switch (severity) {
      case 'error':
        return theme.error.background
      case 'warning':
        return theme.colors.primary
      case 'info':
        return theme.colors.primary
      case 'success':
        return theme.success.background
    }
  }};
`

const ErrorText = styled.Text<{ paddingLeft: boolean }>`
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0;
  padding-left: ${(props) => (props.paddingLeft ? '5.5px' : '4.5px')};
  text-align: center;
`

const Alert = ({ message, severity }: Props) => {
  const isError = severity === 'error'

  // theme is available for children if needed

  return (
    <Wrapper>
      {message ? (
        <InnerContent severity={severity}>
          <ErrorText paddingLeft={Boolean(isError)}>{message}</ErrorText>
        </InnerContent>
      ) : (
        <Spacer space={40} />
      )}
    </Wrapper>
  )
}

export { Alert }

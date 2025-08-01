import styled from 'styled-components/native'

export const OpaqueBackgroundView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`

export const ModalHeaderOvalIcon = styled.View`
  width: 40px;
  height: 5px;
  border-radius: 2px;
  background-color: ${(props) => props.theme.textinputs.background};
`

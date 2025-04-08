import styled from 'styled-components/native'
import { DefaultTheme } from 'styled-components/native'

export const BottonPanel = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
  padding-top: 20px;
  padding-bottom: 50px;
  min-height: 120px;
  border-top-right-radius: ${(props) => props.theme.borderRadius * 2 || 40}px;
  border-top-left-radius: ${(props) => props.theme.borderRadius * 2 || 40}px;
  background-color: ${({ theme }) => theme.colors.white};
`

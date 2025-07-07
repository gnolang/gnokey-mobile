import styled from 'styled-components/native'

export const BottonPanel = styled.View`
  position: absolute;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
  bottom: 0;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 28px;
  padding-top: 18px;
  min-height: 90px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`

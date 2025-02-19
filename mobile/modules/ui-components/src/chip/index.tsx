import styled, { DefaultTheme } from 'styled-components/native';

export const Chip = styled.View`
  height: 22px;
  text-align: center;
  justify-content: center;
  background-color: #E5E5E5;
  border-radius:  ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius + 'px'};
  padding: 0px 12px;
`;

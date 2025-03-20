import React from "react";
import { StyleProp, TextStyle } from "react-native";
import styled, { DefaultTheme } from "styled-components/native";

type Props = {
  label: string;
  labelStyle?: StyleProp<TextStyle> | undefined;
} & React.ComponentProps<typeof Container>;

export const FormItem: React.FC<Props> = ({ children, label, labelStyle, ...props }) => {
  return (
    <Container {...props}>
      <FormItemLabel style={labelStyle} >{label}:</FormItemLabel>
      {children}
    </Container>
  );
}

const Container = styled.View`
    flex-direction: row;
    align-items: flex-start;
    border-radius: ${({ theme }) => theme.borderRadius - 12}px;
    color: ${({ theme }) => theme.colors.black};
    background-color: ${({ theme }) => theme.textinputs.primary.background};
`

const FormItemLabel = styled.Text`
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.black};
  font-size: 18px;
  letter-spacing: 0.5px;
  font-weight: 500;
  margin-bottom: 8px;
`

export const FormTextValue = styled.Text`
  color: ${({ theme }) => theme.colors.white};
  font-size: 18px;
  letter-spacing: 0.5px;
  font-weight: 500;
  margin-bottom: 8px;
`

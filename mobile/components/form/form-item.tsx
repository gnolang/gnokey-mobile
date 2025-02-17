import React from 'react';
import { ViewProps } from 'react-native';
import styled from 'styled-components/native';
import Spacer from '../spacer';
import { Text } from '@/modules/ui-components';

type Prop = ViewProps & {
  label: string;
  labelColor?: string;
};

const FormItem: React.FC<Prop> = ({ children, label, style, labelColor = 'gray' }) => {
  return (
    <Wrapper>
      <Spacer />
      <Spacer />
      <TextLabel>{label}</TextLabel>
      <Spacer />
      {children}
    </Wrapper>
  );
};

const TextLabel = styled(Text.Body)`
  color: ${({ theme }) => theme.colors.white};
`;

const Wrapper = styled.View`
  min-height: 40px;
`

export default FormItem;

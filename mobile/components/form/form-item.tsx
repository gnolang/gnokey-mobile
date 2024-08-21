import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Text from '../text';

type Prop = ViewProps & {
  label: string;
  labelColor?: string;
};

const FormItem: React.FC<Prop> = ({ children, label, style = initialStyle.view, labelColor = 'gray' }) => {
  return (
    <View style={style}>
      <Text.InputLabel style={{ color: labelColor, ...initialStyle.label }}>{label}</Text.InputLabel>
      {children}
    </View>
  );
};

const initialStyle = StyleSheet.create({
  view: {
    width: '100%',
  },
  label: {
    marginBottom: 8,
  },
});

export default FormItem;

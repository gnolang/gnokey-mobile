import React from "react";
import { TextInput as RNTextInput, TextInputProps, ViewProps } from "react-native";
import styled from "styled-components/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface Props extends TextInputProps {
  error?: boolean | string | undefined;
  containerStyle?: ViewProps["style"];
}

export const TextInput = React.forwardRef<RNTextInput, Props>((props, ref) => {
  const { children, ...rest } = props;
  const [isSecureText, setShowSecureText] = React.useState(props.secureTextEntry);

  return (
    <Container style={props.containerStyle}>
      {children ? <LeftChildren>{children}</LeftChildren> : null}
      <TextInputBase autoCapitalize="none" autoCorrect={false} {...rest} ref={ref} secureTextEntry={isSecureText} />

      {rest.secureTextEntry ? (
        <ToggleIcon>
          <FontAwesome size={28} name={isSecureText ? "eye-slash" : "eye"} onPress={() => setShowSecureText((prev) => !prev)} />
        </ToggleIcon>
      ) : null}
    </Container>
  );
});

const Container = styled.View<Props>`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${(props) => (props.error ? "red" : "black")};
  border-radius: 4px;
  padding: 2px;
  margin: 10px 0;
`;

const TextInputBase = styled.TextInput.attrs<Props>({
  multiline: false,
})`
  flex: 1;
  padding: 8px;
  font-size: 16px;
  color: ${(props) => (props.editable === false ? "gray" : "black")};
  height: 48px;
  border-width: 0;
`;

const ToggleIcon = styled.TouchableOpacity`
  padding: 2px;
`;

const LeftChildren = styled.View`
  padding: 8px;
`;

export default TextInput;

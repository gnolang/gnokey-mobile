import Alert from "@gno/components/alert";
import Button from "@gno/components/button";
import Spacer from "@gno/components/spacer";
import TextInput from "@gno/components/textinput";
import { useRef, useState } from "react";
import { TextInput as RNTextInput } from "react-native";

export interface Props {
  onUnlokPress: (password: string) => void;
  error?: string;
}

const SignInView: React.FC<Props> = ({ onUnlokPress, error }) => {

  const inputRef = useRef<RNTextInput>(null);
  const [password, setPassword] = useState("");

  return (
    <>
      <TextInput
        ref={inputRef}
        placeholder={`Master password`}
        error={error}
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <Alert severity="error" message={error} />
      <Spacer space={8} />
      <Button.TouchableOpacity title="Unlock" onPress={() => onUnlokPress(password)} variant="primary" />
    </>
  );
}

export default SignInView;

import Alert from "@gno/components/alert";
import Button from "@gno/components/button";
import Spacer from "@gno/components/spacer";
import TextInput from "@gno/components/textinput";
import { useState } from "react";

export interface Props {
  onCreateMasterPress: (password: string) => void;
  error?: string;
}

const SignUpView: React.FC<Props> = ({ onCreateMasterPress, error }) => {

  const [innerError, setInnerError] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onCreate = () => {
    if (!password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      setInnerError("Passwords do not match.");
      return;
    }

    onCreateMasterPress(password);
  }

  return (
    <>
      <TextInput placeholder="Master password" value={password} onChangeText={setPassword} secureTextEntry={true} />
      <TextInput
        placeholder="Confirm Master password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
        error={error || innerError}
      />
      <Alert severity="error" message={error || innerError} />
      <Spacer space={8} />
      <Button.TouchableOpacity title="Create Master password" onPress={onCreate} variant="primary" />
    </>
  );
}

export default SignUpView;

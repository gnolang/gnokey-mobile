import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  TextInput as RNTextInput,
} from "react-native";
import Alert from "@/components/alert";
import { ModalView } from "@/components/modal";
import Text from "@/components/text";
import Spacer from "@/components/spacer";
import TextInput from "@/components/textinput";
import Button from "@/components/button";
import { selectMasterPassword, useAppSelector, useAppDispatch, changeMasterPassword } from "@/redux";

export type Props = {
  visible: boolean;
  onClose: (sucess: boolean) => void;
};

const ChangeMasterPassword = ({ visible, onClose }: Props) => {
  const [loadingMasterPassword, setLoadingMasterPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

  const masterPassword = useAppSelector(selectMasterPassword)
  const dispatch = useAppDispatch();

  const inputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [visible]);

  const onConfirm = async () => {
    if (!password) return;

    if (password !== reenterPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!masterPassword) {
      setError("Master password not found.");
      return;
    }

    if (currentPassword !== masterPassword) {
      setError("Current password is incorrect.");
      return;
    }

    try {
      setLoadingMasterPassword(true);
      await dispatch(changeMasterPassword({ newPassword: password, masterPassword })).unwrap()
      onClose(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoadingMasterPassword(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ height: "100%" }}>
          <ModalView.Content>
            <ModalView.Header title="Change master password" onClose={() => onClose(false)} />
            <Text.BodyMedium>Please, enter the new password:</Text.BodyMedium>
            <Spacer />
            <TextInput
              ref={inputRef}
              placeholder={`Current password`}
              error={error}
              secureTextEntry={true}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              placeholder={`New password`}
              error={error}
              secureTextEntry={true}
              onChangeText={setPassword}
            />
            <TextInput
              placeholder={`Reenter password`}
              error={error}
              secureTextEntry={true}
              onChangeText={setReenterPassword}
            />
            <Alert severity="error" message={error} />
            <Button.TouchableOpacity title="Confirm" onPress={onConfirm} variant="primary" loading={loadingMasterPassword} />
            <Spacer />
          </ModalView.Content>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ChangeMasterPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around",
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
});

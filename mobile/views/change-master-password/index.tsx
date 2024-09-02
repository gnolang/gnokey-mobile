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
import { GRPCError } from "@gnolang/gnonative/src/grpc/error";
import { ErrCode } from "@buf/gnolang_gnonative.bufbuild_es/rpc_pb";
import Alert from "@/components/alert";
import { useGnoNativeContext } from "@gnolang/gnonative";
import { ModalView } from "@/components/modal";
import Text from "@/components/text";
import Spacer from "@/components/spacer";
import TextInput from "@/components/textinput";
import Button from "@/components/button";

export type Props = {
  visible: boolean;
  onClose: (sucess: boolean) => void;
};

const ChangeMasterPassword = ({ visible, onClose }: Props) => {
  const { gnonative } = useGnoNativeContext();
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);

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

    try {
      setError(undefined);
      await gnonative.updatePassword(password);
      onClose(true);
    } catch (error: any) {
      console.error(error);
      const err = new GRPCError(error);
      if (err.errCode() === ErrCode.ErrDecryptionFailed) {
        setError("Wrong password, please try again.");
      } else {
        setError(JSON.stringify(error));
      }
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
            <Button.TouchableOpacity title="Confirm" onPress={onConfirm} variant="primary" />
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

import { Modal as NativeModal } from "react-native";
import ModalHeader from "./ModalHeader";
import ModalContent from "./ModalContent";
import Button from "components/button";
import Ruller from "components/row/Ruller";
import Spacer from "components/spacer";
import Text from "components/text";

export type Props = {
  title: string;
  confirmText?: string;
  message: string;
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const ModalConfirm = ({ visible, onCancel, onConfirm, title, message, confirmText = "Confirm" }: Props) => {
  return (
    <NativeModal visible={visible} transparent={true} animationType="slide">
      <ModalContent >
        <ModalHeader title={title} onClose={onCancel} />
        <Text.BodyMedium>{message}</Text.BodyMedium>
        <Spacer />
        <Button.TouchableOpacity title={confirmText} onPress={onConfirm} variant="primary-red" />
        <Ruller />
        <Button.TouchableOpacity title="Cancel" onPress={onCancel} variant="secondary" />
        <Spacer space={16} />
      </ModalContent>
    </NativeModal>
  );
};

export default ModalConfirm;

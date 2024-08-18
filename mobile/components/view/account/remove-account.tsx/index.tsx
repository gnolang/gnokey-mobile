import { Layout } from "@/components/index";
import ModalHeader from "@/components/layout/modal-header";
import Text from "@/components/text";
import { Following, User } from "@/types";
import { selectAccount, useAppSelector } from "@/redux";
import Button from "@/components/button";
import Spacer from "@/components/spacer";

interface Props {
  data: Following[];
  onConfirm: (account: User) => void;
}

function RemoveAccountContent({ data, onConfirm }: Props) {
  const account = useAppSelector(selectAccount);

  if (!account) {
    return null;
  }

  return (
    <Layout.Container>
      <ModalHeader>
        <Text.Title>Remove Account</Text.Title>
      </ModalHeader>
      <Layout.Body>
        <Text.Body>Do you want to remove the account {account.name} from your list?</Text.Body>
        <Spacer space={32} />
        <Button.TouchableOpacity title={`Remove ${account.name}`} onPress={() => onConfirm(account)} variant="primary-red" />
      </Layout.Body>
    </Layout.Container>
  );
}

export default RemoveAccountContent;

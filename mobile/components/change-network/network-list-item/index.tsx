import styled, { useTheme } from 'styled-components/native';
import { colors } from '@/assets';
import { NetworkMetainfo } from '@/types';
import Icons from '@/components/icons';
import * as Text from '../../../modules/ui-components/src/text';
import { View } from 'react-native';

export interface Props {
  disabled?: boolean;
  currentRemote: string | undefined;
  networkMetainfo: NetworkMetainfo;
  onPress: (item: NetworkMetainfo) => void;
}

const NetworkListItem: React.FC<Props> = ({ networkMetainfo, currentRemote, onPress, disabled }: Props) => {

  const theme = useTheme()

  return (
    <Row disabled={disabled} onPress={() => disabled ? null : onPress(networkMetainfo)}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text.H3>{networkMetainfo.chainName}</Text.H3>
        <RightItens>{currentRemote && networkMetainfo.gnoAddress.includes(currentRemote) && <InUse />}</RightItens>
      </View>
      <LeftItens>
        <Text.Caption style={{ color: theme.colors.gray }}>Address: {networkMetainfo.gnoAddress}</Text.Caption>
        <Text.Caption style={{ color: theme.colors.gray }}>Faucet:   {networkMetainfo.faucetAddress}</Text.Caption>
      </LeftItens>
    </Row>
  )
}

const InUse = () => (
  <>
    <Icons.CheckMark color={colors.white} />
    <Text.Caption style={{ paddingLeft: 8 }}>in use</Text.Caption>
  </>
);

const Row = styled.TouchableOpacity<{ disabled?: boolean; }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: auto;
  transition: 0.2s;
  margin: 8px 0;
`;

const LeftItens = styled.View`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const RightItens = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export default NetworkListItem;

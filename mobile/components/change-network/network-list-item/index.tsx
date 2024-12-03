import styled from 'styled-components/native';
import { colors } from '@/assets';
import { NetworkMetainfo } from '@/types';
import Text from '@/components/text';
import Icons from '@/components/icons';

export interface Props {
  currentRemote: string | undefined;
  networkMetainfo: NetworkMetainfo;
  onPress: (item: NetworkMetainfo) => void;
}

const NetworkListItem: React.FC<Props> = ({ networkMetainfo, currentRemote, onPress }: Props) => (
  <Row style={{ margin: 4 }} onPress={() => onPress(networkMetainfo)}>
    <LeftItens>
      <Text.BodyMedium style={{ color: colors.white }}>{networkMetainfo.chainName}</Text.BodyMedium>
      <Text.Caption1 style={{ color: colors.white }}>Address: {networkMetainfo.gnoAddress}</Text.Caption1>
      <Text.Caption1 style={{ color: colors.white }}>Faucet:   {networkMetainfo.faucetAddress}</Text.Caption1>
    </LeftItens>
    <RightItens>{currentRemote && networkMetainfo.gnoAddress.includes(currentRemote) && <InUse />}</RightItens>
  </Row>
);

const InUse = () => (
  <>
    <Icons.CheckMark color={colors.white} />
    <Text.Caption1 style={{ paddingLeft: 8, color: colors.white }}>in use</Text.Caption1>
  </>
);

const Row = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${colors.button.primary};
  height: auto;
  padding: 9px 16px;
  border-radius: 18px;
  transition: 0.2s;
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

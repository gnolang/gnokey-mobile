import { FlatList } from 'react-native';
import NetworkListItem from '../network-list-item';
import { Text } from '@/components';
import { NetworkMetainfo } from '@/types';

interface Props {
  currentRemote: string | undefined;
  networkMetainfos: NetworkMetainfo[];
  onNetworkChange: (networkMetainfo: NetworkMetainfo) => void;
}

const NetworkList: React.FC<Props> = ({ currentRemote, networkMetainfos = [], onNetworkChange }: Props) => {
  if (networkMetainfos.length === 0) {
    return <Text.Body>No network found.</Text.Body>;
  }

  return (
    <FlatList
      data={networkMetainfos}
      renderItem={({ item }) => <NetworkListItem
        key={item.chainName}
        networkMetainfo={item}
        currentRemote={currentRemote}
        onPress={(x) => onNetworkChange(x)}
      />}
    />
  );
};

export default NetworkList;

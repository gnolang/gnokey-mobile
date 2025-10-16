import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Button, ListTemplate, ScreenHeader, Ruller, Form, NetworkItem } from '@/modules/ui-components'
import { deleteChain, selectChainsAvailable, useAppDispatch, useAppSelector } from '@/redux'
import { NetworkMetainfo } from '@/types'

const Page: React.FC = () => {
  const networks = useAppSelector(selectChainsAvailable)
  const dispatch = useAppDispatch()
  const route = useRouter()

  const handleEdit = async (network: NetworkMetainfo) => {
    route.push(`/home/network/edit/${network.id}`)
  }

  const handleDelete = (network: NetworkMetainfo) => {
    Alert.alert('Delete Network', `Are you sure you want to delete the network "${network.chainName}"?`, [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          console.log('Network deleted:', network.id)
          await dispatch(deleteChain(network.id))
        }
      }
    ])
  }

  const renderNetworkItem = ({ item, index }: { item: NetworkMetainfo; index: number }) => {
    return (
      <>
        {index === 0 && <Ruller />}
        <NetworkItem network={item} onEdit={handleEdit} onDelete={handleDelete} />
      </>
    )
  }

  const keyExtractor = (item: any) => item.id

  return (
    <ListTemplate<NetworkMetainfo>
      header={<ScreenHeader title="Settings" />}
      subHeader={<Form.Section title="Network List" />}
      footer={<Button onPress={() => route.push('/home/network/new')}>&nbsp;Add Network&nbsp;</Button>} // &nbsp; is a hack for Android to not cut the button label
      data={networks || []}
      renderItem={renderNetworkItem}
      keyExtractor={keyExtractor}
    />
  )
}

export default Page

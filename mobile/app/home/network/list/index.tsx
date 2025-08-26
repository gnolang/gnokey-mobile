import { Button, ListTemplate, ScreenHeader } from '@/modules/ui-components'
import { Ruller } from '@/modules/ui-components/atoms'
import { Form } from '@/modules/ui-components/molecules'
import { NetworkItem } from '@/modules/ui-components/organisms/NetworkItem'
import { deleteChain, selectChainsAvailable, useAppDispatch, useAppSelector } from '@/redux'
import { NetworkMetainfo } from '@/types'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'

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
    const isFirst = index === 0
    const isLast = networks && index === networks.length - 1

    return (
      <>
        {isFirst && <Ruller />}
        <NetworkItem network={item} onEdit={handleEdit} onDelete={handleDelete} />
        {isLast && <Ruller />}
      </>
    )
  }

  const keyExtractor = (item: any) => item.id

  return (
    <>
      <ListTemplate<NetworkMetainfo>
        header={<ScreenHeader title="Settings" />}
        subHeader={
          <Form.Section
            title="Network List"
            // rightActions={<HeaderActionLink>Delete All</HeaderActionLink>}
          />
        }
        footer={
          <>
            <Button onPress={() => route.push('/home/network/new')}>Add Network</Button>
          </>
        }
        data={networks || []}
        renderItem={renderNetworkItem}
        keyExtractor={keyExtractor}
      />
    </>
  )
}

export default Page

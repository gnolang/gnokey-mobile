import { ListTemplate, ScreenHeader } from '@/modules/ui-components'
import { Ruller } from '@/modules/ui-components/atoms'
import { Form } from '@/modules/ui-components/molecules'
import { NetworkItem } from '@/modules/ui-components/organisms/NetworkItem'
import { selectChainsAvailable, useAppSelector } from '@/redux'
import { NetworkMetainfo } from '@/types'

const Page: React.FC = () => {
  const networks = useAppSelector(selectChainsAvailable)

  const handleEdit = (network: NetworkMetainfo) => {
    // Handle edit action
    console.log('Edit network with ID:', network.id)
  }

  const handleDelete = (network: NetworkMetainfo) => {
    // Handle delete action
    console.log('Delete network with ID:', network.id)
  }

  const renderNetworkItem = ({ item, index }: { item: NetworkMetainfo; index: number }) => {
    const isFirst = index === 0
    const isLast = networks && index === networks.length - 1

    return (
      <>
        {isFirst && <Ruller />}
        <NetworkItem network={item} onEdit={handleEdit} onDelete={handleDelete} showSwipeActions={true} />
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
        data={networks || []}
        renderItem={renderNetworkItem}
        keyExtractor={keyExtractor}
      />
    </>
  )
}

export default Page

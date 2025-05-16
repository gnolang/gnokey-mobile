import { Text } from '..'
import { ItemString } from './items/ItemString'
import { ItemNumeric } from './items/ItemNumeric'
import { ParamDoc } from '@/modules/smart-contracts/base'

interface Props {
  type?: 'string' | 'numeric' | string
  paramDoc: ParamDoc
}
export const DynamicItem = (props: Props) => {
  const { paramDoc } = props

  switch (paramDoc.type) {
    case 'string':
      return <ItemString paramDoc={paramDoc} />
    case 'numeric':
      return <ItemNumeric />
    default:
      return (
        <>
          <ItemString paramDoc={paramDoc} />
        </>
      )
  }
}

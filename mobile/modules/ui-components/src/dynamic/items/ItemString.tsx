import { ParamDoc } from '@/modules/smart-contracts/base'
import { TextField } from '../..'

interface Props {
  paramDoc: ParamDoc
}

export const ItemString = ({ paramDoc }: Props) => {
  return <TextField placeholder={paramDoc.name} label={paramDoc.name} />
}

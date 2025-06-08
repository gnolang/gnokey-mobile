import styled, { useTheme } from 'styled-components/native'
import Icons from '@/components/icons'
import * as Text from '../../../modules/ui-components/src/text'
import { View } from 'react-native'

export interface Props {
  disabled?: boolean
  title: string
  address?: string
  faucet?: string
  inUse?: boolean
  onPress: () => void
}

const NetworkListItem: React.FC<Props> = ({ title, address, faucet, inUse, onPress, disabled }: Props) => {
  const theme = useTheme()

  return (
    <Row disabled={disabled} onPress={() => (disabled ? null : onPress())}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text.H3>{title}</Text.H3>
        <RightItens>{inUse && <InUse />}</RightItens>
      </View>
      <LeftItens>
        {address && <Text.Caption style={{ color: theme.colors.gray }}>Address: {address}</Text.Caption>}
        {faucet && <Text.Caption style={{ color: theme.colors.gray }}>Faucet: {faucet}</Text.Caption>}
      </LeftItens>
    </Row>
  )
}

const InUse = () => (
  <>
    <Icons.CheckMark color="red" />
    <Text.Caption style={{ paddingLeft: 8 }}>in use</Text.Caption>
  </>
)

const Row = styled.TouchableOpacity<{ disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: auto;
  transition: 0.2s;
  margin: 8px 0;
`

const LeftItens = styled.View`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const RightItens = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export default NetworkListItem

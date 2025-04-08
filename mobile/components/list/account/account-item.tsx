import Button from '@/components/button'
import { Spacer } from '@/modules/ui-components'
import { KeyInfo } from '@gnolang/gnonative'

interface SideMenuAccountItemProps {
  account: KeyInfo
  changeAccount: (account: KeyInfo) => void
}

const SideMenuAccountItem = (props: SideMenuAccountItemProps) => {
  const { account, changeAccount } = props
  return (
    <>
      <Spacer />
      <Button.TouchableOpacity title={account.name} onPress={() => changeAccount(account)} variant="primary" />
    </>
  )
}

export default SideMenuAccountItem

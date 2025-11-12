import { Button, Spacer } from '@/modules/gnonative-ui/dist'
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
      <Button onPress={() => changeAccount(account)} color="primary">
        {account.name}
      </Button>
    </>
  )
}

export default SideMenuAccountItem

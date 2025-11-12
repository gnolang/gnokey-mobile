import { Text } from '@berty/gnonative-ui'

export type MenuItemProps = {
  value: any
  children: React.ReactNode
}

export const MenuItem = (props: MenuItemProps) => {
  return <Text.H3>{props.children}</Text.H3>
}

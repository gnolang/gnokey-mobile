import * as Text from '../../modules/ui-components/src/text'

export type MenuItemProps = {
  value: any
  children: React.ReactNode
}

export const MenuItem = (props: MenuItemProps) => {
  return <Text.H3>{props.children}</Text.H3>
}

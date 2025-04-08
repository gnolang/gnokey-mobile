import React from 'react'
import { IsToggleProps, MenuItemProps, OnToggleProps } from '../interfaces'
import { MenuItemPriv } from '../MenuItem.priv'
import { TextPriv } from '../Text.priv'
import { Toggle } from '@/components/controls/toggle/Toggle'

export const MenuToggle: React.FC<MenuItemProps & OnToggleProps & IsToggleProps> = (props) => {
  return (
    <MenuItemPriv onPress={props.onPress} testID={props.testID}>
      <TextPriv>{props.children}</TextPriv>
      <Toggle checked={props.isToggleOn ?? false} onChange={props.onToggle ? props.onToggle : props.onPress} />
    </MenuItemPriv>
  )
}

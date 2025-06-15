import React from 'react'
import { IconWithTextPriv } from '../IconWithText.priv'
import { OnToggleProps, PackProps, ToggleMenuItemWithIconProps } from '../interfaces'
import { MenuItemPriv } from '../MenuItem.priv'
import { Toggle } from '@/components/controls/toggle/Toggle'

export const MenuToggleWithIconPriv: React.FC<ToggleMenuItemWithIconProps & OnToggleProps & PackProps> = (props) => {
  return (
    <MenuItemPriv onPress={props.onPress} testID={props.testID}>
      <IconWithTextPriv iconName={props.iconName} pack={props.pack} color="red">
        {props.children}
      </IconWithTextPriv>
      <Toggle checked={props.isToggleOn ?? false} onChange={props.onToggle ? props.onToggle : props.onPress} />
    </MenuItemPriv>
  )
}

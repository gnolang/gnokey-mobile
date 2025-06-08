import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React from 'react'
import { useTheme } from 'styled-components/native'

import { IconWithTextPriv } from '../IconWithText.priv'
import { MenuItemWithIconProps, PackProps } from '../interfaces'
import { MenuItemPriv } from '../MenuItem.priv'

export const MenuItemWithIconPriv: React.FC<MenuItemWithIconProps & PackProps & { color?: string }> = (props) => {
  const theme = useTheme()
  return (
    <MenuItemPriv onPress={props.onPress} testID={props.testID}>
      <IconWithTextPriv iconName={props.iconName} pack={props.pack} color={props.color ?? theme.colors.background}>
        {props.children}
      </IconWithTextPriv>
      {!props.noRightArrow && <MaterialIcons name="arrow-forward-ios" size={20} color={theme.colors.gray} />}
    </MenuItemPriv>
  )
}

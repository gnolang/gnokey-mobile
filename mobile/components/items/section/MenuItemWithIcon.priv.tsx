import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react'

import { colors } from '@/assets'

import { IconWithTextPriv } from '../IconWithText.priv'
import { MenuItemWithIconProps, PackProps } from '../interfaces'
import { MenuItemPriv } from '../MenuItem.priv'

export const MenuItemWithIconPriv: React.FC<
	MenuItemWithIconProps & PackProps & { color?: string }
> = props => {

	return (
		<MenuItemPriv onPress={props.onPress} testID={props.testID}>
			<IconWithTextPriv
				iconName={props.iconName}
				pack={props.pack}
				color={props.color ?? colors['background-header']}
			>
				{props.children}
			</IconWithTextPriv>
			{!props.noRightArrow && (
				<MaterialIcons name="arrow-forward-ios" size={20} color="#393C63" />
			)}
		</MenuItemPriv>
	)
}

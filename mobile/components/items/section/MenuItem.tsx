import React from 'react'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { MenuItemProps } from '../interfaces'
import { MenuItemPriv } from '../MenuItem.priv'
import { TextPriv } from '../Text.priv'

export const MenuItem: React.FC<MenuItemProps> = props => {
	return (
		<MenuItemPriv onPress={props.onPress} testID={props.testID}>
			<TextPriv>{props.children}</TextPriv>
			<MaterialIcons name="arrow-forward-ios" size={20} color="#393C63" />
		</MenuItemPriv>
	)
}

import React from 'react'
import { StyleSheet, View } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { TextPriv } from './Text.priv'

interface IconWithTextPrivProps {
	iconName: string
	pack?: string
	color?: string
	children: React.ReactNode
}

export const IconWithTextPriv: React.FC<IconWithTextPrivProps> = props => {
	return (
		<View style={styles.row}>
			<MaterialIcons
				name={props.iconName.toString() as any}
				pack={props.pack}
				width={20}
				height={20}
				fill={props.color ?? '#393C63'}
			/>
			<TextPriv>{props.children}</TextPriv>
		</View>
	)
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
	},
})

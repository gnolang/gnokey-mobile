import React, { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'
import { UnifiedText } from '@/components'

export const TextPriv: React.FC<PropsWithChildren> = props => {

	return (
		<View style={styles.container}>
			<UnifiedText numberOfLines={1} style={{ marginLeft: 8 }}>
				{props.children}
			</UnifiedText>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexShrink: 1,
	},
})

import React from 'react'
import { Text, TextProps } from 'react-native'
import { colors } from '@/assets'

export const UnifiedText: React.FC<TextProps> = props => {
	const { children, style } = props
	return (
		<Text
			{...props}
			style={[{ fontSize: 14, fontFamily: 'Open Sans', color: colors.text.primary }, style]}>
			{children}
		</Text>
	)
}

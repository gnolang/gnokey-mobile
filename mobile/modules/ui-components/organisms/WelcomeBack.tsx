import React from 'react'
import { SlideDescription, SlideImage, SlideItem, SlideTitle, Container } from '../atoms/WelcomeSlide'
import { useWindowDimensions } from 'react-native'

const image = require('../../../assets/images/icon.png')

export function WelcomeBack() {
  const { width } = useWindowDimensions()
  return (
    <Container>
      <SlideItem width={width + 'px'}>
        <SlideImage source={image} resizeMode="contain" />
        <SlideTitle>Welcome back</SlideTitle>
        <SlideDescription>Enter your password to unlock GnoKey Mobile</SlideDescription>
      </SlideItem>
    </Container>
  )
}

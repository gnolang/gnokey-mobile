import React from 'react'
import { SlideImage } from '../atoms/WelcomeSlide'
import HeroBox from '../molecules/HeroBox'

const image = require('../../../assets/images/icon.png')

export function WelcomeBack() {
  return (
    <HeroBox
      img={<SlideImage source={image} resizeMode="contain" />}
      title="Welcome back"
      description="Enter your password to unlock GnoKey Mobile"
    />
  )
}

import React, { useRef, useState } from 'react'
import { FlatList, useWindowDimensions } from 'react-native'
import { BoxToScroll, ContainerCenter, Dot, DotContainer, SlideImage } from './WelcomeSlide'
import { HeroBox } from './hero'
import { Spacer } from '@berty/gnonative-ui'

const slides = [
  {
    title: 'GnoKey Mobile',
    description: 'Welcome to GnoKey Mobile, the secure and user-friendly app for managing your Gno accounts.',
    image: require('@/assets/images/icon.png') // TODO: Replace with real asset
  },
  {
    title: 'Multi-Chain',
    description: 'Easily manage multiple Gno chains and switch between them seamlessly within the app.',
    image: require('@/assets/images/icon.png') // TODO: Replace with real asset
  },
  {
    title: 'Secure Vaults',
    description: 'Protect your sensitive information with secure vaults for each of your Gno accounts.',
    image: require('@/assets/images/icon.png') // TODO: Replace with real asset
  }
  // TODO: Add more slides if needed
]

export function OnboardingCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)
  const { width } = useWindowDimensions()

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index)
    }
  }).current

  return (
    <ContainerCenter>
      <FlatList
        style={{ width }}
        data={slides}
        ref={flatListRef}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <BoxToScroll width={width + 'px'}>
            <HeroBox
              img={<SlideImage source={item.image} resizeMode="contain" />}
              title={item.title}
              description={item.description}
            />
          </BoxToScroll>
        )}
      />
      <DotContainer>
        {slides.map((_, i) => (
          <Dot key={i} active={i === currentIndex} />
        ))}
      </DotContainer>
      <Spacer space={48} />
    </ContainerCenter>
  )
}

import { Stack } from 'expo-router'
import { Button, OnboardingLayout } from '@/modules/ui-components'
import ScreenHeader from '@/modules/ui-components/organisms/ScreenHeader'
import { SetupPassForm } from '@/modules/ui-components/organisms/SetupPassForm'
import styled from 'styled-components/native'
import { useState } from 'react'

export default function Page() {
  const [onPasswordsCompleted, setOnPasswordsCompleted] = useState<string | undefined>(undefined)
  return (
    <OnboardingLayout>
      <Stack.Screen
        options={{
          header: (props) => <ScreenHeader {...props} title="GKM Account" subtitle="1/2" />
        }}
      />
      <SetupPassForm onPasswordsCompleted={(pass) => setOnPasswordsCompleted(pass)} />
      <Footer>
        <Button disabled={!onPasswordsCompleted}>Confirm password</Button>
      </Footer>
    </OnboardingLayout>
  )
}

const Footer = styled.View`
  flex: 1;
  justify-content: flex-end;
`

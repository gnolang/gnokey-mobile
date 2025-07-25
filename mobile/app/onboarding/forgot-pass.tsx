import { useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import { Button, OnboardingLayout } from '@/modules/ui-components'
import ScreenHeader from '@/modules/ui-components/organisms/ScreenHeader'
import { ForgotPassView } from '@/modules/ui-components/organisms/ForgotPassView'
import { ModalConfirm } from '@/components/modal'
import { hardReset, selectLoadingReset, useAppDispatch, useAppSelector } from '@/redux'

export default function Page() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoadingReset)

  const onReset = async () => {
    await dispatch(hardReset()).unwrap()
    setShowModal(false)
    router.navigate('/onboarding/forgot-pass-success')
  }

  return (
    <OnboardingLayout footer={<Button onPress={() => setShowModal(true)}>Reset GnoKey Mobile</Button>}>
      <Stack.Screen
        options={{
          header: (props) => <ScreenHeader {...props} title="Forgot password" />
        }}
      />
      <ForgotPassView />
      <ModalConfirm
        visible={showModal}
        title="Reset GnoKey Mobile"
        confirmText="Reset"
        message="Are you sure you want to reset GKM. You'll not be able to recover the linked accounts after."
        onConfirm={onReset}
        loading={loading}
        onCancel={() => setShowModal(false)}
      />
    </OnboardingLayout>
  )
}

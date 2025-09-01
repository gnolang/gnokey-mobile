import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Button, HeroBoxInternal, HomeLayout, ScreenHeader } from '@/modules/ui-components'
import { ModalConfirm } from '@/components/modal'
import { hardReset, selectLoadingReset, useAppDispatch, useAppSelector } from '@/redux'
import { LeftTopContainer } from '@/modules/ui-components/atoms'

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
    <HomeLayout
      header={<ScreenHeader title="Forgot password" />}
      footer={<Button onPress={() => setShowModal(true)}>Reset GnoKey Mobile</Button>}
    >
      <LeftTopContainer>
        <HeroBoxInternal
          title="Forgot password"
          description={`There is no way to recover your lost or forgotten GKM password. You can only reset the GKM wallet and that will remove all accounts you created or imported.

You will lose access to those accounts - and all of their assets.`}
        />
      </LeftTopContainer>
      <ModalConfirm
        visible={showModal}
        title="Reset GnoKey Mobile"
        confirmText="Reset"
        message="Are you sure you want to reset GKM. You'll not be able to recover the linked accounts after."
        onConfirm={onReset}
        loading={loading}
        onCancel={() => setShowModal(false)}
      />
    </HomeLayout>
  )
}

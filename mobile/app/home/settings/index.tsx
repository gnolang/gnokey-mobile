import { ScrollView } from 'react-native'
import { ScreenHeader, ModalConfirm } from '@/components'
import { HomeLayout, Form, Spacer } from '@berty/gnonative-ui'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { signOut, useAppDispatch } from '@/redux'

export default function Page() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const onLogout = () => {
    dispatch(signOut())
  }

  return (
    <HomeLayout contentPadding={20} header={<ScreenHeader title="Settings" />}>
      <ScrollView>
        <Spacer space={16} />
        <Form.Section title="Manage the app">
          <Form.Link
            onPress={() => router.navigate('/home/network/list')}
            title="Networks list"
            description="Customize your Gno.land networks. Add new ones or tweak existing connections."
          />
          <Form.Link
            onPress={() => router.navigate('/home/settings/security-center')}
            title="Security center"
            description="Manage your security settings and keep your account safe."
          />
          <Form.Link
            onPress={() => router.navigate('/home/settings/developer-options')}
            title="Developers options"
            description="Access developer settings and tools."
          />
          <Form.Link onPress={() => setShowLogoutModal(true)} title="Logout" description="Log out of your Gno.land account." />
        </Form.Section>
        <Spacer />
      </ScrollView>
      <ModalConfirm
        visible={showLogoutModal}
        title="Logout"
        confirmText="Logout"
        message="Are you sure you want to log out?"
        onConfirm={onLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </HomeLayout>
  )
}

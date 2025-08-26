import { ScrollView } from 'react-native'
import { HomeLayout, ScreenHeader, Spacer } from '@/modules/ui-components'
import { Form } from '@/modules/ui-components/molecules'
import { useRouter } from 'expo-router'

export default function Page() {
  const router = useRouter()

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
          <Form.Link
            onPress={() => router.navigate('/home/(modal)/logout')}
            title="Logout"
            description="Log out of your Gno.land account."
          />
        </Form.Section>
        <Spacer />
      </ScrollView>
    </HomeLayout>
  )
}

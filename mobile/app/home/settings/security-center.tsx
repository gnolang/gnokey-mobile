import { HomeLayout, ScreenHeader, Spacer, Form } from '@/modules/ui-components'
import { useRouter } from 'expo-router'
import { ScrollView } from 'react-native-gesture-handler'

const Page: React.FC = () => {
  const router = useRouter()
  return (
    <HomeLayout contentPadding={20} header={<ScreenHeader title="Settings" />}>
      <ScrollView>
        <Spacer space={16} />
        <Form.Section title="Manage the app">
          <Form.Link
            onPress={() => router.navigate('/home/(modal)/change-master-pass')}
            title="Change master password"
            description="Update your master password to keep your account secure."
          />
        </Form.Section>
      </ScrollView>
    </HomeLayout>
  )
}

export default Page

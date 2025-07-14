import { TextField } from '@/modules/ui-components'

export default function Page() {
  return (
    <TextField
      type="password"
      label="Set Master Password"
      error="This is an error message"
      value=""
      hideError={false}
      editable={true}
      onChangeText={(text) => console.log(text)}
    />
  )
}

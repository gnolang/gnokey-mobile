import { Text } from "@/components"
import { Button, Spacer, TextField } from "@/modules/ui-components"
import { FontAwesome6 } from "@expo/vector-icons"
import React, { useEffect } from "react"
import { Modal, SafeAreaView, View } from "react-native"
import { useTheme } from "styled-components/native"
import { isEmpty, isInvalidURL } from "@/modules/validation"

export interface Form {
  chainName: string
  chainID: string
  chainURL: string
  faucetURL: string
}

export interface Props {
  visible: boolean
  onCancel: () => void
  onSaveChain: (form: any) => void
}

export const ChainAddModal = ({ visible, onCancel, onSaveChain }: Props) => {

  const initialForm: Form = {
    chainName: '',
    chainID: '',
    chainURL: '',
    faucetURL: '',
  }

  const [form, setForm] = React.useState<Form>(initialForm)
  const [errors, setErrors] = React.useState(initialForm)
  const [isInitial, setInitial] = React.useState(true)

  const theme = useTheme()

  useEffect(() => {
    if (isInitial) {
      setInitial(false)
      return
    }
    validateForm(form)
  }, [form])

  const validateForm = (form: any) => {
    let errors: Form = {
      chainName: '',
      chainID: '',
      chainURL: '',
      faucetURL: ''
    }

    errors.chainName = validate([
      { condition: () => isEmpty(form.chainName), message: 'Chain Name is required' },
    ])
    errors.chainID = validate([
      { condition: () => isEmpty(form.chainID), message: 'Chain ID is required' },
    ])
    errors.chainURL = validate([
      { condition: () => isEmpty(form.chainURL), message: 'Chain URL is required' },
      { condition: () => isInvalidURL(form.chainURL), message: 'Chain URL must be a validURL' },
    ])

    setErrors(errors)
  }

  const validate = (validations: { condition: () => boolean, message: string }[]) => {
    for (let validation of validations) {
      if (validation.condition()) {
        return validation.message;
      }
    }
    return '';
  }

  const onSave = () => {
    if (Object.values(errors).some((error) => error !== '')) {
      console.log('Errors', errors)
      return
    }
    onSaveChain(form)
  }

  return <Modal visible={visible} transparent>
    <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <SafeAreaView style={{ width: '94%', alignItems: "center" }}>
        <View style={{ width: '100%', backgroundColor: theme.colors.white, borderRadius: theme.borderRadius, padding: 20, alignItems: 'center' }}>

          <Text.Title style={{ color: theme.colors.primary }}>Create a Custom Chain</Text.Title>

          <Spacer />
          <TextField label="Chain Name" placeholder="Enter Chain Name"
            value={form.chainName}
            onChangeText={(text) => setForm({ ...form, chainName: text })}
            error={errors.chainName}
            color="secondary" />
          <TextField label="Chain ID" placeholder="Chain ID"
            value={form.chainID}
            onChangeText={(text) => setForm({ ...form, chainID: text })}
            error={errors.chainID}
            color="secondary" />
          <TextField label="Chain URL" placeholder="Chain URL"
            value={form.chainURL}
            onChangeText={(text) => setForm({ ...form, chainURL: text })}
            error={errors.chainURL}
            autoCapitalize="none"
            autoCorrect={false}
            color="secondary" />
          <TextField label="Faucet URL" placeholder="Faucet URL"
            value={form.faucetURL}
            onChangeText={(text) => setForm({ ...form, faucetURL: text })}
            error={errors.faucetURL}
            autoCapitalize="none"
            autoCorrect={false}
            color="secondary" />
          <Spacer />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }} >
            <Button color="secondary"
              onPress={onCancel}
              endIcon={<FontAwesome6 name='xmark' size={16} color='black' />}>Cancel</Button>
            <Button color="secondary"
              onPress={onSave}
              endIcon={<FontAwesome6 name='plus' size={16} color='black' />}>Add a Chain</Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  </Modal>
}

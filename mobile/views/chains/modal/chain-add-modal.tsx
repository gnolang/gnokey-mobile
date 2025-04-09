import { Text } from '@/components'
import { Button, Spacer, TextField } from '@/modules/ui-components'
import { FontAwesome6 } from '@expo/vector-icons'
import React, { useEffect } from 'react'
import { Modal, SafeAreaView, View } from 'react-native'
import { useTheme } from 'styled-components/native'
import { isEmpty, isInvalidURL } from '@/modules/validation'

export interface Form {
  chainName: string
  chainId: string
  gnoAddress: string
  faucetAddress: string
}

export interface Props {
  visible: boolean
  onCancel: () => void
  onSaveChain: (form: any) => void
}

export const ChainAddModal = ({ visible, onCancel, onSaveChain }: Props) => {
  const initialForm: Form = {
    chainName: '',
    chainId: '',
    gnoAddress: '',
    faucetAddress: ''
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form])

  const validateForm = (form: Form) => {
    let errors: Form = {
      chainName: '',
      chainId: '',
      gnoAddress: '',
      faucetAddress: ''
    }

    errors.chainName = validate([{ condition: () => isEmpty(form.chainName), message: 'Chain Name is required' }])
    errors.chainId = validate([{ condition: () => isEmpty(form.chainId), message: 'Chain ID is required' }])
    errors.gnoAddress = validate([
      { condition: () => isEmpty(form.gnoAddress), message: 'Chain URL is required' },
      { condition: () => isInvalidURL(form.gnoAddress), message: 'Chain URL must be a validURL' }
    ])

    setErrors(errors)
  }

  const validate = (validations: { condition: () => boolean; message: string }[]) => {
    for (let validation of validations) {
      if (validation.condition()) {
        return validation.message
      }
    }
    return ''
  }

  const onSave = () => {
    if (Object.values(errors).some((error) => error !== '')) {
      console.log('Errors', errors)
      return
    }
    onSaveChain(form)
  }

  return (
    <Modal visible={visible} transparent>
      <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <SafeAreaView style={{ width: '94%', alignItems: 'center' }}>
          <View
            style={{
              width: '100%',
              backgroundColor: theme.colors.white,
              borderRadius: theme.borderRadius,
              padding: 20,
              alignItems: 'center'
            }}
          >
            <Text.Title style={{ color: theme.colors.primary }}>Create a Custom Chain</Text.Title>

            <Spacer />
            <TextField
              label="Chain Name"
              placeholder="Enter Chain Name"
              value={form.chainName}
              onChangeText={(text) => setForm({ ...form, chainName: text })}
              error={errors.chainName}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect={false}
              color="secondary"
            />
            <TextField
              label="Chain ID"
              placeholder="Chain ID"
              value={form.chainId}
              onChangeText={(text) => setForm({ ...form, chainId: text })}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.chainId}
              color="secondary"
            />
            <TextField
              label="Chain URL"
              placeholder="Chain URL"
              value={form.gnoAddress}
              onChangeText={(text) => setForm({ ...form, gnoAddress: text })}
              error={errors.gnoAddress}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect={false}
              color="secondary"
            />
            <TextField
              label="Faucet URL"
              placeholder="Faucet URL"
              value={form.faucetAddress}
              onChangeText={(text) => setForm({ ...form, faucetAddress: text })}
              error={errors.faucetAddress}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect={false}
              color="secondary"
            />
            <Spacer />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <Button color="secondary" onPress={onCancel} endIcon={<FontAwesome6 name="xmark" size={16} color="black" />}>
                Cancel
              </Button>
              <Button color="secondary" onPress={onSave} endIcon={<FontAwesome6 name="plus" size={16} color="black" />}>
                Add a Chain
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  )
}

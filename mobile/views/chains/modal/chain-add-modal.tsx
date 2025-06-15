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
  rpcUrl: string
  faucetUrl: string
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
    rpcUrl: '',
    faucetUrl: ''
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
    setErrors(validateForm(form))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form])

  const validateForm = (form: Form) => {
    let errors: Form = {
      chainName: '',
      chainId: '',
      rpcUrl: '',
      faucetUrl: ''
    }

    errors.chainName = validate([{ condition: () => isEmpty(form.chainName), message: 'Chain Name is required' }])
    errors.chainId = validate([{ condition: () => isEmpty(form.chainId), message: 'Chain ID is required' }])
    errors.rpcUrl = validate([
      { condition: () => isEmpty(form.rpcUrl), message: 'Chain rpc URL is required' },
      { condition: () => isInvalidURL(form.rpcUrl), message: 'Chain rpc URL must be a validURL' }
    ])
    return errors
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
    const err = validateForm(form)
    if (Object.values(err).some((error) => error !== '')) {
      setErrors(err)
      console.log('Errors', err)
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
              value={form.rpcUrl}
              onChangeText={(text) => setForm({ ...form, rpcUrl: text })}
              error={errors.rpcUrl}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect={false}
              color="secondary"
            />
            <TextField
              label="Faucet URL"
              placeholder="Faucet URL"
              value={form.faucetUrl}
              onChangeText={(text) => setForm({ ...form, faucetUrl: text })}
              error={errors.faucetUrl}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect={false}
              color="secondary"
            />
            <Spacer />

            <View style={{ flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
              <Button color="secondary" onPress={onCancel} endIcon={<FontAwesome6 name="xmark" size={16} color="black" />}>
                Cancel
              </Button>
              <Spacer space={8} />
              <Button color="primary" onPress={onSave} endIcon={<FontAwesome6 name="plus" size={16} color="black" />}>
                Add a Chain
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  )
}

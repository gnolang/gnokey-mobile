import { Button, Spacer, TextField } from '@/modules/ui-components'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { isEmpty, isInvalidURL } from '@/modules/validation'
import { Ruller } from '@/components'

export interface Form {
  chainName: string
  chainId: string
  rpcUrl: string
  faucetUrl: string
}

export interface Props {
  onSaveChain: (form: Form) => void
  loading?: boolean
}

export const NetworkForm = ({ onSaveChain, loading }: Props) => {
  const initialForm: Form = {
    chainName: '',
    chainId: '',
    rpcUrl: '',
    faucetUrl: ''
  }

  const [form, setForm] = React.useState<Form>(initialForm)
  const [errors, setErrors] = React.useState(initialForm)
  const [isInitial, setInitial] = React.useState(true)

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
    <>
      <View style={{ flex: 1 }}>
        <TextField
          label="Label"
          placeholder="Enter the chain label"
          value={form.chainName}
          onChangeText={(text) => setForm({ ...form, chainName: text })}
          error={errors.chainName}
          hideError={false}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
          color="secondary"
        />
        <Ruller />
        <Spacer />
        <TextField
          label="Chain ID"
          placeholder="Chain ID"
          hideError={false}
          value={form.chainId}
          onChangeText={(text) => setForm({ ...form, chainId: text })}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
          error={errors.chainId}
          color="secondary"
        />
        <Ruller />
        <Spacer />
        <TextField
          label="RPC URL"
          placeholder="RPC URL"
          hideError={false}
          value={form.rpcUrl}
          onChangeText={(text) => setForm({ ...form, rpcUrl: text })}
          error={errors.rpcUrl}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
          color="secondary"
        />
        <Ruller />
        <Spacer />
        <TextField
          label="Faucet URL"
          placeholder="Faucet URL"
          hideError={false}
          value={form.faucetUrl}
          onChangeText={(text) => setForm({ ...form, faucetUrl: text })}
          error={errors.faucetUrl}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
          color="secondary"
        />
        <Ruller />
        <Spacer />
      </View>

      <Button color="primary" onPress={onSave} loading={loading} disabled={loading}>
        Save new Chain
      </Button>
    </>
  )
}

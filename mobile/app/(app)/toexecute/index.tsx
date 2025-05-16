import { Layout, Ruller } from '@/components'
import {
  useAppDispatch,
  useAppSelector,
  clearExecute,
  clearLinking,
  selectLoadingContract,
  selectFunc,
  selectDoc,
  selectExtimateGas,
  selectFuncDoc
} from '@/redux'
import { router } from 'expo-router'
import { useState } from 'react'
import { ScrollView, View, TouchableOpacity } from 'react-native'
import { Button, ButtonText, FormItem, FormItemInline, PrettyJSON, Spacer, Text } from '@/modules/ui-components'
import styled from 'styled-components/native'
import { Loading } from '@/components/loading'
import { DynamicItem } from '@/modules/ui-components/src/dynamic'

export default function Page() {
  const loading = useAppSelector(selectLoadingContract)
  const func = useAppSelector(selectFunc)
  const doc = useAppSelector(selectDoc)
  const estimateGas = useAppSelector(selectExtimateGas)
  const funcDoc = useAppSelector(selectFuncDoc)

  const dispatch = useAppDispatch()

  const onCancel = () => {
    dispatch(clearLinking())
    dispatch(clearExecute())
    router.replace('/home')
  }

  if (loading) {
    return <Loading message="Loading Smart Contract metadata. Please wait." />
  }

  if (!func) {
    return (
      <Layout.Container>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <ButtonText onPress={onCancel}>
            <Text.ButtonLabelBlack>Cancel</Text.ButtonLabelBlack>
          </ButtonText>
        </View>
        <Layout.Body>
          <Text.H3 style={{ textAlign: 'center', paddingHorizontal: 16 }}>
            No function found. Please check the URL and try again.
          </Text.H3>
        </Layout.Body>
      </Layout.Container>
    )
  }

  return (
    <>
      <Layout.Container>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <ButtonText onPress={onCancel}>
            <Text.ButtonLabelBlack>Cancel</Text.ButtonLabelBlack>
          </ButtonText>
        </View>
        <Layout.Body>
          <Text.H3 style={{ textAlign: 'center', paddingHorizontal: 16 }}>
            Gno.land is requiring permission to execute the <Text.H3 style={{ color: 'white' }}>{func}</Text.H3> function on
            chain.
          </Text.H3>

          <Spacer space={32} />

          <ScrollView contentContainerStyle={{}}>
            <Ruller />

            <FormItemInline label="Function">
              <TextBodyWhite>{func}</TextBodyWhite>
            </FormItemInline>

            <Ruller />

            <FormItemInline label="Estimate Gas">
              <TextBodyWhite>{String(estimateGas)}</TextBodyWhite>
            </FormItemInline>

            <Ruller />

            <FormItem label="Doc">
              <TextBodyWhite>{funcDoc?.func.doc}</TextBodyWhite>
            </FormItem>

            <Ruller />

            <FormItem label="Arguments">
              <Spacer space={8} />
              {funcDoc?.func.inputs.map((arg, index) => <DynamicItem key={index} paramDoc={arg} />)}
            </FormItem>
            <Ruller />

            <HiddenGroup>
              <FormItem label="Raw Contract Doc">{doc && <PrettyJSON data={doc} />}</FormItem>
            </HiddenGroup>
          </ScrollView>

          <Spacer space={32} />

          <View style={{ height: 100 }}>
            <Button color="primary" onPress={() => {}} loading={loading}>
              Execute Contract
            </Button>
            <Spacer />
          </View>
        </Layout.Body>
      </Layout.Container>
    </>
  )
}

const HiddenGroup = ({ children }: React.PropsWithChildren) => {
  const [visible, setVisible] = useState(false)

  if (!visible) {
    return (
      <TouchableOpacity onPress={() => setVisible(true)} style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text.Body>Show more details...</Text.Body>
      </TouchableOpacity>
    )
  }

  return (
    <>
      {children}

      <Ruller />

      <TouchableOpacity onPress={() => setVisible(false)} style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text.Body>Hide details</Text.Body>
      </TouchableOpacity>
    </>
  )
}

const TextBodyWhite = styled(Text.Body)`
  color: white;
`

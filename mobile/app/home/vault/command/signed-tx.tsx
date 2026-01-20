import { useCallback, useState } from 'react'
import { View, Share, StyleSheet, TouchableOpacity } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { ScreenHeader, Icons } from '@/components'
import { Button, HomeLayout, Text, Spacer, Ruller } from '@berty/gnonative-ui'
import { dismissCommand, selectClipboardSignedTx, useAppDispatch, useAppSelector } from '@/redux'
import { useRouter } from 'expo-router'
import { useTheme } from 'styled-components/native'
import * as Clipboard from 'expo-clipboard'
import { EvilIcons } from '@expo/vector-icons'

const Page = () => {
  const router = useRouter()
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const signedTx = useAppSelector(selectClipboardSignedTx)
  const [copied, setCopied] = useState(false)

  const handleDismiss = useCallback(() => {
    dispatch(dismissCommand())
  }, [dispatch])

  const copyToClipboard = async () => {
    if (signedTx) {
      await Clipboard.setStringAsync(signedTx)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareTransaction = async () => {
    if (signedTx) {
      try {
        await Share.share({
          message: signedTx,
          title: 'Signed Transaction'
        })
      } catch (error) {
        console.error('Error sharing transaction:', error)
      }
    }
  }

  const onDone = () => {
    handleDismiss()
    router.replace('/home')
  }

  return (
    <HomeLayout
      header={<ScreenHeader title="Signed Transaction" headerBackVisible={false} />}
      footer={
        <Button onPress={onDone} color="primary">
          Done
        </Button>
      }
    >
      <ScrollView style={styles.container}>
        <Spacer space={24} />

        <Text.Caption>
          The transaction was signed successfully. You can copy, share, or download the signed transaction below.
        </Text.Caption>

        <Spacer space={24} />

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={copyToClipboard}>
            <Icons.CopyIcon />
            <Text.Caption style={styles.actionLabel}>{copied ? 'Copied!' : 'Copy'}</Text.Caption>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={shareTransaction}>
            <EvilIcons name="share-apple" size={28} color={theme.colors.black} />
            <Text.Caption style={styles.actionLabel}>Share / Save</Text.Caption>
          </TouchableOpacity>
        </View>

        <Spacer space={24} />
        <Ruller />
        <Spacer space={16} />

        <Text.Body weight={Text.weights.bold}>Signed Transaction Data</Text.Body>
        <Spacer space={8} />
        <View style={[styles.txContainer, { backgroundColor: '#f5f5f5' }]}>
          <Text.Json style={styles.txText}>{signedTx || 'No signed transaction available'}</Text.Json>
        </View>

        <Spacer space={32} />
      </ScrollView>
    </HomeLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  actionButton: {
    alignItems: 'center',
    padding: 12
  },
  actionLabel: {
    marginTop: 4
  },
  txContainer: {
    padding: 12,
    borderRadius: 8
  },
  txText: {
    fontSize: 12
  }
})

export default Page

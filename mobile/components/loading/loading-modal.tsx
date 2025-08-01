import { Text } from '@/modules/ui-components'
import React from 'react'
import { ActivityIndicator, Modal, StyleSheet } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

type Props = {
  visible: boolean
  message?: string
}

export default function LoadingModal({ visible, message = 'Loading' }: Props) {
  const theme = useTheme()
  if (!visible) return null

  return (
    <Modal animationType="fade" transparent={true}>
      <Container>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        {message ? <Text.Body style={styles.modalText}>{message}</Text.Body> : null}
      </Container>
    </Modal>
  )
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: '#0008'
  },
  modalView: {
    padding: 40,
    margin: 20,
    borderRadius: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginVertical: 15,
    textAlign: 'center',
    fontSize: 16,
    color: '#fff'
  }
})

import React, { useState } from 'react'
import { View, Modal, StyleSheet, FlatList, TouchableOpacity, Share } from 'react-native'
import { useAppDispatch, useAppSelector } from '@/redux'
import { Layout } from '@/components/index'
import { clearProgress, selectProgress } from '@/redux/features/vaultAddSlice'
import { EvilIcons } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { useTheme } from 'styled-components/native'
import { Text } from '@/modules/ui-components'

const ProgressViewModal = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const theme = useTheme()

  const dispatch = useAppDispatch()
  const progress = useAppSelector(selectProgress)

  const clear = async () => {
    await dispatch(clearProgress())
  }

  const share = async () => {
    await Share.share({
      message: progress.join('\n')
    })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text.Caption style={{ paddingRight: 4 }}>Show Progress</Text.Caption>
        <MaterialIcons name="history" size={18} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View style={[styles.modalOverlay, { backgroundColor: theme.colors.background || '#0008' }]}>
          <View style={styles.transparentTop}></View>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.white }]}>
            <Layout.Header title="Progress" onCloseHandler={() => setModalVisible(false)} style={{ marginTop: 22 }} />
            <FlatList
              data={progress}
              style={[styles.flatList, { borderColor: theme.colors.gray }]}
              ListEmptyComponent={<Text.Caption style={{ flex: 1, textAlign: 'center' }}>No progress yet.</Text.Caption>}
              renderItem={({ item }) => {
                return <Text.Caption style={{ flex: 1, textAlign: 'left' }}>{item}</Text.Caption>
              }}
            />
            <View style={styles.bottom}>
              <EvilIcons name="share-apple" size={24} color={theme.colors.black} onPress={share} />
              <TouchableOpacity>
                <EvilIcons name="trash" size={24} color={theme.colors.black} onPress={clear} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  transparentTop: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingHorizontal: 16
  },
  flatList: { borderWidth: 1, marginVertical: 22, borderRadius: 4, height: 400 }
})

export default ProgressViewModal

import React, { useState } from 'react'
import { View, Modal, StyleSheet, FlatList, TouchableOpacity, Share } from 'react-native'
import { EvilIcons, MaterialIcons } from '@expo/vector-icons'
import { useAppDispatch, useAppSelector, selectProgress, clearProgress } from '@/redux'
import { Layout } from '@/components'
import { Text } from '@/modules/ui-components'

const ProgressViewModal = () => {
  const [modalVisible, setModalVisible] = useState(false)

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
        <View style={styles.modalOverlay}>
          <View style={styles.transparentTop}></View>
          <View style={styles.modalContent}>
            <Layout.Header title="Progress" onCloseHandler={() => setModalVisible(false)} style={{ marginTop: 22 }} />
            <FlatList
              data={progress}
              style={styles.flatList}
              ListEmptyComponent={<Text.Caption style={{ flex: 1, textAlign: 'center' }}>No progress yet.</Text.Caption>}
              renderItem={({ item }) => {
                return <Text.Caption style={{ flex: 1, textAlign: 'left' }}>{item}</Text.Caption>
              }}
            />
            <View style={styles.bottom}>
              <EvilIcons name="share-apple" size={24} color="black" onPress={share} />
              <TouchableOpacity>
                <EvilIcons name="trash" size={24} color="black" onPress={clear} />
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
    justifyContent: 'flex-end',
    backgroundColor: 'red'
  },
  transparentTop: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  modalContent: {
    backgroundColor: 'white',
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
  flatList: { borderColor: 'red', borderWidth: 1, marginVertical: 22, borderRadius: 4, height: 400 }
})

export default ProgressViewModal

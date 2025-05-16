import React from 'react'
import {
  BroadcastingFailedView,
  BroadcastingSuccessView,
  BroadcastingUndefinedView,
  BroadcastingView,
  Layout
} from '@/components'
import { selectBroadcastResponse, selectBroadcastStatus, useAppSelector } from '@/redux'
import { useRouter } from 'expo-router'

export default function Page() {
  const broadcastStatus = useAppSelector(selectBroadcastStatus)
  const txResponse = useAppSelector(selectBroadcastResponse)

  const router = useRouter()

  const goHome = () => router.push('/home')

  return (
    <Layout.Container>
      <Layout.Body>
        {!broadcastStatus || broadcastStatus === undefined ? <BroadcastingUndefinedView onCancel={goHome} /> : null}
        {broadcastStatus === 'pending' ? <BroadcastingView /> : null}
        {broadcastStatus === 'rejected' ? <BroadcastingFailedView txResponse={txResponse} onCancel={goHome} /> : null}
        {broadcastStatus === 'fulfilled' ? <BroadcastingSuccessView txResponse={txResponse} onDone={goHome} /> : null}
      </Layout.Body>
    </Layout.Container>
  )
}

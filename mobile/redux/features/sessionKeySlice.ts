import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ThunkExtra } from '@/providers/redux-provider'
import { KeyInfo } from '@gnolang/gnonative'

export interface SessionKeyInfo {
  key: string
  expires_at: Date
  keyInfo: KeyInfo
}

export interface SessionKeyState {
  sessionKeys: Map<string, SessionKeyInfo>
}

const initialState: SessionKeyState = {
  sessionKeys: new Map()
}

export const newSessionKey = createAsyncThunk<SessionKeyInfo, { keyInfo: KeyInfo; validityMinutes: number }, ThunkExtra>(
  'sessionkey/newSession',
  async (param, config) => {
    const { keyInfo, validityMinutes } = param

    // TODO: implement the actual session key generation
    const key = new Date().getTime().toString()

    return { expires_at: new Date(new Date().getTime() + validityMinutes * 60 * 1000), keyInfo, key }
  }
)

export const sessionKeySlice = createSlice({
  name: 'sessionKey',
  initialState,
  reducers: {},

  extraReducers(builder) {
    builder.addCase(newSessionKey.fulfilled, (state, action) => {
      const sessionKeyInfo = action.payload
      state.sessionKeys = new Map()
      try {
        state.sessionKeys.set(sessionKeyInfo.key, sessionKeyInfo)
      } catch (error) {
        console.error('Error adding session key', error)
      }
    })
  },

  selectors: {}
})

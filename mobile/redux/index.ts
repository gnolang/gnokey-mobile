import type { TypedUseSelectorHook } from 'react-redux'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from './root-reducer'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export * from './features'

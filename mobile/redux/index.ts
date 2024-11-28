import { configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import { reducer } from "@/src/providers/redux-provider";

// TODO: calling configureStore with reducer was the only way to make TS types work.
const storeForTypes = configureStore({ reducer })

export type AppStore = typeof storeForTypes

export type RootState = ReturnType<typeof storeForTypes.getState>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch: () => AppDispatch = useDispatch;

export type AppDispatch = AppStore['dispatch']

export * from "./features";

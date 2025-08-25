import './theme/styled.d.ts'

import { ErrorBox, Alert } from './alert'
import { Container, Spacer, TopModalBar } from './layout/index'
import * as Text from './text/index'
import { TextField, Label, Description } from './textFields/TextField'
import { ThemeProvider, DefaultTheme } from './theme/ThemeProvider'
import { Checkbox } from './checkbox'

export * from './chip/index'
export * from './surfaces/index'
export * from './buttons/index'
export * from './ui/SafeAreaView'
export { FormItem, FormItemInline } from '../molecules/form/FormItem'

export const TextFieldComp = {
  Label,
  Description
}

export { ThemeProvider, DefaultTheme, TextField, Container, Spacer, ErrorBox, Alert, Text, TopModalBar, Checkbox }

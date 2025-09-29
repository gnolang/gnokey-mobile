import './theme/styled.d.ts'

import { Alert } from './alert'
import { Container, Spacer, TopModalBar } from './layout/index'
import * as Text from './text/index'
import { TextField, Label, Description } from './textFields/TextField'
import { ThemeProvider, DefaultTheme } from './theme/ThemeProvider'
import { Checkbox } from './checkbox'

export * from './chip/index'
export * from './surfaces/index'
export * from './buttons/index'
export * from './ui/SafeAreaView'
export { FormItem } from '../molecules/form/FormItem'

export const TextFieldComp = {
  Label,
  Description
}

export { ThemeProvider, DefaultTheme, TextField, Container, Spacer, Alert, Text, TopModalBar, Checkbox }

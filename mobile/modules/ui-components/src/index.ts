import './theme/styled.d.ts'

import { ErrorBox, Alert } from './alert'
import { Container, Spacer, TopModalBar } from './layout/index'
import * as Text from './text/index'
import { TextField, Label, Description } from './textFields/TextField'
import { ThemeProvider, DefaultTheme } from './theme/ThemeProvider'
import { Checkbox } from './checkbox'
import { Section } from './form/FormSection'
import { FormText, FormLink, FormCheckBoxItem, FormButton, FormAddButton } from './form/FormText'

export * from './chip/index'
export * from './surfaces/index'
export * from './buttons/index'
export * from './ui/SafeAreaView'
export { FormItem, FormItemInline } from './form/FormItem'
export const Form = {
  Section,
  Text: FormText,
  Link: FormLink,
  CheckBox: FormCheckBoxItem,
  Button: FormButton,
  AddButton: FormAddButton
}
export const TextFieldComp = {
  Label,
  Description
}

export { ThemeProvider, DefaultTheme, TextField, Container, Spacer, ErrorBox, Alert, Text, TopModalBar, Checkbox }

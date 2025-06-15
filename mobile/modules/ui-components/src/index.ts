import './theme/styled.d.ts'

import { ErrorBox, Alert } from './alert'
import { Container, BottonPanel, Spacer, TopModalBar } from './layout/index'
import * as Text from './text/index'
import { TextField } from './textFields/TextField'
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

export { ThemeProvider, DefaultTheme, TextField, Container, BottonPanel, Spacer, ErrorBox, Alert, Text, TopModalBar, Checkbox }

import { FormText, FormLink, FormCheckBoxItem, FormButton, FormAddButton } from './FormText'
import { Section } from './FormSection'
import { FormErrorBox } from './FormErrorBox'

export type { FormTextProps, FormLinkProps, FormCheckBoxItemProps, FormButtonProps } from './FormText'
export type { Props as SectionProps } from './FormSection'
export { FormItem } from './FormItem'

export const Form = {
  Section,
  Text: FormText,
  Link: FormLink,
  CheckBox: FormCheckBoxItem,
  Button: FormButton,
  AddButton: FormAddButton,
  ErrorBox: FormErrorBox
}

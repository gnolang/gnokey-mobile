import * as AppleAuthentication from 'expo-apple-authentication';
import { StyleSheet } from 'react-native';

type AppleSSOButtonProps = {
  onClick: () => void;
};

const AppleSSOButton: React.FC<AppleSSOButtonProps> = ({ onClick }) => {

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      style={styles.button}
      onPress={async () => {
        try {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });
          // signed in
          console.log('credential', credential);
        } catch (e: any) {
          if (e.code === 'ERR_REQUEST_CANCELED') {
            // handle that the user canceled the sign-in flow
          } else {
            // handle other errors
          }
        }
      }}
    />
  );

}

export default AppleSSOButton

const styles = StyleSheet.create({
  button: {
    height: 48,
  },
});

# Welcome to Gnokey Mobile

Gnokey Mobile is a mobile (D)app that helps users manage their Gnoland keys and sign their (D)app transactions initiated from other Gnoland mobile (D)apps.

## What problem does it solve?

It allows Gnoland (D)app builders to offload the burden of having to build inside their (D)apps the functionalities of private key management and transaction signing, including the related security mechanisms.

### How does it work?

If you want to take advantage of Gnokey Mobile's benefits (secured key management and TX signing), you will need to make your (D)app communicate with Gnokey Mobile on the same phone. Below you will find more details and explanations regarding the inter-app communication mechanisms that you will need to build into your (D)app.

## Inter-app communication

The Gnokey Mobile app uses `expo-linking` to exchange data with your app such as dSocial.
This way, your app can sign in or sign a transaction using the Gnokey Mobile app.

### Sign in

Example of a dSocial request for sign in:

```bash
npx uri-scheme open "land.gno.gnokey://tosignin?client_name=dSocial&callback=tech.berty.dsocial%3A%2F%2Fsignin-callback" --ios
```

- Base URL: `land.gno.gnokey://tosignin`
- Parameters:
  - client_name: the name of the app that is calling the Gnokey Mobile app. It will be displayed to the user.
  - callback: the URL that Gnokey Mobile will call after the user selects the account.

Example response:

```bash
tech.berty.dsocial://signin-callback?address=g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3&cachekill=1732030818190
```

- Base URL: The `callback` from the request. In this case, `tech.berty.dsocial://signin-callback`
- Parameters:
  - address: the address of the selected account
  - remote: the RPC url associated to the selected account
  - chain_id: the chain ID associated to the selected account
  - cachekill: For testing. Ignore this.

### Sign a transaction

Example of a dSocial request to Gnokey Mobile to sign a transaction (with added newlines for clarity):

```bash
npx uri-scheme open "land.gno.gnokey://tosign?tx=%7B%22msg%22%3A%5B%7B%22%40type%22%3A%22%2Fvm.m_call%22%2C%22caller%22%3A%22g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3%22%2C%22send%22%3A%22%22%2C%22pkg_path%22%3A%22gno.land%2Fr%2Fberty%2Fsocial%22%2C%22func%22%3A%22PostMessage%22%2C%22args%22%3A%5B%22Hello%22%5D%7D%5D%2C%22fee%22%3A%7B%22gas_wanted%22%3A%2210000000%22%2C%22gas_fee%22%3A%221000000ugnot%22%7D%2C%22signatures%22%3Anull%2C%22memo%22%3A%22%22%7D&address=g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3&remote=https%3A%2F%2Fapi.gno.berty.io%3A443&chain_id=dev&client_name=dSocial&reason=Post%20a%20message&callback=tech.berty.dsocial%3A%2F%2Fpost" --ios
```

- Base URL: `land.gno.gnokey://tosign`
- Parameters (values should be percent-escaped with `encodeURIComponent`):
  - tx: the json result of `gnonative.makeCallTx(...)`
  - address: bech32 address of whoever you want to sign the transaction.
  - remote: the connection address for the remote node where the transaction will be sent
  - chain_id: the chain ID for the remote
  - client_name: the name of the app that is calling the Gnokey Mobile app. It will be displayed to the user.
  - reason: the reason behind this action. It will be displayed to the user.
  - callback: the URL that Gnokey Mobile will call after signing the tx.
  - update_tx (optional): if "true" then update gas_wanted in the tx with the estimated gas.

Example response:

```bash
tech.berty.dsocial://post?tx=%7B%22msg%22%3A%5B%7B%22%40type%22%3A%22%2Fvm.m_call%22%2C%22caller%22%3A%22g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3%22%2C%22send%22%3A%22%22%2C%22pkg_path%22%3A%22gno.land%2Fr%2Fberty%2Fsocial%22%2C%22func%22%3A%22PostMessage%22%2C%22args%22%3A%5B%22Hello%22%5D%7D%5D%2C%22fee%22%3A%7B%22gas_wanted%22%3A%2210000000%22%2C%22gas_fee%22%3A%221000000ugnot%22%7D%2C%22signatures%22%3A%5B%7B%22pub_key%22%3A%7B%22%40type%22%3A%22%2Ftm.PubKeySecp256k1%22%2C%22value%22%3A%22A6YT26ehhjN7YXx%2BLZza2Gp31yP5bJ6INfeGf%2FrumHFR%22%7D%2C%22signature%22%3A%226KAdOO2YXyZmp8ehiin6Rsz%2Bhxu30W0pB00%2Bv1xnpzMSZ%2BBIVdZbo1gdlVGp0E24ZLRyPrsKtb0Q4%2FkdD57qGg%3D%3D%22%7D%5D%2C%22memo%22%3A%22%22%7D
&status=success
```

- Base URL: The `callback` from the request. In this case, `tech.berty.dsocial://post`
- Parameters (values are percent-escaped, to be decoded with `decodeURIComponent`):
  - tx: the signed transaction json to pass to `gnonative.broadcastTxCommit(...)`
  - status: either "success" or an error

### Testing on iOS simulator

If you are using `make ios` to run Gnokey Mobile in the iOS simulator, you can send a test transaction simply by
pasting the request URL into Safari in the simulator. This will open Gnokey Mobile where you can approve. The
response URL is printed in the terminal running `make ios` .

### Testing on Android simulator

If you are using `make android` to run Gnokey Mobile in the Android simulator, you can use `adb` to send the URL
of a test transaction. You must change each `&` to `\&` . The following example will open Gnokey Mobile where you can approve. The
response URL is printed in the terminal running `make android` .

```bash
adb shell am start -a android.intent.action.VIEW -d "land.gno.gnokey://tosign?tx=%7B%22msg%22%3A%5B%7B%22%40type%22%3A%22%2Fvm.m_call%22%2C%22caller%22%3A%22g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3%22%2C%22send%22%3A%22%22%2C%22pkg_path%22%3A%22gno.land%2Fr%2Fberty%2Fsocial%22%2C%22func%22%3A%22PostMessage%22%2C%22args%22%3A%5B%22Hello%22%5D%7D%5D%2C%22fee%22%3A%7B%22gas_wanted%22%3A%2210000000%22%2C%22gas_fee%22%3A%221000000ugnot%22%7D%2C%22signatures%22%3Anull%2C%22memo%22%3A%22%22%7D\&address=g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3\&client_name=dSocial\&reason=Post%20a%20message\&callback=tech.berty.dsocial%3A%2F%2Fpost"
```

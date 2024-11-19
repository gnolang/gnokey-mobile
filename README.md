
## Inter-app communication

The Gnokey Mobile app uses `expo-linking` to exchange data with your app such as dSocial.
This way, your app can sign in or sign a transaction using the Gnokey Mobile app.

### Sign in

Example of dSocial asking for sign in:
```
land.gno.gnokey://tosignin?callback=tech.berty.dsocial%3A%2F%2Fsignin-callback
```
- Base URL: `land.gno.gnokey://tosignin`
- Parameters:
  - callback: the URL that Gnokey Mobile will call after the user selects the account.


### Sign a transaction
Example of dSocial asking Gnokey Mobile to sign a transaction (with added newlines for clarity):
```
land.gno.gnokey://tosign?tx=%7B%22msg%22%3A%5B%7B%22%40type%22%3A%22%2Fvm.m_call%22%2C%22caller%22%3A%22g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3%22%2C%22send%22%3A%22%22%2C%22pkg_path%22%3A%22gno.land%2Fr%2Fberty%2Fsocial%22%2C%22func%22%3A%22PostMessage%22%2C%22args%22%3A%5B%22Hello%22%5D%7D%5D%2C%22fee%22%3A%7B%22gas_wanted%22%3A%2210000000%22%2C%22gas_fee%22%3A%221000000ugnot%22%7D%2C%22signatures%22%3Anull%2C%22memo%22%3A%22%22%7D
&address=g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3
&client_name=dSocial
&reason=Post%20a%20message
&callback=tech.berty.dsocial%3A%2F%2Fpost
```

- Base URL: `land.gno.gnokey://tosign`
- Parameters (values should be percent-escaped with `encodeURIComponent`):
  - tx: the json result of `gnonative.makeCallTx(...)`
  - address: bech32 address of whoever you want to sign the transaction.
  - client_name: the name of the app that is calling the Gnokey Mobile app. It will be displayed to the user.
  - reason: the reason behind this action. It will be displayed to the user.
  - callback: the URL that Gnokey Mobile will call after signing the tx.

Example response:
```
tech.berty.dsocial://post?tx=%7B%22msg%22%3A%5B%7B%22%40type%22%3A%22%2Fvm.m_call%22%2C%22caller%22%3A%22g19h0el2p7z8thtqy4rze0n6en94xux9fazf0rp3%22%2C%22send%22%3A%22%22%2C%22pkg_path%22%3A%22gno.land%2Fr%2Fberty%2Fsocial%22%2C%22func%22%3A%22PostMessage%22%2C%22args%22%3A%5B%22Hello%22%5D%7D%5D%2C%22fee%22%3A%7B%22gas_wanted%22%3A%2210000000%22%2C%22gas_fee%22%3A%221000000ugnot%22%7D%2C%22signatures%22%3A%5B%7B%22pub_key%22%3A%7B%22%40type%22%3A%22%2Ftm.PubKeySecp256k1%22%2C%22value%22%3A%22A6YT26ehhjN7YXx%2BLZza2Gp31yP5bJ6INfeGf%2FrumHFR%22%7D%2C%22signature%22%3A%226KAdOO2YXyZmp8ehiin6Rsz%2Bhxu30W0pB00%2Bv1xnpzMSZ%2BBIVdZbo1gdlVGp0E24ZLRyPrsKtb0Q4%2FkdD57qGg%3D%3D%22%7D%5D%2C%22memo%22%3A%22%22%7D
```
- Base URL: The `callback` from the request. In this case, `tech.berty.dsocial://post`
- Parameters (values are percent-escaped, to be decoded with `decodeURIComponent`):
  - tx: the signed transaction json to pass to `gnonative.broadcastTxCommit(...)`

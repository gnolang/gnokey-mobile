
## Inter-app communication

The Gnokey Mobile app uses `expo-linking` to exchange data with your app such as dSocial.
This way, your app can sign in or sign a transaction using the Gnokey Mobile app.

### Sign in

Example of dSocial asking for sign in:
```
land.gno.gnokey://tosignin?callback=tech.berty.dsocial%3A%2F%2Fsignin-callback
```
- Base url: `land.gno.gnokey://tosignin`
- Parameters:
  - callback: the URL that Gnokey Mobile will call after the user selects the account.


### Sign a transaction
Example of dSocial asking Gnokey Mobile to sign a transaction:
```
land.gno.gnokey://tosign?tx=%257B%2522msg%2522%253A%255B%257B%2522%2540type%2522%253A%2522%252Fvm.m_call%2522%252C%2522caller%2522%253A%2522g1gl0hrpuegawx6pv24xjq8jjmufzp5r5mnn896w%2522%252C%2522send%2522%253A%2522%2522%252C%2522pkg_path%2522%253A%2522gno.land%252Fr%252Fberty%252Fsocial%2522%252C%2522func%2522%253A%2522PostMessage%2522%252C%2522args%2522%253A%255B%2522Test%25203%2522%255D%257D%255D%252C%2522fee%2522%253A%257B%2522gas_wanted%2522%253A%252210000000%2522%252C%2522gas_fee%2522%253A%25221000000ugnot%2522%257D%252C%2522signatures%2522%253Anull%252C%2522memo%2522%253A%2522%2522%257D&address=g1gl0hrpuegawx6pv24xjq8jjmufzp5r5mnn896w&client_name=dSocial&reason=Post%20a%20message&callback=tech.berty.dsocial%253A%252F%252Fpost
```

- Base url: `land.gno.gnokey://tosign`
- Parameters (as usual, values are percent-escaped with `encodeURIComponent`):
  - tx: the json result of `gnonative.makeCallTx(...)`
  - address: bech32 address of whoever you want to sign the transaction.
  - client_name: the name of the app that is calling the Gnokey Mobile app. It will be displayed to the user.
  - reason: the reason behind this action. It will be displayed to the user.
  - callback: the URL that Gnokey Mobile will call after signing the tx.

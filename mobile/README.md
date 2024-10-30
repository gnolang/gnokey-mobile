# gnoKey Mobile APP

## Requirements

The gnoKey mobile app uses Expo. You can review the general expo requirements:

- Expo Requiments: https://docs.expo.dev/get-started/installation/

Here are specific steps to install the requirements on your platform.

### Install requirements for macOS 13 and macOS 14

(If you are on Ubuntu, see the next section to install requirements.)

Install Xcode. To install the Command Line Developer Tools, in a terminal enter:

```sh
xcode-select --install
```

After the Developer Tools are installed, we need to make sure it is updated. In
System Preferences, click Software Update and update it if needed.

To install asdf using brew, follow instructions at https://asdf-vm.com . In short,
first install brew following the instructions at https://brew.sh . Then, in
a terminal enter:

```sh
brew install asdf gnu-tar gpg
```

If your terminal is zsh, enter:

```sh
echo -e "\n. $(brew --prefix asdf)/libexec/asdf.sh" >> ${ZDOTDIR:-~}/.zshrc
```

If your terminal is bash, enter:

```sh
echo -e "\n. \"$(brew --prefix asdf)/libexec/asdf.sh\"" >> ~/.bash_profile
```

Start a new terminal to get the changes to the environment .

(optional) To install Android Studio, download and install the latest
android-studio-{version}-mac.dmg from https://developer.android.com/studio .
(Tested with Jellyfish 2023.3.1 .)

### Install requirements for Ubuntu 20.04, 22.04 and 24.04

To install asdf, follow instructions at https://asdf-vm.com . In short, in
a terminal enter:

```sh
sudo apt install curl git make
git clone https://github.com/asdf-vm/asdf.git ~/.asdf
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.bashrc
echo 'export ANDROID_HOME="$HOME/Android/Sdk"' >> ~/.bashrc
echo 'export ANDROID_NDK_HOME="$ANDROID_HOME/ndk/23.1.7779620"' >> ~/.bashrc
```

Start a new terminal to get the changes to the environment .

To install Android Studio, download the latest
android-studio-{version}-linux.tar.gz from
https://developer.android.com/studio . (Tested with Jellyfish 2023.3.1 .)
In a terminal, enter the following with the correct {version}:

```sh
sudo tar -C /usr/local -xzf android-studio-{version}-linux.tar.gz
```

To launch Android Studio, in a terminal enter:

```sh
/usr/local/android-studio/bin/studio.sh &
```

## 🚀 How to use

### Build for iOS

#### Install the tools with asdf (only need to do once)

```sh
make asdf.install_tools
```

If you get an error like "https://github.com/CocoaPods/CLAide.git (at master@97b765e) is not yet checked out" then reinstall cocoapods like this:

```sh
asdf uninstall cocoapods
make asdf.install_tools
```

```sh
# to build and run on ios:
make ios
```

### Build for Android

#### Install the tools with asdf (only need to do once)

(If not building for iOS, edit the file `.tool-versions` and remove the unneeded lines for `ruby` and `cocoapods`.)

```sh
make asdf.install_tools
```

#### Set up the Android NDK

- Launch Android Studio and accept the default startup options. Create a new
  default project (so that we get the main screen).
- On the Tools menu, open the SDK Manager.
- In the "SDK Tools" tab, click "Show Package Details". Expand
  "NDK (Side by side)" and check "23.1.7779620".
- Click OK to install and close the SDK Manager.

```sh
# to build and run on android:
make android

# to start Metro Bundler:
make start
```

## Inter App communication

dSocial and Gnokey mobile app are using `expo-linking` to exchange data.
So that way you can signin or sign a transaction using Gnokey mobile app.

### Sign in

Example of dSocial asking for sign in
```
land.gno.gnokey://tologin?callback=tech.berty.dsocial%3A%2F%2Flogin-callback
```
- Base url: `land.gno.gnokey://tologin`
- Parameters:
  - callback: the url that Gnokey mobile will call after the user selecting the account.


### Sign a transaction
Example of dSocial asking Gnokey Mobile to sign a transaction:
```
land.gno.gnokey://tosign?tx=%257B%2522msg%2522%253A%255B%257B%2522%2540type%2522%253A%2522%252Fvm.m_call%2522%252C%2522caller%2522%253A%2522g1gl0hrpuegawx6pv24xjq8jjmufzp5r5mnn896w%2522%252C%2522send%2522%253A%2522%2522%252C%2522pkg_path%2522%253A%2522gno.land%252Fr%252Fberty%252Fsocial%2522%252C%2522func%2522%253A%2522PostMessage%2522%252C%2522args%2522%253A%255B%2522Test%25203%2522%255D%257D%255D%252C%2522fee%2522%253A%257B%2522gas_wanted%2522%253A%252210000000%2522%252C%2522gas_fee%2522%253A%25221000000ugnot%2522%257D%252C%2522signatures%2522%253Anull%252C%2522memo%2522%253A%2522%2522%257D&address=g1gl0hrpuegawx6pv24xjq8jjmufzp5r5mnn896w&client_name=dSocial&reason=Post%20a%20message&callback=tech.berty.dsocial%253A%252F%252Fpost
```

- Base url: `land.gno.gnokey://tosign`
- Parameters:
  - tx: the json result of `gnonative.makeCallTx(...)`
  - address: bech32 address of whoever you want to sign the transaction.
  - client_name: the name of the application that is calling the Gnokey mobile application. It will be displayed to the user.
  - reason: the reason behind this action. It will be displayed to the user.
  - callback: the callback URL that will be called from Gnokey mobile after signing the tx.


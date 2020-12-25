# Requirements for software and computer.
- For the release version and the android version, any pc is suitable
- To build android and IOS applications, you need a mac. Better to have the latest OS and Xcode.
- Also requires nodejs at least 8.6 and npm at least 5.0

# Setting up Linux environment (pure Ubuntu 18)
## NPM (6.14.8)
1. `sudo apt install npm`
2. `npm install -g npm` - update npm

## NodeJs (12.18.3)
1. `sudo apt install curl`
2. `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.0/install.sh | bash` - install nvm
3. `nvm install 12.18.3` - update nodejs (in this case - version 12.18.3)

## React Native Cli (2.0.1)
1. `sudo npm install -g react-native-cli`

## Java (11.0.9.1)
1. `sudo apt update`
2. `sudo apt install default-jdk`

## Git (2.17.1)
1. `sudo apt install git`
2. `git config --global user.name "Your Name"`
3. `git config --global user.email "youremail@domain.com"`
4. `cd ~/.ssh && ssh-keygen` - create a key
5. `cat id_rsa.pub` - output the key to the terminal, copy
6. Add the key to your account via https://github.com/

## Android Studio
1. Connect to the server via Microsoft Remote Desctop (if the setting is on a remote server)
2. https://developer.android.com/studio/install.html - download and install Android Studio
3. `sudo apt-get install libc6:i386 libncurses5:i386 libstdc++6:i386 lib32z1 libbz2-1.0:i386` - install this library if you are using 64-bit Linux.
4. During installation, install Google APIs, Android SDK Platform 23, Intel x86 Atom_64 System Image, Google APIs Intel x86 Atom_64 System Image

# Building on linux.
1. In the root of the project, run `npm i` - Installs dependencies
2. Run Android Studio
3. Open Android Studio, go to `configure/AVD Manager/Create Virtual Device` - Create a default emulator
4. In the root of the project, run `react-native run-android`

# Setting up mac environment
## NodeJs (12.18.3)
1. https://nodejs.org/en/download/ -  Download and install Node.js

## React Native Cli (2.0.1)
1. `sudo npm install -g react-native-cli` - install react native cli

## Java (11.0.9.1)
1. https://www.oracle.com/java/technologies/javase-jdk11-downloads.html - Download and install jdk macOS Installer

## Git (2.17.1)
1. `sudo apt install git`
2. `git config --global user.name "Your Name"`
3. `git config --global user.email "youremail@domain.com"`
4. `cd ~/.ssh && ssh-keygen` - create a key
5. `cat id_rsa.pub` - output the key to the terminal, copy
6. Add the key to your account via https://github.com/

## XCode
1. Download and install Xcode

# Install and run macos in dev mode.
1. In the root of the project, run `npm i` - Install dependencies
2. `cd ios` - Go to the ios folder
3. `pod install` - Install dependencies
4. `cd ..` - Return to the root of the project
5. At the root of the project, run `react-native run-ios`

# Notes
- Sometimes yellow and red notes may appear in the emulator, you can hide them and update the application with `comand + R`
- You can also open the dev console by pressing `comand + shift + Z` in the emulator and selecting the item there
- When switching to branches with a different version of the app:
  - In the root of the project `rm -rf node_modules` - Remove old dependencies
  - At the root of the project `npm i` - Install new dependencies
  - iOS only: `cd ios` ->` rm -rf Pods` -> `pod install` - Remove old dependencies and install new ones

# Configuring the builder (for building an application based on client folders)
1. `cd ~` - Go to home directory
2. `sudo apt install python-pip` - install pip
3. `git clone git@github.com:cscart/mobile-app-builder.git` - clone the project
4. `cd mobile-app-builder` - go to the folder with the project
5. `pip install -r requirements.txt` - install dependencies
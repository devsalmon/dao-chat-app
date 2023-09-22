# Dao Chat App

https://youtu.be/Z7ayg-v7euE?si=D1iwldEbQPePiBLt

Use main branch for mobile app, and chrome-extension for the extension.

## Start

In the project directory, you can run:

```
yarn
yarn start
```

## Note

We are still extremely early on in development stages and have not yet released our app. Be mindful that new commits, or changes to our server can cause authentication issues and persistent chat synchronisation errors as well as other general bugs.

## Mobile App

Connect wallet to https://dao-chat.vercel.app/sign-in and sign in through your wallet provider. You can then go to https://dao-chat.vercel.app/sign-in in a browser, and add the app to your home screen for testing.

## Chrome Extension

```
yarn build
```

Go to chrome://extensions/ click on 'Load unpacked' and select the build folder. You should now be able to view the extension in chrome if you pin it to the browser.

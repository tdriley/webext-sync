# webext-sync
Sync data between a web extension's background, popup, options and content scripts. The data will persist across extension restarts and the background service worker stopping/starting does not affect functionality. Works cross-browser, with MV2 and MV3.

Please submit any issues or feature requests at [https://github.com/tdriley/webext-sync/issues](https://github.com/tdriley/webext-sync/issues)

## Usage
First install as a project dependency: 

```npm install webext-sync --save```

Make sure your extension's `manifest.json` asks for the `storage` permission:

```javascript
// manifest.json

"permissions": [
    "storage"
],
```

In the extension's background script, define the default state and set it up to store and receive changes. Note: If you ever want to change the data's schema in newer versions of your extension, you can define a new `defaultState` and any existing data will be deep-merged with the new schema.

```javascript
// background.js

import { startSyncStore } from "webext-sync"

const defaultState = {
    storeVersion: 1, // Not required, but it is probably a good idea to version your store
    timesPopupOpened: 0 
}

startSyncStore(defaultState).then(async syncStore=> {
    let state = await syncStore.getState()

    syncStore.onChange((newState, prevState)=> {
        // Handle state updates here.
        // If you are using a state store like Redux, you could do something like reduxStore.dispatch({ type: "STORE_UPDATE", newState: newState })
        state = newState

        console.log('Times popup opened:', state.timesPopupOpened)
    })

    console.log('Background loaded! state: ', state)
})
```

Popup, options or content scripts can then be set up to store and receive changes:

```javascript
// popup.js

import { startSyncStore } from "webext-sync"

startSyncStore().then(async syncStore=> {
    let state = await syncStore.getState()
    syncStore.onChange((newState, prevState)=> {
        // Handle state updates here.
        // If you are using a state store like Redux, you could do something like reduxStore.dispatch({ type: "STORE_UPDATE", newState: newState })
        state = newState
    })

    console.log('Popup loaded! state:', state)

    syncStore.setState({ timesPopupOpened: state.timesPopupOpened+1 })
})
```
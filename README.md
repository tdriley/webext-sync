# webext-sync
Sync data between an MV3 web extension's background, popup, options and content scripts. The data will persist across extension restarts and the background service worker stopping/starting does not affect functionality.

Coming soon:
 - Support for nested data
 - Support for defining migration funcs for when the extension is updated

## Usage
First install as a project dependency: 

```npm install git@github.com:tdriley/webext-sync.git --save```

Make sure your extension's `manifest.json` asks for the `storage` permission:

```json
// manifest.json

"permissions": [
    "storage"
],
```

In the extension's background script, define the default state and set it up to store and receive changes:

```javascript
// background.js

import { startStore } from "webext-sync"

const defaultState = {
    storeVersion: 1, // Not required, but it is probably a good idea to version your store
    timesPopupOpened: 0 
}

startStore(defaultState).then(async store=> {
    let state = await store.get()

    store.onChange((newState, prevState)=> {
        // Handle state updates here
        state = newState

        console.log('Times popup opened:', state.timesPopupOpened)
    })

    console.log('Background loaded! state: ', state)
})
```

Popup, options or content scripts can then be set up to store and receive changes:

```javascript
// popup.js

import { startStore } from "webext-sync"

startStore().then(async store=> {
    let state = await store.get()
    store.onChange((newState, prevState)=> {
        // Handle state updates here.
        state = newState
    })

    console.log('Popup loaded! state:', state)

    store.set({ timesPopupOpened: state.timesPopupOpened+1 })
})
```
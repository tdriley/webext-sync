# webext-sync
Sync data between an MV3 web extension's background, popup, options and content scripts.

## Usage
First install as a project dependency: 

```npm install git@github.com:tdriley/webext-sync.git --save```

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

In any other extension parts, set them up to store and receive changes:

```javascript
// popup.js, options.js, or content scripts

import { startStore } from "webext-sync"

startStore().then(async store=> {
    let state = await store.get()
    store.onChange((newState, prevState)=> {
        // Handle state updates here.
        state = newState
    })

    console.log('Other extension part loaded! state:', state)

    store.set({ timesPopupOpened: state.timesPopupOpened+1 })
})
```
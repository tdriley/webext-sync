import { merge } from "lodash.merge"

if (!('browser' in self)) self.browser = self.chrome

const localStorage = browser.storage.local

const get = async (key)=> {
    const state = await (!key || !key.length) ? localStorage.get(null) : localStorage.get(key)
    return state || {}
}

const set = async (data)=> {
    await localStorage.set(data)
    return data
}

export const startSyncStore = async (defaultState={})=> {    
    const prevState = await get()
    await set( merge(defaultState, prevState) )
    let prevHandler

    return {
        onChange: (fn)=> {
            if (prevHandler) browser.storage.onChanged.removeListener(prevHandler)

            const handler = async (changes, area)=> {
                const state = await get()
                const prevState = {}
              
                for (const item in changes) {
                    prevState[item] = changes[item].oldValue
                }

                fn(state, prevState)
            }
            prevHandler = handler
            browser.storage.onChanged.addListener(handler)
        },
        getState: get,
        setState: set
    }
}
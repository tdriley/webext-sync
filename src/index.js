if (!('browser' in self)) self.browser = self.chrome

const localStorage = browser.storage.local

const get = async (key)=> {
    // TODO: Handle deep keys.
    // TODO: make sure it returns a blank object by default.
    const state = await (!key || !key.length) ? localStorage.get(null) : localStorage.get(key)
    return state
}

const set = async (data)=> {
    await localStorage.set(data)
    return data
}

// TODO: Handle deep objects.
export const startSyncStore = async (defaultState={}, migrationFuncs=[])=> {

    // TODO: Handle migrations properly.
    // if (migrationFuncs.length) {
    //     const prevState = await get()
    //     let migratedState = {}
    //     migrationFuncs.forEach(fn=> {
    //         migratedState = Object.assign(prevState, fn(prevState))
    //     })
    // }
    
    const prevState = await get()
    await set( Object.assign(defaultState, prevState) )
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
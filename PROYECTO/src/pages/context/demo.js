import { createContext, useContext, useState } from 'react'

const Context = createContext()

// la parte plantilla
export function DemoProvider(  { children} ) {
    const [estado, setEstado] = useState('')
    
    return (
        <Context.Provider value={ [estado, setEstado] }>
            {children}
        </Context.Provider>
    )   
}

export function useDemoProvider() {
    return useContext(Context)
}
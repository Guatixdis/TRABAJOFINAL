import '../styles/estatico.css'
import '../styles/login.css'
import '../styles/prinAlum.css'
import '../styles/registro.css'

import { AppProps } from "next/app";
import { DemoProvider} from './context/demo'

export default function MyApp({Component,pageProps}){
    return (
        <DemoProvider>
            <Component { ...pageProps} />
        </DemoProvider>
    )
}
import dynamic from 'next/dynamic';
import Image from 'next/image'
import Link from 'next/link';
import {useDemoProvider} from './context/demo'

const Index = () => {

    const [estado, setEstado] = useDemoProvider();

    return (
        <>
            <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
            <meta name="viewport" content="height=device-height, initial-scale=1"></meta>
                <div className="cabeza">
                    <Image src="/3lineas.png" height={40} width={40} alt="Desplegable"></Image>
                    <h1>Sistema de biblioteca</h1>
                    <Image src="/usuario.png" height={40} width={40} alt="usuario"></Image>
                </div>
                <div className="cuerpo">
                    <div className="opciones">
                        <ul>
                            <li><Link href="/prinAlum">Principal</Link></li>
                            <li><Link href="/perfilAlum">Perfil</Link></li>
                            <li><Link href="/prestamos">Préstamos</Link></li>
                        </ul>
                    </div>
                    <div className="prin">
                        <h1>Bienvenido, {estado} </h1>
                        
                    </div>
                </div>
        </>
    );
}

export default dynamic(() => Promise.resolve(Index),{ssr:false});
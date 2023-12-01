import { createContext, useContext, useState } from 'react';
import { useDemoProvider } from './context/demo';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const DemoContext = createContext();


const InsertarNuevoLibro = () => {
    const router = useRouter();
    const [estado, setEstado] = useDemoProvider();
    const [showAlert, setShowAlert] = useState(false);
    const [state, setState] = useState({
        titulo: '',
        autor: '',
        isbn: '',
        serie: '',
        img: '',
    });
    function registrarEstado(e) {
        setState({ ...state, [e.target.name]: e.target.value });
    }

    const doGuardarJSONRecursos = async () => {
        const nuevoLibro = {
            titulo: state.titulo,
            autor: state.autor,
            isbn: state.isbn,
            serie: state.serie,
            img: 'https://img.freepik.com/vector-gratis/meme-cuadrado-gato-vibrante-simple_742173-4493.jpg',
            };
        
            try {
            const peticion = await fetch('/api/recurso/agregar', {
                method: 'POST',
                body: JSON.stringify(nuevoLibro),
                headers: {
                'Content-Type': 'application/json',
                },
            });
            const data = await peticion.json();
            console.log(data);
            } catch (err) {
            console.log(err);
            }
        };
    function verificarRegistroRecursos() {
        const { titulo, autor, isbn, serie, img } = state;
        const mensajeElement = document.getElementById('mensaje');

        if (titulo.trim() && autor.trim() && isbn.trim() && serie.trim() && img.trim()) {
            doGuardarJSONRecursos();
            setTimeout(() => {
                setShowAlert(true);
            }, 500);
            setTimeout(() => {
                setShowAlert(false);
                router.push('/prinAdmin');
            }, 3000);
        } else {
            mensajeElement.textContent = 'Por favor, rellena todos los campos.';
            mensajeElement.style.color = 'red';
        }
    }

    function cargarImagen(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        if (file && esTipoDeImagenPermitido(file.type)) {
            reader.onloadend = () => {
                const imageData = reader.result;
                setState({ ...state, img: imageData });
            };
            reader.readAsDataURL(file);
        } else {
            console.log('Selecciona un archivo de imagen válido (JPEG, PNG, GIF, etc.)');
        }
    }

    function esTipoDeImagenPermitido(fileType) {
        return fileType.startsWith('image/');
    }

    function generarNuevoId(existingData) {
        let maxId = 0;
        existingData.forEach(libro => {
            if (libro.id > maxId) {
                maxId = libro.id;
            }
        });
        return maxId + 1;
    }

    function webing(e) {
        e.preventDefault()
    }

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
                        <li><Link href="/prinAdmin">Principal</Link></li>
                        <li><Link href="/perfilAdmin">Perfil</Link></li>
                        <li><Link href="/bibliotecas">Bibliotecas</Link></li>
                    </ul>
                </div>
                <div className="prin">
                    <h1>Bienvenido, {estado} </h1>
                    <form onSubmit={webing} className="formularioUwU">
                        <section className="datoRecurso">
                            <h1 className="Titulo">INSERTAR NUEVO LIBRO</h1>
                            <ul className="requisitos">TÍTULO</ul>
                            <ul className="recursoName">
                                <input name="titulo" type="text" required placeholder="Titulo" onChange={registrarEstado} id="titulo"></input>
                            </ul>
                            <ul className="requisitos">Autor, autores</ul>
                            <ul className="recursoName">
                                <input name="autor" type="text" required placeholder="Autor/es" onChange={registrarEstado} id="autor"></input>
                            </ul>
                            <ul className="requisitos">ISBN</ul>
                            <ul className="recursoName">
                                <input name="isbn" type="text" required placeholder="ISBN" onChange={registrarEstado} id="isbn"></input>
                            </ul>
                            <ul className="requisitos">Serie, Tipo</ul>
                            <ul className="recursoName">
                                <input name="serie" type="text" required placeholder="Serie/Tipo" onChange={registrarEstado} id="serie"></input>
                            </ul>
                            <ul className="requisitos">Cubierta</ul>
                            <ul className="recursoName">
                                <input name="img" type="file" onChange={cargarImagen} accept="image/*"/>
                            </ul>
                            <ul id="mensaje"></ul>
                            <button className="botoncito" type="button" onClick={verificarRegistroRecursos}>Guardar</button>
                        </section>
                        <aside className="Imagen">
                            <Image className="Libreria" src="/libreriaUwU.jpg" height={250} width={300} alt="Libreria"></Image>
                        </aside>
                    </form>
                </div>
            </div>
            {showAlert && (<div className="alerta">Libro añadido</div>)}
        </>
    );
}

export default dynamic(() => Promise.resolve(InsertarNuevoLibro), { ssr: false });

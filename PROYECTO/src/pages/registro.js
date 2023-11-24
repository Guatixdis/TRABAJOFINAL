import { useState } from "react";
import Link from 'next/link';

const Form = () => {
    const [state, setEstate] = useState( {
        nombres : '',
        apellidos : '',
        Tdocumento : '',
        Ndocumento : '',
        correo : '',
        contrasenia : '',
        contrasenia2: ''
    })

    function registrarEstado(e) {
        console.log( e.target.name , ' - ' , e.target.value)
        setEstate( {...state,  [e.target.name] : e.target.value })
    }

    const doGuardarJSON = async () => {
        // Recuperar los valore sy armar un JSON
        const jsonObject = {}
        jsonObject['nombres'] = state.nombres
        jsonObject['apellidos'] = state.apellidos
        jsonObject['Tdocumento'] = state.Tdocumento
        jsonObject['Ndocumento'] = state.Ndocumento
        jsonObject['correo'] = state.correo
        jsonObject['contrasenia'] = state.contrasenia
        jsonObject['tipo'] = "usuario"

        const params = JSON.stringify(jsonObject)
        console.log( params)
        // Invocar a la API
  
        try {
            const peticion = await fetch(
                '/api/registroAPIFile',
                {
                    method : 'POST',
                    body : params,
                    headers : {
                        'Content-Type' : 'application/json'
                    }
                }
            )

            const data = await peticion.json()
            console.log(data)

        } catch (err) {
            console.log(err)
        }
      
        
    }

    function VerificarRegistro() {
        const contrasenia1 = document.getElementById('contra1').value;
        const contrasenia2 = document.getElementById('contra2').value;
        const mensajeElement = document.getElementById('mensaje');
    
        // Obtener el contenido de los campos adicionales
        const nombres = document.getElementById('nomb').value;
        const apellidos = document.getElementById('apell').value;
        const Tdocumento = document.getElementById('tdocum').value;
        const Ndocumento = document.getElementById('ndocum').value;
        const correo = document.getElementById('cor').value;
    
        // Verificar que todos los campos obligatorios estén llenos
        if (nombres.trim() !== '' &&
            apellidos.trim() !== '' &&
            Tdocumento.trim() !== '' &&
            Ndocumento.trim() !== '' &&
            correo.trim() !== '' &&
            contrasenia1.trim() !== '' &&
            contrasenia2.trim() !== '') {
            if (contrasenia1 === contrasenia2) {
                // Las contraseñas coinciden, puedes realizar la acción deseada aquí
                doGuardarJSON(); // Llamar a la función doGuardarJSON si las contraseñas coinciden
                window.location.href = '/';
            } else {
                // Las contraseñas no coinciden, muestra un mensaje de error
                mensajeElement.textContent = 'Las contraseñas no coinciden';
                mensajeElement.style.color = 'red';
            }
        } else {
            mensajeElement.textContent = 'No están todos los campos llenos';
            mensajeElement.style.color = 'red';
        }
    }
    
    
    
    
    

    function hacernada(e) {
        e.preventDefault()

    }

    // Ahora retornar el formulario
    return (
        <>
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
        <meta name="viewport" content="height=device-height, initial-scale=1"></meta>
            <div className="formulario2">
                <h1>Sistema de reserva de libros</h1>
                <h2>Registro de usuario</h2>
                <form onSubmit={hacernada}>
                    <div className="datopers">
                        <div className="username">
                            <input name="nombres" type="text" required placeholder="Nombres" onChange={registrarEstado} id="nomb"></input>
                        </div>
                        <div className="username">
                            <input name="apellidos" type="text" required placeholder="Apellidos" onChange={registrarEstado} id="apell"></input>
                        </div>
                        <div className="username">
                            <input name="Tdocumento" type="text" required placeholder="Tipo de documento" onChange={registrarEstado} id="tdocum"></input>
                        </div>
                        <div className="username">
                            <input name="Ndocumento" type="number" required placeholder="Nro de documento" onChange={registrarEstado} id="ndocum"></input>
                        </div>
                    </div>
                    <div className="datocuen">
                        <div className="username">
                            <input name="correo" type="email" required placeholder="Correo electrónico" onChange={registrarEstado} id="cor"></input>
                        </div>
                        <div className="username">
                            <input name="contrasenia" type="password" required placeholder="Contraseña" onChange={registrarEstado} id="contra1"></input>
                        </div>
                        <div className="username">
                            <input name="contrasenia2" type="password" required placeholder="Ingresar Contraseña nuevamente" id="contra2"></input>
                        </div>
                        <div id="mensaje"></div>
                    </div>
                    <button type="button" onClick={VerificarRegistro}>Registrar</button>
                    <div className="registrar">
                        ¿Ya tienes cuenta? <Link href="/">Iniciar Sesión</Link>
                    </div>
                </form>
            </div>
        </>
    )
    
}

const Registro = () => {
    return (

        <div>
            <Form />
        </div>
    )
}

export default Registro


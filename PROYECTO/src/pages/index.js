import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import { useDemoProvider } from './context/demo';
import { useRouter } from 'next/router.js';

const Index = () => {
    const [estado, setEstado] = useDemoProvider();
    const router = useRouter();
    const [datos, setDatos] = useState([]);  // Estado local para almacenar los datos de la API

    function VerificarIngreso() {
        const mensajeElement = document.getElementById('mensaje');
        const correo = document.getElementById('corr').value;
        const contrasenia = document.getElementById('contra').value;

        if (correo.trim() !== '' && contrasenia.trim() !== '') {
            // Realiza la solicitud a la API para obtener los datos
            axios.get('http://localhost:3080/api/listar')
                .then(response => {
                    // Verifica que la respuesta sea un array
                    if (Array.isArray(response.data)) {
                        // Puedes establecer los datos en el estado local si es necesario
                        setDatos(response.data);

                        // Realiza la verificación de ingreso con los datos obtenidos de la API
                        const usuarioEncontrado = response.data.find(usuario => correo === usuario.correo);

                        if (usuarioEncontrado) {
                            console.log('EXISTE EL USUARIO');
                            if (contrasenia === usuarioEncontrado.contrasenia) {
                                console.log('LA CONTRASEÑA CONCUERDA');
                                setEstado(usuarioEncontrado.nombres);
                                if (usuarioEncontrado.tipo === "usuario") {
                                    router.push('/prinAlum');
                                } else {
                                    router.push('/prinAdmin');
                                }
                            } else {
                                mensajeElement.textContent = 'Contraseña incorrecta';
                                mensajeElement.style.color = 'red';
                            }
                        } else {
                            mensajeElement.textContent = 'No existe un usuario con ese correo';
                            mensajeElement.style.color = 'red';
                        }
                    } else {
                        console.error('La respuesta de la API no es un formato de array válido.');
                    }
                })
                .catch(error => {
                    console.error('Error al obtener datos de la API:', error);
                    mensajeElement.textContent = 'Error al obtener datos de la API';
                    mensajeElement.style.color = 'red';
                });
        } else {
            mensajeElement.textContent = 'No están todos los campos llenos';
            mensajeElement.style.color = 'red';
        }
    }

    return (
        <>
            <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
            <meta name="viewport" content="height=device-height, initial-scale=1"></meta>
            <div className="formulario">
                <h1>Sistema de reserva de libros</h1>
                <form>
                    <div className="username">
                        <input type="text" placeholder="Correo" required id="corr"></input>
                    </div>
                    <div className="username">
                        <input type="password" placeholder="Contraseña" required id="contra"></input>
                    </div>
                    <div className="recordar">Olvidé mi contraseña</div>
                    <button type="button" onClick={VerificarIngreso}>Ingresar</button>
                    <div id="mensaje"></div>
                    <div className="registrar">
                        <Link href="/registro">Registrarme</Link>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Index;

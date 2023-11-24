import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import datos from './json/usuarios.json';
import {useDemoProvider} from './context/demo'
import { useRouter } from 'next/router.js'

const Index = () => {
    
    const [estado, setEstado] = useDemoProvider();
    const router = useRouter()
    // setEstado(usuarios.nombre)
    function VerificarIngreso() {
        const mensajeElement = document.getElementById('mensaje');
        const correo = document.getElementById('corr').value;
        const contrasenia = document.getElementById('contra').value;

        if (correo.trim() !== '' && contrasenia.trim() !== '') {
                if (Array.isArray(datos)) {
                    datos.forEach(usuario => {
                        if (correo === usuario.correo) {
                            console.log('EXISTE EL USUARIO');
                            if (contrasenia === usuario.contrasenia) {
                                console.log('LA CONTRASEÑA CONCUERDA')
                                setEstado(usuario.nombres)
                                if (usuario.tipo === "usuario") {
                                    router.push('/prinAlum')
                                } else {
                                    router.push('/prinAdmin')
                                }

                            }else{
                                mensajeElement.textContent = 'Contraseña incorrecta';
                                mensajeElement.style.color = 'red';
                            }
                            
                        }else{
                            mensajeElement.textContent = 'No existe un usuario con ese correo';
                            mensajeElement.style.color = 'red';

                        }
                    });
                } else {
                    console.error('El archivo JSON no tiene un formato de array válido.');
                }
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

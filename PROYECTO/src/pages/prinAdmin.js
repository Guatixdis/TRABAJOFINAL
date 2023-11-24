import dynamic from 'next/dynamic';
import Image from 'next/image'
import Link from 'next/link';
import {useDemoProvider} from './context/demo'
import { useState, useEffect } from 'react';
const Index = () => {
    const [librosMasPedidos, setLibrosMasPedidos] = useState([]);
    const [estado, setEstado] = useDemoProvider();
    const [recursos, setRecursos] = useState([]);
    const [contadorLibros, setContadorLibros] = useState({});
    const [ultimasReservas, setUltimasReservas] = useState([]);
    useEffect(() => {
        const obtenerUltimasReservas = async () => {
            try {
                const responseReservas = await fetch('/api/leerListaReservasAPI');
                if (responseReservas.ok) {
                    const reservas = await responseReservas.json();
                    const ultimas = reservas.sort((a, b) => {
                        const fechaA = new Date(a.fechareserva);
                        const fechaB = new Date(b.fechareserva);
                        return fechaB - fechaA;
                    }).slice(0, 3);

                    setUltimasReservas(ultimas);
                } else {
                    console.error('Error al obtener las últimas reservas:', responseReservas.statusText);
                }
            } catch (error) {
                console.error('Error al obtener las últimas reservas:', error);
            }
        };

        obtenerUltimasReservas();

        const obtenerLibrosMasPedidos = async () => {
            try {
                const responseRecursos = await fetch('/api/editarRecursosAPI');
                if (responseRecursos.ok) {
                    const recursosData = await responseRecursos.json();
        
                    const responseReservas = await fetch('/api/leerListaReservasAPI');
                    if (responseReservas.ok) {
                        const reservas = await responseReservas.json();
        
                        const contador = {};
        
                        reservas.forEach((reserva) => {
                            const libro = reserva.libro;
                            contador[libro] = (contador[libro] || 0) + 1;
                        });
        
                        setLibrosMasPedidos(
                            Object.entries(contador)
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 3)
                        );
        
                        setContadorLibros(contador);
                        setRecursos(recursosData);
                    } else {
                        console.error('Error al obtener la lista de reservas:', responseReservas.statusText);
                    }
                } else {
                    console.error('Error al obtener los recursos:', responseRecursos.statusText);
                }
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };

        obtenerLibrosMasPedidos();
    }, [recursos]);
    
    useEffect(() => {
        const obtenerRecursos = async () => {
        try {
            const response = await fetch('/api/editarRecursosAPI');
            if (response.ok) {
            const recursosData = await response.json();
            setRecursos(recursosData);
            } else {
            console.error('Error al obtener los recursos:', response.statusText);
            }
        } catch (error) {
            console.error('Error al obtener los recursos:', error);
        }
        };

        obtenerRecursos();
    }, []);
        
        const formatearFecha = (fecha) => {
            const fechaObj = new Date(fecha);
            const dia = fechaObj.getDate().toString().padStart(2, '0');
            const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
            const anio = fechaObj.getFullYear();
            return `${dia}/${mes}/${anio}`;
        };
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
                <li><Link href="/buscar">Búsqueda</Link></li>
            </ul>
            </div>
            <div className="prin">
            <h1>Bienvenido, {estado} </h1>
            <div className="ultre">
                <h2>Últimas reservas</h2>
            </div>
            <div className="imagenesContainer">
                    {ultimasReservas.map((reserva, index) => {
                        const recurso = recursos.find(resource => resource.titulo === reserva.libro);
                        return (
                            <div key={index} className="imagenLibro">
                                {recurso && (
                                    <Image src={recurso.img} width={100} height={150} alt={`Portada de ${recurso.titulo}`} />
                                )}
                                <h3>{recurso ? recurso.titulo : 'Libro no encontrado'}</h3>
                                <p>Fecha de reserva: {formatearFecha(reserva.fechareserva)}</p>
                            </div>
                        );
                    })}
                </div>
            <div className="proxven">
                <h2>Los más pedidos</h2>
            </div>
            <div className="imagenesContainer">
                {librosMasPedidos.map(([titulo, reservas], index) => {
                    const recurso = recursos.find((resource) => resource.titulo === titulo);
                        return (
                            <div key={index} className="imagenLibro">
                                {recurso && (
                                    <Image src={recurso?.img} width={100} height={150} alt={`Portada de ${recurso?.titulo}`} />
                                )}
                                <h3>{recurso ? recurso.titulo : 'Libro no encontrado'}</h3>
                                {/* Mostrar la cantidad de reservas actualizada */}
                                <p>Veces reservado: {reservas}</p>
                            </div>
                        );
                })}
            </div>
        </div>
        </div>
    </>
    );
}

export default dynamic(() => Promise.resolve(Index),{ssr:false});
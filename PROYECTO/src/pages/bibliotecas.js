import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useDemoProvider } from './context/demo';
import { useEffect, useState } from 'react';

const ListarRecursos = () => {
  const [estado, setEstado] = useDemoProvider();
  const [recursos, setRecursos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resourcesPerPage = 8;

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await fetch('/api/editarRecursosAPI');
        if (response.ok) {
          const data = await response.json();
          setRecursos(data);
        } else {
          throw new Error('Error al obtener los recursos');
        }
      } catch (error) {
        console.error('Error al obtener los recursos:', error);
      }
    };

    obtenerDatos();
  }, []);

  // Cálculo para la paginación
  const indexOfLastResource = currentPage * resourcesPerPage;
  const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
  const currentResources = recursos.slice(indexOfFirstResource, indexOfLastResource);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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
          <div className="contenedor-productos">
            {currentResources.map((recurso) => (
              <div key={recurso.id} className="producto">
                <Image className="Libreria" src={recurso.img} height={250} width={150} alt="Libreria" />
                <h3>{recurso.titulo}</h3>
                <p>Autor: {recurso.autor}</p>
                <p>ISBN: {recurso.isbn}</p>
                <p>Serie: {recurso.serie}</p>
                <Link href="/editarLibro/[id]" as={`/editarLibro/${recurso.id}`} passHref={true} legacyBehavior={true}>
                  <a>Editar</a>
                </Link>
              </div>
            ))}
          </div>
          <div class="contenedorRegistro">
            <Link href="/gestionRecurso" className='linkRegistro'>Añadir Más Recursos</Link>
          </div>
          <div className="pagination">
            {Array.from({ length: Math.ceil(recursos.length / resourcesPerPage) }, (_, index) => (
              <button key={index} className="pagination-button" onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            ))}
          </div>
          
        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(ListarRecursos), { ssr: false });

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const BusquedaUsuarioId = () => {
  const router = useRouter();
  const { id } = router.query;
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3080/recurso/listar');
        if (!response.ok) {
          throw new Error('Error al obtener datos del servidor');
        }

        const recursosData = await response.json();

        // Filtrar la lista de recursos según el ID proporcionado en la URL
        const results = recursosData.filter((recurso) => (
          recurso.titulo.toLowerCase().includes(id.toLowerCase()) ||
          recurso.autor.toLowerCase().includes(id.toLowerCase())
        ));

        setSearchResults(results);
      } catch (error) {
        console.error('Error al obtener datos del servidor:', error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div>
      <h2 className="cabeza">Resultados de la búsqueda</h2>
      <div>
        <Link href="/prinAdmin">Volver a la página principal</Link>
      </div>
      {/* Mostrar resultados de la búsqueda */}
      <div>
        <h3>Resultados de la búsqueda:</h3>
        <ul>
          {searchResults.map((recurso) => (
            <li key={recurso.id}>{recurso.titulo} - {recurso.autor}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BusquedaUsuarioId;

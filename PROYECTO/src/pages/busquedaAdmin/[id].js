// pages/busquedaUsuario/[id].js
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import recursosData from '../../pages/json/recursos.json'; // Asegúrate de que la ruta al archivo sea correcta

const BusquedaUsuarioId = () => {
  const router = useRouter();
  const { id } = router.query;
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Filtrar la lista de recursos según el ID proporcionado en la URL
    const results = recursosData.filter((recurso) => (
      recurso.titulo.toLowerCase().includes(id.toLowerCase()) ||
      recurso.autor.toLowerCase().includes(id.toLowerCase())
    ));

    setSearchResults(results);
  }, [id]);

  return (
    <div>
      <h2 className="cabeza">Resultados de la búsqueda</h2>
      <div>
        <Link href="/prinAlum">Volver a la página principal</Link>
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
import React, { useState , useEffect} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const BusquedaUsuario = () => {
    const router = useRouter();
    const { query } = router;
    const { id } = router.query;
    const [searchTerm, setSearchTerm] = useState(query.term || '');
    const [searchAuthor, setSearchAuthor] = useState(query.author === 'true');
    const [searchTitle, setSearchTitle] = useState(query.title === 'true');
  
    const handleSearch = () => {
      router.push(`/busquedaAlum/${encodeURIComponent(searchTerm)}`);
    };
  
    useEffect(() => {
      setSearchTerm(query.term || '');
      setSearchAuthor(query.author === 'true');
      setSearchTitle(query.title === 'true');
    }, [query]);
    return (
        <div>
          <h2 className="cabeza">Búsqueda</h2>
          <input
            type="text"
            placeholder="Escribe tu búsqueda"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div>
            <label>
              <input
                type="checkbox"
                checked={searchAuthor}
                onChange={() => setSearchAuthor(!searchAuthor)}
              />
              Autor
            </label>
            <label>
              <input
                type="checkbox"
                checked={searchTitle}
                onChange={() => setSearchTitle(!searchTitle)}
              />
              Título
            </label>
          </div>
          <button className="botoncito" onClick={handleSearch}>Buscar</button>
          <div className="cuerpo">
            <div className="opciones">
              <Link href="/prinAlum">Volver a la página principal</Link>
            </div>
          </div>
          {/* Mostrar resultados de la búsqueda */}
          {id && <p>Redirigiendo a la página de resultados...</p>}
        </div>
      );
    };
    
    export default BusquedaUsuario;

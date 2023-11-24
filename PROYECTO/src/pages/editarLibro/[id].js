import React, { useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

const EditarLibro = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [editedLibro, setEditedLibro] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [reservaInfo, setReservaInfo] = useState(null);

    //lee los libros
    useEffect(() => {
      const fetchLibro = async () => {
        try {
          const url = `/api/editarRecursosAPI?id=${id}`;
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            setEditedLibro(data);
            setIsLoading(false);
          } else {
            console.error('Error al obtener el libro:', response.statusText);
            setIsLoading(false);
          }
        } catch (error) {
          console.error('Error al obtener el libro:', error);
          setIsLoading(false);
        }
      };
  
      if (id) {
        fetchLibro();
      }
    }, [id]);
    //lee las reservas
    useEffect(() => {
      if (editedLibro && editedLibro[id] && editedLibro[id].titulo) {
        // Obtener la información de reservas
        fetch('/api/leerListaReservasAPI')
          .then((response) => response.json())
          .then((data) => {
            const reserva = data.find((item) => item.libro === editedLibro[id].titulo);
            setReservaInfo(reserva);
          })
          .catch((error) => {
            console.error('Error al obtener la información de reservas:', error);
          });
      }
    }, [editedLibro, id]);
    //Revisa que este digitandose en el form
    const handleFieldChange = (e) => {
      const { name, value } = e.target;
      setEditedLibro((prevEditedLibro) => ({
        ...prevEditedLibro,
        [id]: {
          ...prevEditedLibro[id],
          [name]: value,
        },
      }));
    };
    //Guarda las ediciones de los recursos
  const handleSaveChanges = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/editarRecursosAPI?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(editedLibro[id]),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        console.log('Libro actualizado exitosamente');
        setShowAlert(true);
        setTimeout(() => {setShowAlert(false);
        }, 3000); // Duración en milisegundos antes de ocultar el aviso (en este caso, 3000ms = 3 segundos)
      }
      else {
        console.error('Error al actualizar el libro:', response.statusText);
      }
    } catch (error) {
      console.error('Error al actualizar el libro:', error);
    }
  };


  const handleDeleteLibro = async () => {
    try {
      const response = await fetch(`/api/editarRecursosAPI?id=${id}`, {
        method: 'DELETE',
      });

      if (response.status === 204) {
        console.log('Libro eliminado exitosamente');
        router.push('/bibliotecas');
      } else {
        console.error('Error al eliminar el libro:', response.statusText);
      }
    } catch (error) {
      console.error('Error al eliminar el libro:', error);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!editedLibro) {
    return <div>No se pudo obtener el libro.</div>;
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
                        <section>
                          <h1 className='TITULO'>EDICION DE LIBROS</h1>
                        </section>
                        <form onSubmit={handleSaveChanges} className="formularioUwU">
                          <section className="datoRecurso">
                            <h1 className="Titulo">Detalles del Libro</h1>
                              <ul className="requisitos">TÍTULO</ul>
                              <ul className="recursoName">
                                <input
                                  name="titulo"
                                  type="text"
                                  required placeholder="Titulo"
                                  onChange={handleFieldChange}
                                  value={editedLibro[id].titulo}/>
                              </ul>
                              <ul className="requisitos">Autor, autores</ul>
                              <ul className="recursoName">
                                <input
                                  name="autor"
                                  type="text"
                                  required placeholder="Autor/es"
                                  onChange={handleFieldChange}
                                  value={editedLibro[id].autor}/>
                              </ul>
                              <ul className="requisitos">ISBN</ul>
                              <ul className="recursoName">
                              <input
                                  name="isbn"
                                  type="text"
                                  required
                                  placeholder="ISBN"
                                  onChange={handleFieldChange}
                                  value={editedLibro[id].isbn}/>
                              </ul>
                              <ul className="requisitos">Serie, Tipo</ul>
                              <ul className="recursoName">
                                <input
                                  name="serie"
                                  type="text"
                                  required placeholder="Serie/Tipo"
                                  onChange={handleFieldChange}
                                  value={editedLibro[id].serie}/>
                              </ul>
                            <button className="botoncito" type="submit">Guardar Cambios</button>
                            <button className="botoncito" onClick={handleDeleteLibro}>Eliminar Libro</button>
                          </section>
                          <aside className="Imagen">
                            <Image className="Libreria" src={editedLibro[id].img} height={350} width={250} alt="Libreria" />
                          </aside>
                          <section className="reserva-info">
                            <h4>Estado de Reserva:</h4>
                              {reservaInfo ? (
                              <div>
                                <p>Reservado por: {reservaInfo.nombres} {reservaInfo.apellidos}</p>
                              </div>) : (
                                <div className="reserva-info sin-reserva">
                                  <p>Sin reserva</p>
                                </div>)}
                          </section>
                        </form>
                    </div>
                  </div>
                  {showAlert && (
        <div className="alert">
          Libro guardado exitosamente
        </div>
      )}
      <style jsx>{`
        .alert {
          position: fixed;
          bottom: 20px;
          left: 20px;
          padding: 10px 20px;
          background-color: #4caf50;
          color: white;
          border-radius: 4px;
          z-index: 9999;
        }
      `}</style>
        </>
  );
};

export default EditarLibro;
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

const EditarLibro = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [editedLibro, setEditedLibro] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertDel, setshowAlertDel] = useState(false);
  const [reservaInfo, setReservaInfo] = useState(null);

  useEffect(() => {
    const obtenerRecursos = async () => {
      try {
        const responseLibro = await fetch(`/api/recurso/${id}`);
        if (responseLibro.ok) {
          const dataLibro = await responseLibro.json();
          setEditedLibro(dataLibro);

          const responseReservas = await fetch('/api/reserva/listar');
          if (responseReservas.ok) {
            const dataReservas = await responseReservas.json();
            const reservaEncontrada = dataReservas.find(reserva => reserva.libro === dataLibro.titulo);
            setReservaInfo(reservaEncontrada);
          } else {
            console.error('Error al obtener la lista de reservas:', responseReservas.statusText);
          }

          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.error('Error al obtener el libro por ID:', responseLibro.statusText);
        }
      } catch (error) {
        setIsLoading(false);
        console.error('Error al obtener el libro o la lista de reservas:', error);
      }
    };

    if (id) {
      obtenerRecursos();
    }
  }, [id]);
  
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedLibro((prevEditedLibro) => ({
      ...prevEditedLibro,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (event) => {
    event.preventDefault();
    try {
      const url = `/api/recurso/actualizar/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(editedLibro),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        console.log('Libro actualizado exitosamente');
        setTimeout(() => {
          setShowAlert(true);
        }, 500);
        setTimeout(() => {
          setShowAlert(false);
          router.push('/bibliotecas');
        }, 3000);
      } else {
        console.error('Error al actualizar el libro:', response.statusText);
      }
    } catch (error) {
      console.error('Error al actualizar el libro:', error);
    }
  };

  const handleDeleteLibro = async () => {
    try {
      const url = `/api/recurso/eliminar/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Libro eliminado exitosamente');
        setTimeout(() => {
          setShowAlert(false);
          setshowAlertDel(true);
        }, 500);
        setTimeout(() => {
          router.push('/bibliotecas');
          setshowAlertDel(false);
        }, 3000);
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
                                required
                                placeholder="Titulo"
                                onChange={handleFieldChange}
                                value={editedLibro.titulo || ''}
                              />
                              </ul>
                              <ul className="requisitos">Autor, autores</ul>
                              <ul className="recursoName">
                              <input
                                name="autor"
                                type="text"
                                required
                                placeholder="Autor/es"
                                onChange={handleFieldChange}
                                value={editedLibro.autor || ''}
                              />
                              </ul>
                              <ul className="requisitos">ISBN</ul>
                              <ul className="recursoName">
                              <input
                                  name="isbn"
                                  type="text"
                                  required
                                  placeholder="ISBN"
                                  onChange={handleFieldChange}
                                  value={editedLibro.isbn ||''}
                                  />
                              </ul>
                              <ul className="requisitos">Serie, Tipo</ul>
                              <ul className="recursoName">
                                <input
                                  name="serie"
                                  type="text"
                                  required placeholder="Serie/Tipo"
                                  onChange={handleFieldChange}
                                  value={editedLibro.serie ||''}
                                  />
                              </ul>
                            <button className="botoncito" type="submit">Guardar Cambios</button>
                            <button className="botoncito" onClick={handleDeleteLibro}>Eliminar Libro</button>
                          </section>
                          <aside className="Imagen">
                          <Image className="Libreria" src={editedLibro.img ||''} height={350} width={250} alt="Libreria" />
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
                  {showAlert && (<div className="alerta">Libro modificado</div>)}
                  {showAlertDel && (<div className="alertaElim">Libro eliminado</div>)}
        </>
  );
};

export default EditarLibro;
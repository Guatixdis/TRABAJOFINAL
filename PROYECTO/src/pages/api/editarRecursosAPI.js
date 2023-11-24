import fsPromises from 'fs/promises';

const JSON_FILE_PATH = './src/pages/json/recursos.json';

export default async function librosAPI(req, res) {
  if (req.method === 'GET') {
    try {
      const jsonData = await fsPromises.readFile(JSON_FILE_PATH);
      const libros = JSON.parse(jsonData);
      res.status(200).json(libros);
    } catch (error) {
      console.error(error);
      res.status(500).send({ "error": "Error en el servidor" });
    }
  } else if (req.method === 'PUT') {
    try {
      const jsonData = await fsPromises.readFile(JSON_FILE_PATH);
      let existingData = JSON.parse(jsonData);

      const libroData = req.body;

      const libroIndex = existingData.findIndex((libro) => libro.id === libroData.id);

      if (libroIndex !== -1) {
        existingData[libroIndex] = { ...existingData[libroIndex], ...libroData };

        await fsPromises.writeFile(
          JSON_FILE_PATH,
          JSON.stringify(existingData, null, 2)
        );
        res.status(200).json({ message: "Libro actualizado exitosamente" });
      } else {
        res.status(404).json({ error: "Libro no encontrado" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ "error": "Error en el servidor" });
    }
  } else if (req.method === 'DELETE') {
    try {
      const libroId = req.query.id;
      // Leer los datos actuales del archivo JSON
      const jsonData = await fsPromises.readFile(JSON_FILE_PATH);
      const libros = JSON.parse(jsonData);

      // Encuentra y elimina el libro por ID
      const libroIndex = libros.findIndex((libro) => libro.id === parseInt(libroId));
      if (libroIndex !== -1) {
        libros.splice(libroIndex, 1);

        // Escribe los datos actualizados en el archivo JSON
        await fsPromises.writeFile(JSON_FILE_PATH, JSON.stringify(libros, null, 2));
        res.status(204).end(); // 204 significa que no hay contenido (éxito)
      } else {
        res.status(404).json({ error: 'Libro no encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  } else if (req.method === 'POST') {
    try {
      const jsonData = await fsPromises.readFile(JSON_FILE_PATH);
      const existingData = JSON.parse(jsonData);
      
      const nuevoLibro = req.body; // Suponiendo que req.body contiene los datos del nuevo libro a agregar

      // Verificar si el ID existe, si es así, incrementar hasta encontrar un ID disponible
      let nuevoID = nuevoLibro.id;
      while (existingData.some(libro => libro.id === nuevoID)) {
        nuevoID++;
      }
      nuevoLibro.id = nuevoID;

      existingData.push(nuevoLibro);

      await fsPromises.writeFile(
        JSON_FILE_PATH,
        JSON.stringify(existingData, null, 2)
      );
      
      res.status(201).json({ message: "Libro agregado exitosamente", nuevoLibro });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error en el servidor al agregar el libro" });
    }
  } else {
    res.status(405).end();
  }
}
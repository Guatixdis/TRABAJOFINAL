import fsPromises from 'fs/promises';

const JSON_FILE_PATH = './src/pages/json/listareservas.json';

export default async function listaReservaAPI(req, res) {
  if (req.method === 'GET') {
    try {
      // Leer los datos del archivo JSON de reservas    
      const jsonData = await fsPromises.readFile(JSON_FILE_PATH);
      const reservas = JSON.parse(jsonData);
      res.status(200).json(reservas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}

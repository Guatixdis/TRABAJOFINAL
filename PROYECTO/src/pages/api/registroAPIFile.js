import fsPromises from 'fs/promises';

const JSON_FILE_PATH = './src/pages/json/usuarios.json';

export default async function registroAPIFile(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ "error": "método no soportado... solo POST" });
    } else if (req.method === 'POST') {

        const tmp = JSON.stringify(req.body).replace("'", '"');
        const body = JSON.parse(tmp);

        try {
            // Intenta leer el contenido actual del archivo JSON
            let existingData = [];

            try {
                const jsonData = await fsPromises.readFile(JSON_FILE_PATH);
                existingData = JSON.parse(jsonData);
            } catch (error) {
                // El archivo no existe o está vacío, por lo que no es un arreglo
                // Continuará con un arreglo vacío
            }

            // Asegurarse de que existingData sea un arreglo
            if (!Array.isArray(existingData)) {
                existingData = [];
            }

            // Agrega los nuevos datos al arreglo existente
            existingData.push(body);

            // Escribe el archivo JSON con los datos actualizados
            await fsPromises.writeFile(
                JSON_FILE_PATH,
                JSON.stringify(existingData, null, 2)
            );
        } catch (error) {
            console.error(error);
            res.status(500).send({ "error": "Error en el servidor" });
        }
    }
}

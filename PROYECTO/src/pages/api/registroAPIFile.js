import axios from 'axios';

// Variable global para almacenar los datos
let existingData = [];

const API_URL = 'http://localhost:3080/api/listar';

export default async function registroAPI(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ "error": "método no soportado... solo POST" });
    } else if (req.method === 'POST') {
        try {
            // Realizar la solicitud a la API para obtener los datos
            const apiResponse = await axios.get(API_URL);
            existingData = apiResponse.data;

            // Asegurarse de que existingData sea un arreglo
            if (!Array.isArray(existingData)) {
                throw new Error('La respuesta de la API no es un arreglo válido.');
            }

            // Obtén los datos del cuerpo de la solicitud y agrégales a existingData
            const body = req.body;
            existingData.push(body);

            res.status(200).send({ "success": true });
        } catch (error) {
            console.error(error);
            res.status(500).send({ "error": "Error en el servidor" });
        }
    }
}

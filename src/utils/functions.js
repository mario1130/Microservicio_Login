import path from 'path'; 
import { fileURLToPath } from 'url'; 
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function unirCadena(arrayCadena) {

    return `(${arrayCadena.map(item => `'${item}'`).join(', ')})`;
  
}

function crearRuta(req) {

    const { photo } = req.files;
    try {
        const name = new Date().getMilliseconds(); // Nombre del archivo
        const mimeType = photo.mimetype; // Tipo MIME de la foto
        const size = photo.size; // Tamaño del archivo
   
        // Guardar la foto en la carpeta 'uploads'
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.jpg`;
        const filePath = path.join(uploadDir, filename);

        fs.writeFileSync(filePath, photo.data);

        return filename;

    } catch (error) {
        console.error("Error al subir la foto:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
  
}

function formatToDateOnly(isoDate) {
    const date = new Date(isoDate); // Convierte la cadena ISO a un objeto Date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses son 0-indexados
    const day = String(date.getDate()).padStart(2, '0'); // Días del mes

    return `${day}-${month}-${year}`; // Devuelve en formato YYYY-MM-DD
}
 
export default {

    unirCadena, 
    crearRuta, 
    formatToDateOnly
}
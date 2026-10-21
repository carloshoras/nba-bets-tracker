// index.ts - Punto de entrada para AWS Lambda

import { main as checkScraping } from "./check-scraping.js";
import { main as prepareData } from "./prepare-data.js";
import { main as buildWeb } from "./build.js";

export const handler = async (event: any) => {
  console.log("Iniciando el proceso automatizado de la NBA...");
  
  try {
    // 1. Ejecutar el scrapeo
    console.log("Paso 1: Ejecutando check-scraping...");
    await checkScraping();
    
    // 2. Preparar los datos procesando el JSON
    console.log("Paso 2: Ejecutando prepare-data...");
    await prepareData();
    
    // 3. Generar el HTML final y subirlo a S3
    console.log("Paso 3: Ejecutando build...");
    await buildWeb();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "¡Web de la NBA actualizada con éxito en S3!" }),
    };
  } catch (error: any) {
    console.error("Error durante la ejecución del pipeline en la Lambda:", error);
    throw error; // Al relanzar el error, AWS sabrá que la ejecución falló
  }
};
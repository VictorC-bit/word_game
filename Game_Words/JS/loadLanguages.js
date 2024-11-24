import { mapeoLen } from './keyboards.js';

async function loadLanguages() {
    try {
        // Llama al endpoint para obtener los idiomas
        const response = await fetch('http://127.0.0.1:5000/api/language'); // Asegúrate de que el puerto sea correcto
        const languages = await response.json();

        // Selecciona el contenedor del selector de idiomas
        const languageContainer = document.querySelector('.selection-language');
        
        // Crea el elemento select
        const languageSelect = document.createElement('select');
        languageSelect.id = 'language';

        // Convierte languages en un arreglo de entradas y ordénalas alfabéticamente
        const sortedLanguages = Object.entries(languages).sort((a, b) => {
            // a[1] y b[1] son nombres de idiomas, ya que el valor de languages es un string.
            return a[1].localeCompare(b[1]); // Ordenar por nombre
        });

        // Itera sobre los idiomas obtenidos y los añade al select
        let firstOptionAdded = false; // Flag para saber si hemos añadido la primera opción
        for (const [abbreviation, languageName] of sortedLanguages) {
            const option = document.createElement('option');
            option.value = abbreviation;
            option.textContent = languageName; // Utiliza languageName directamente
            languageSelect.appendChild(option);
            
            // Si es la primera opción, la marcamos como seleccionada
            if (!firstOptionAdded) {
                option.selected = true; // Marcar como seleccionada
                firstOptionAdded = true; // Cambiar el flag
            }
        }

        // Añade el select al contenedor
        languageContainer.appendChild(languageSelect);

    } catch (error) {
        console.error('Error al cargar idiomas:', error);
    }
}

async function validateLanguageFile(abbreviation, wordLength) {
    const specialChars = mapeoLen(abbreviation);  // Obtener caracteres especiales

    console.log("Enviando longitud de palabra:", wordLength);

    const response = await fetch('http://127.0.0.1:5000/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            abbreviation: abbreviation,
            specialCharacters: specialChars,
            wordLength: wordLength
        })
    });

    return await response.json(); // Retorna la respuesta en formato JSON
}

async function translateBackToMenu() {
    try {
        const languageSelect = document.getElementById('language');
        const selectedLanguage = languageSelect ? languageSelect.value : 'es'; // Usar 'es' como valor predeterminado

        // Realizamos la solicitud para traducir "Regresar" al idioma especificado
        const translationResponse = await fetch('http://127.0.0.1:5000/translate-regresar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                abbreviation: selectedLanguage // Aquí enviamos el idioma seleccionado
            })
        });

        // Obtener la respuesta de la traducción
        const translationData = await translationResponse.json();

        // Devolver la traducción de "Regresar"
        return translationData.translated;

    } catch (error) {
        console.error('Error al traducir la palabra "Regresar":', error);
        return null;  // Retorna null en caso de error
    }
}

// Función para solicitar la traducción de "Sí" y "No"
async function fetchConfirmationTranslations() {
    try {
        const languageSelect = document.getElementById('language');
        const selectedLanguage = languageSelect ? languageSelect.value : 'es'; // Usar 'es' como valor predeterminado

        // Realizamos la solicitud para traducir "Sí" y "No" al idioma especificado
        const translationResponse = await fetch('http://127.0.0.1:5000/translate_confirmation', { // Cambiado a translate_confirmation
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                abbreviation: selectedLanguage // Aquí enviamos el idioma seleccionado
            })
        });

        // Obtener la respuesta de la traducción
        const translationData = await translationResponse.json();

        // Devolver la traducción de "Sí" y "No" directamente como un objeto
        return translationData;

    } catch (error) {
        console.error('Error al traducir las palabras "Sí" y "No"', error);
        return { yes: 'Sí', no: 'No' };  // Valores predeterminados en caso de error
    }
}

export { loadLanguages };
export { validateLanguageFile };
export { translateBackToMenu, fetchConfirmationTranslations };
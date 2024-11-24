import { viewKeyboard } from './keyboards.js';
import { generateLetterInputs } from './length.js';
import { loadLanguages, translateBackToMenu } from './loadLanguages.js';
import { validateLanguageFile } from './loadLanguages.js';
import { showInstructions, showAlert, closeModal, showExitConfirmation } from './modal.js';

// Elementos HTML
const backToMenuButton = document.getElementById('back-to-menu');
const languageSelect = document.getElementById('language');
const wordLengthSelect = document.getElementById('word-length');
const gameArea = document.getElementById('game-area');
const startGameButton = document.getElementById('start-game');
const closeButton = document.getElementById('close-modal');
const modalButton = document.getElementById('modal-button');

async function updateBackButton() {
    const translatedWord = await translateBackToMenu();
    
    if (translatedWord) {
        const backButton = document.getElementById('back-to-menu');
        if (backButton) {
            backButton.textContent = translatedWord;
        }
    } else {
        console.error('No se pudo obtener la traducción.');
    }
}

// Cargar idiomas y agregar el listener
document.addEventListener('DOMContentLoaded', () => {
    loadLanguages().then(() => {
        const languageSelect = document.getElementById('language'); // Asegúrate de que este elemento esté disponible
        if (languageSelect) { // Verifica que el elemento existe
            languageSelect.addEventListener('change', (event) => {
                const selectedLanguage = event.target.value;
                console.log(`Idioma seleccionado: ${selectedLanguage}`); // Imprime la selección en la consola
                viewKeyboard(selectedLanguage); // Llama a la función para renderizar el teclado
            });
            
            // Llama a renderKeyboard inicialmente si deseas mostrar un teclado predeterminado
            if (languageSelect.value) {
                viewKeyboard(languageSelect.value);
            }
        } else {
            console.error('El elemento de selección de idioma no se encontró.');
        }
    });

    // Evento para iniciar el juego
    startGameButton.addEventListener('click', async () => {
        const languageSelect = document.getElementById('language'); 
        const selectedLanguage = languageSelect ? languageSelect.value : null;
        const selectedLength = parseInt(wordLengthSelect.value, 10);
    
        if (selectedLanguage) {
            try {
                const validationResult = await validateLanguageFile(selectedLanguage, selectedLength);
    
                if (!validationResult.isValid) {
                    showAlert(`Error en el archivo de idioma: ${validationResult.error}`);
                    return; // Detener el flujo si hay error
                }

                // Verificar si hay palabras válidas
                if (!validationResult.validWords || validationResult.validWords.length === 0) {
                    showAlert("No hay palabras válidas de la longitud especificada para iniciar el juego.");
                    return; // Detener el flujo si no hay palabras válidas
                }

                document.querySelector('.selection-length').style.display = 'none';
                document.querySelector('.selection-language').style.display = 'none';
                document.getElementById('help-button').style.display = 'none';
                startGameButton.style.display = 'none';
                gameArea.style.display = 'block';
            
                viewKeyboard(selectedLanguage);
                generateLetterInputs(selectedLength, languageSelect.value);
                updateBackButton();
            } catch (error) {
                console.error('Error en la validación:', error);
                showAlert("Hubo un problema al validar el archivo de idioma.");
                return;
            }
        }
    });
    
    // Evento para cuando se presiona el botón "Regresar"
    backToMenuButton.addEventListener('click', () => {
        showExitConfirmation(
            "Vas a salir de la partida. ¿Estás seguro/a?",
            () => {
                location.reload(); // Si confirma, recargar la página
            },
            () => {
                console.log("Salida cancelada."); // Si cancela, no hacer nada
            }
        );
    });

    // Agregar el listener para el botón de ayuda
    const helpButton = document.getElementById('help-button'); // Obtener el botón de ayuda
    if (helpButton) {
        helpButton.addEventListener('click', showInstructions); // Asignar la función showInstructions al clic
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeModal); // Asignar la función closeModal al clic
    }

    if (modalButton) {
        modalButton.addEventListener('click', closeModal); // Asignar la función closeModal al clic
    }
});
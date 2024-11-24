import { fetchConfirmationTranslations } from './loadLanguages.js';

// Función para mostrar el modal con contenido personalizado
function showModal(content, buttonText = "Cerrar") {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const modalButton = document.getElementById('modal-button');

    modalBody.innerHTML = content; // Establecer el contenido del modal
    modalButton.innerText = buttonText; // Establecer el texto del botón
    modalButton.style.display = 'inline-block';
    modal.style.display = 'block'; // Mostrar el modal
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none'; // Ocultar el modal
}

// Ejemplo de uso del modal para mostrar instrucciones
function showInstructions() {
    const instructions = `
    <div style="max-width: 900px; margin: 0 auto; padding: 30px; background-color: #2A2A2A; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 255, 198, 0.2); font-family: 'Arial', sans-serif; color: #FFFFFF;">
        <h2 style="text-align: justify; font-family: 'Georgia', serif; color: #00FFC6;">Instrucciones del Juego</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 30px;">
            <!-- Columna 1: Funcionamiento del Juego -->
            <div style="flex: 1; min-width: 280px; padding: 20px; background-color: #333333; border-radius: 10px; box-shadow: 0 2px 6px rgba(0, 255, 198, 0.15);">
                <h3 style="font-family: 'Verdana', sans-serif; color: #00FFC6; text-align: justify;">Funcionamiento del Juego</h3>
                <p style="text-align: justify; color: #FFFFFF;">El juego comienza eligiendo la longitud de la palabra (de 3 a 10 letras) y el idioma. Por defecto, tenemos dos opciones: <strong>ESPAÑOL</strong> e <strong>INGLÉS</strong>, pero puedes añadir más siguiendo las instrucciones a la derecha.</p>
                <p style="text-align: justify; color: #FFFFFF;">Una vez que inicias el juego, verás la longitud elegida y un teclado virtual que se ajusta automáticamente al idioma seleccionado.</p>
                <p style="text-align: justify; color: #FFFFFF;">Las reglas son sencillas: dispones de <strong>5 vidas</strong> fijas. Usa los colores como pistas:</p>
                <ul style="text-align: justify; color: #FFFFFF;">
                    <li><span style="color: #00FFC6;">Verde</span>: letra correcta y en la posición correcta.</li>
                    <li><span style="color: #FFDB58;">Amarillo</span>: letra correcta pero en la posición incorrecta.</li>
                    <li><span style="color: #FF5E57;">Rojo</span>: letra incorrecta.</li>
                </ul>
                <p style="text-align: justify; color: #FFFFFF;">Intenta adivinar la palabra utilizando estas pistas. Si no aciertas, aparecerá la palabra buscada; si aciertas, ¡todo se marcará en verde!</p>
            </div>
            
            <!-- Columna 2: Pasos para Añadir Idiomas -->
            <div style="flex: 1; min-width: 280px; padding: 20px; background-color: #333333; border-radius: 10px; box-shadow: 0 2px 6px rgba(0, 255, 198, 0.15);">
                <h3 style="font-family: 'Verdana', sans-serif; color: #00BFFF; text-align: justify;">Pasos para Añadir Idiomas Nuevos</h3>
                <p style="text-align: justify; color: #FFFFFF;">Si deseas añadir nuevos idiomas al juego, sigue estos pasos:</p>
                <ol style="text-align: justify; color: #FFFFFF;">
                    <li>Ubicación de Archivos:
                        <ul style="text-align: justify; color: #FFFFFF;">
                            <li>Todos los archivos de idioma deben añadirse en la carpeta <strong>[Idiomas]</strong>. Por defecto, encontrarás los archivos correspondientes a <strong>ESPAÑOL</strong> e <strong>INGLÉS</strong>.</li>
                            <li>Para crear un nuevo idioma, debes nombrar el archivo con el formato exacto <strong>[idioma_[abreviación]]</strong>. Los idiomas disponibles son: Francés, Portugués, Alemán, Italiano, Euskera, Catalán y Gallego.</li>
                        </ul>
                    </li>
                    <li>Creación de Palabras:
                        <ul style="text-align: justify; color: #FFFFFF;">
                            <li>En cada archivo de idioma, puedes incluir la cantidad de palabras que desees. Es fundamental que las palabras correspondan al idioma del archivo.</li>
                            <li>Asegúrate de que el fichero contenga las palabras en forma de lista. Puedes revisar los archivos por defecto para entender mejor el formato adecuado.</li>
                            <li>Si seleccionas una longitud de palabra que no coincide con ninguna palabra guardada, el juego te indicará que no hay palabras disponibles con esa longitud.</li>
                            <li>Si hay caracteres no identificados en el archivo, se mostrará el carácter y la línea donde aparece.</li>
                            <li>El juego mostrará un error si se incluye una palabra que no pertenece al idioma correspondiente del archivo.</li>
                        </ul>
                    </li>
                </ol>
            </div>
        </div>

        <!-- Sección de Notas Importantes -->
        <div style="padding: 20px; background-color: #3A3A3A; margin-top: 20px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0, 255, 198, 0.15);">
            <h3 style="font-family: 'Verdana', sans-serif; color: #FF5E57; text-align: justify;">Notas Importantes</h3>
            <ul style="text-align: justify; color: #FFFFFF;">
                <li>Si el juego indica que una palabra no pertenece al idioma, verifica que la palabra sea válida. Puede haber errores de detección, así que omite únicamente aquellas que el juego marca como problemáticas.</li>
                <li>Te animamos a que uses palabras que sean coherentes y que existan, ya que esto hace el juego más divertido. ¡Sé creativo!</li>
                <li>Si deseas ampliar la lista de idiomas o encuentras alguna falla, por favor avisa al creador del juego.</li>
            </ul>
        </div>
    </div>`;
    showModal(instructions);
}

// Ejemplo de uso del modal para mostrar un mensaje de alerta
function showAlert(message) {
    const alertMessage = `<h2 style="color: #FFFFFF;">Alerta</h2><p style="color: #FFFFFF;">${message}</p>`;
    showModal(alertMessage, "Entendido");
}

// Ejemplo de uso del modal para mostrar la palabra revelada al perder
function showRevealWord(selectedWord) {
    const revealMessage = `<h2 style="color: #FFFFFF;">Fin del Juego</h2><p style="color: #FFFFFF;">Se han agotado los intentos. La palabra era: <strong>${selectedWord}</strong></p>`;
    showModal(revealMessage, "Cerrar");
}

// Función para mostrar el modal de confirmación de salida con traducción
async function showExitConfirmation(message, onConfirm, onCancel) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const modalButton = document.getElementById('modal-button');

    // Obtener traducción de "Sí" y "No" según el idioma
    const { yes, no } = await fetchConfirmationTranslations();

    // Configurar el contenido del modal con los botones traducidos
    modalBody.innerHTML = `
        <div style="text-align: center; color: #FFFFFF;">
            <h2 style="margin-bottom: 20px;">Confirmación</h2>
            <p style="margin-bottom: 30px;">${message}</p>
            <div style="display: flex; justify-content: center; gap: 30px;">
                <button id="confirm-yes" style="padding: 10px 30px; background-color: #00FFC6; border: none; color: #000; border-radius: 5px; cursor: pointer;">${yes}</button>
                <button id="confirm-no" style="padding: 10px 30px; background-color: #FF5E57; border: none; color: #FFFFFF; border-radius: 5px; cursor: pointer;">${no}</button>
            </div>
        </div>
    `;

    modalButton.style.display = 'none'; // Ocultar el botón "Cerrar" en la confirmación de salida
    modal.style.display = 'block'; // Mostrar el modal

    // Agregar eventos a los botones
    document.getElementById('confirm-yes').onclick = () => {
        onConfirm(); // Ejecutar la función de confirmación
        closeModal(); // Cerrar el modal
    };

    document.getElementById('confirm-no').onclick = () => {
        onCancel(); // Ejecutar la función de cancelación
        closeModal(); // Cerrar el modal
    };
}

export { showInstructions, showAlert, showRevealWord, closeModal, showExitConfirmation }
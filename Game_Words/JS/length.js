import { getKeyboardAndSpecialChars } from './keyboards.js';
import { showAlert, showRevealWord } from './modal.js';

const letterSelectionContainer = document.getElementById('letter-selection-container');
let attemptCount = 0; // Contador de intentos
let maxAttempts = 5;  // Límite máximo de intentos
let allowedChars = []; // Lista de caracteres permitidos
let gameActive = true; // Controla si el juego está activo
let focusedInput = null;

// Función para configurar caracteres permitidos en tiempo real
function setAllowedCharacters(language) {
    console.log("Idioma seleccionado:", language);
    const { defaultKey, specialLen } = getKeyboardAndSpecialChars(language);
    allowedChars = (defaultKey || []).flat().concat(specialLen || []);
}

// Función para generar inputs de letras según la longitud seleccionada
function generateLetterInputs(length, abbreviation) {
    letterSelectionContainer.innerHTML = ''; // Limpiar inputs anteriores
    attemptCount = 0; // Reiniciar intentos al comenzar el juego
    gameActive = true; // Reactivar el juego

    setAllowedCharacters(abbreviation);
    addAttemptRow(length); // Crear la primera fila de inputs
}

// Función para agregar una nueva fila de inputs para cada intento
function addAttemptRow(length) {
    if (!gameActive) return; // Si el juego ha terminado, no agregar más filas

    attemptCount++;

    const attemptRow = document.createElement('div');
    attemptRow.classList.add('attempt-row');
    attemptRow.dataset.attempt = attemptCount;

    for (let i = 0; i < length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('input-letter');
        input.maxLength = 1;

        // Actualizamos el input actual cuando es enfocado
        input.addEventListener('focus', function() {
            focusedInput = input;  // Guardar el input enfocado
            console.log("Enfocado:", focusedInput);
        });

        // Validación en tiempo real de las teclas permitidas
        input.addEventListener('input', function(event) {
            const value = event.target.value.toUpperCase();
            if (value !== '' && !allowedChars.includes(value)) {
                event.target.value = '';
                showAlert("Carácter no permitido para el idioma seleccionado.");
            } else if (value.length === 1) {
                // Mover al siguiente input cuando se complete el actual
                const nextInput = input.nextElementSibling;
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });

        attemptRow.appendChild(input);

        // Modificar la lógica del evento "keydown" para capturar el "Backspace"
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Backspace') {
                // Si el campo actual está vacío, mover al input anterior
                if (event.target.value === '') {
                    const prevInput = input.previousElementSibling;
                    if (prevInput) {
                        prevInput.focus();
                    }
                }
            } else if (event.key === 'ArrowLeft') {
                // Mover al input anterior si no estamos en el primero
                const prevInput = input.previousElementSibling;
                if (prevInput) {
                    prevInput.focus();
                }
            } else if (event.key === 'ArrowRight') {
                // Mover al siguiente input si no estamos en el último
                const nextInput = input.nextElementSibling;
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });
    }

    letterSelectionContainer.appendChild(attemptRow);
    focusFirstInput(attemptRow);
    
    // Capturar intento al presionar Enter
    attemptRow.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            captureAttempt(attemptRow); // Solo capturar intento si fue manejado correctamente
        }
    });
}

// Función para capturar el intento actual y agregar una nueva fila si no es correcto
async function captureAttempt(row) {
    // if (!gameActive) return; // Si el juego ha terminado, no capturar intentos

    const letters = [];
    const inputs = row.querySelectorAll('.input-letter');
    let isComplete = true;

    inputs.forEach(input => {
        const value = input.value.toUpperCase();
        if (value === '') isComplete = false;
        letters.push(value || '_');
    });

    if (!isComplete) {
        showAlert("Completa todos los espacios antes de continuar.");
        return;
    }

    // Bloquear edición de inputs después de confirmar
    inputs.forEach(input => input.readOnly = true);

    const userInput = letters.join('');
    console.log("Intento ingresado:", userInput);

    await checkLetterWithServer(userInput, row);
}

// Función para hacer la solicitud al servidor usando async/await
async function checkLetterWithServer(userInput, row) {
    try {
        const response = await fetch('http://127.0.0.1:5000/letter_check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: userInput,
                attemptCount: attemptCount // Añade el conteo de intentos al body
            })
        });

        if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);

        const data = await response.json();
        console.log("Resultado de la verificación:", data.result);

        applyColors(row, data.result);

        if (data.isCorrect) {
            gameActive = false; // Detener el juego si es correcto
            showAlert("¡Felicidades! Has acertado la palabra.");
        } else if (attemptCount >= maxAttempts) {
            revealWord(data.selectedWord); // Revelar la palabra si se agotan los intentos
        } else {
            addAttemptRow(userInput.length); // Agregar una nueva fila si quedan intentos
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para enfocar el primer input de la fila actual
function focusFirstInput(row) {
    let firstInput = row.querySelector('.input-letter');
    if (firstInput) {
        firstInput.focus();
    }
}

function getFocusedInput() {
    return focusedInput;
}

// Función para aplicar colores a los inputs según el resultado
function applyColors(row, colors) {
    const inputs = row.querySelectorAll('.input-letter');
    inputs.forEach((input, index) => {
        input.style.backgroundColor = '';
        input.style.borderColor = '';

        switch(colors[index]) {
            case 'green':
                input.style.backgroundColor = 'rgba(0, 255, 0, 0.3)'; // Verde suave
                input.style.borderColor = 'green'; // Borde fuerte
                break;
            case 'yellow':
                input.style.backgroundColor = 'rgba(255, 255, 0, 0.3)'; // Amarillo suave
                input.style.borderColor = 'goldenrod'; // Borde fuerte
                break;
            case 'red':
                input.style.backgroundColor = 'rgba(255, 0, 0, 0.3)'; // Rojo suave
                input.style.borderColor = 'darkred'; // Borde fuerte
                break;
        }
    });
}

// Función para revelar la palabra al agotarse los intentos
function revealWord(selectedWord) {
    showRevealWord(selectedWord);
    gameActive = false; // Desactivar el juego
}

function processGame() {
    return gameActive; // Retorna true si el juego está activo, false si ha terminado
}

// Exportar la función para su uso en otros archivos
export { generateLetterInputs, processGame, captureAttempt, getFocusedInput };
import { processGame, captureAttempt, getFocusedInput } from './length.js';

// Estructura de caracteres especiales
const specialCharacters = {
    ES: ['Ñ', 'Á', 'É', 'Í', 'Ó', 'Ú', 'Ü'], // Español
    FR: ['À', 'É', 'È', 'Ê', 'Ô', 'Ù', 'Ç'], // Francés
    PT: ['Ç', 'Ã', 'Õ', 'Á', 'É', 'Í', 'Ó', 'Ú'], // Portugués
    DE: ['Ä', 'Ö', 'Ü', 'ß'], // Alemán
    IT: ['À', 'È', 'É', 'Ì', 'Ò', 'Ù'], // Italiano
    CA: ['À', 'É', 'È', 'Í', 'Ó', 'Ú'], // Catalán
    GL: ['Ñ', 'Á', 'É', 'Í', 'Ó', 'Ú', 'Ü'], // Gallego
};

// Mapeo de caracteres especiales para reutilizar
const mapping = {
    EU: 'ES', // Euskera se mapea al teclado español
};

// Función para obtener los caracteres especiales, utilizando el mapeo
function mapeoLen(abbreviation) {
    return specialCharacters[mapping[abbreviation] || abbreviation] || [];
}

// Función para obtener el diseño del teclado y caracteres especiales
function getKeyboardAndSpecialChars(abbreviation) {
    let defaultKey = [];
    let specialLen =  mapeoLen(abbreviation);

    switch (abbreviation) {
        case 'ES':
        case 'EN':
        case 'PT':
        case 'IT':
        case 'CA':
        case 'VE':
        case 'GL':
        case 'EU':
            defaultKey = [ // Asigna el diseño QWERTY
                ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
                ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
                ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
            ];
            break;
        case 'FR':
            defaultKey = [ // Asigna el diseño AZERTY
                ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
                ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
                ['W', 'X', 'C', 'V', 'B', 'N']
            ];
            break;
        case 'DE':
            defaultKey = [ // Asigna el diseño QWERTZ
                ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P'],
                ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
                ['Y', 'X', 'C', 'V', 'B', 'N', 'M']
            ];
            break;
    }

    return { defaultKey, specialLen };
}

// Elementos HTML
const keyboardContainer = document.getElementById('keyboard');

function insertLetterInInput(letter) {
    // Obtener el input actualmente enfocado
    const focusedInput = getFocusedInput();
    
    // Asegurarse de que el input esté en la última fila de intentos
    const lastRow = document.querySelector('.attempt-row:last-child');

    if (focusedInput && lastRow && lastRow.contains(focusedInput)) {
        if (focusedInput.classList.contains('input-letter') && focusedInput.value === '') {
            focusedInput.value = letter;

            // Mover el foco al siguiente input vacío en la última fila
            moveToNextEmptyInput(focusedInput, lastRow);
        }
    }
}

// Mueve el foco al siguiente input vacío en la última fila actual
function moveToNextEmptyInput(currentInput, currentRow) {
    const inputs = Array.from(currentRow.querySelectorAll('.input-letter'));
    const currentIndex = inputs.indexOf(currentInput);

    // Buscar el siguiente input vacío a partir de la posición actual
    for (let i = currentIndex + 1; i < inputs.length; i++) {
        if (inputs[i].value === '') {
            inputs[i].focus();
            return;
        }
    }

    // Si no hay inputs vacíos después del actual, se enfoca el primero vacío en la fila
    const firstEmptyInput = inputs.find(input => input.value === '');
    if (firstEmptyInput) {
        firstEmptyInput.focus();
    }
}

// Función para mostrar el teclado según el idioma seleccionado
function viewKeyboard(language) {
    keyboardContainer.innerHTML = ''; // Limpiar teclado

    const { defaultKey, specialLen } = getKeyboardAndSpecialChars(language);

    // Variables para los botones "Delete" y "Enter" con símbolos
    const deleteSymbol = '⌫'; // Símbolo de borrar
    const enterSymbol = '⏎'; // Símbolo de Enter

    defaultKey.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('keyboard-row');

        // Añadir botones y modificar si es la segunda o tercera fila
        row.forEach((key, keyIndex) => {
            const keyButton = document.createElement('button');
            keyButton.classList.add('key');
            keyButton.textContent = key;

            // Agregar listener para escribir la letra en el input seleccionado
            keyButton.addEventListener('click', () => insertLetterInInput(key));

            rowDiv.appendChild(keyButton);
        });

        // Colocación de botones "Delete" y "Enter"
        if (rowIndex === 1) {
            // Agregar el botón de borrar al final de la segunda fila
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('key', 'delete-key');
            deleteButton.textContent = deleteSymbol;
            deleteButton.addEventListener('click', handleDeletePress);
            rowDiv.appendChild(deleteButton);
        }
        if (rowIndex === 2) {
            // Agregar el botón de Enter al final de la última fila
            const enterButton = document.createElement('button');
            enterButton.classList.add('key', 'enter-key');
            enterButton.textContent = enterSymbol;
            enterButton.addEventListener('click', handleEnterPress);
            rowDiv.appendChild(enterButton);
        }

        keyboardContainer.appendChild(rowDiv);
    });

    // Agregar fila para caracteres especiales si existen
    if (specialLen.length > 0) {
        const specialContainer = document.createElement('div');
        specialContainer.classList.add('special-container');

        const specialRowDiv = document.createElement('div');
        specialRowDiv.classList.add('special-row');

        specialLen.forEach(char => {
            const charButton = document.createElement('button');
            charButton.classList.add('key');
            charButton.textContent = char;

            // Listener para escribir el carácter especial en el input seleccionado
            charButton.addEventListener('click', () => insertLetterInInput(char));

            specialRowDiv.appendChild(charButton);
        });

        specialContainer.appendChild(specialRowDiv);
        keyboardContainer.appendChild(specialContainer);
    }
}

// Función que maneja la acción del botón "Enter"
function handleEnterPress() {
    console.log('Botón Enter presionado');
    const currentRow = document.querySelector('.attempt-row:last-child');
    if (!currentRow) return false; // Si no hay una fila de intentos, salimos

    captureAttempt(currentRow); // Capturar el intento
    return true;
}

function handleDeletePress() {
    if (!processGame()) return;

    const focusedInput = getFocusedInput();
    const lastRow = document.querySelector('.attempt-row:last-child');

    if (focusedInput && lastRow && lastRow.contains(focusedInput)) {
        if (focusedInput.classList.contains('input-letter')) {
            if (focusedInput.value !== '') {
                // Si el input actual tiene un valor, bórralo
                focusedInput.value = '';
            } else {
                // Si el input actual está vacío, mover el foco al input anterior con valor
                moveToPreviousFilledInput(focusedInput, lastRow);
            }
        }
    }
}

// Mueve el foco al input anterior con contenido en la última fila actual, si existe
function moveToPreviousFilledInput(currentInput, currentRow) {
    const inputs = Array.from(currentRow.querySelectorAll('.input-letter'));
    const currentIndex = inputs.indexOf(currentInput);

    // Buscar el input anterior con contenido a partir de la posición actual
    for (let i = currentIndex - 1; i >= 0; i--) {
        if (inputs[i].value !== '') {
            inputs[i].focus();
            return;
        }
    }

    // Si no hay inputs con contenido antes, enfocar el primer input vacío
    const firstEmptyInput = inputs.find(input => input.value === '');
    if (firstEmptyInput) {
        firstEmptyInput.focus();
    }
}

// Exportar la función para su uso en otros archivos
export { viewKeyboard };
export { mapeoLen };
export { getKeyboardAndSpecialChars };
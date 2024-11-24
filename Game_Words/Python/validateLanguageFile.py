import os
import re
import random
from flask import request, jsonify, current_app
from deep_translator import GoogleTranslator

# Ruta de directorio de idiomas
LANGUAGES_DIR = os.path.join(os.path.dirname(__file__), '../Idiomas')
# print(f"Ruta del directorio de idiomas: {LANGUAGES_DIR}")  # Imprimir ruta del directorio

# Inicializar el traductor
translator = GoogleTranslator()

def translate_to_english(word):
    """Traduce la palabra al inglés usando GoogleTranslator."""
    try:
        translated = GoogleTranslator(source='es', target='en').translate(word)
        print(f"Traducción de '{word}' a inglés: '{translated}'")
        return translated
    except Exception as e:
        print(f"Error al traducir '{word}' a inglés: {e}")
        return None

def translate_back(word, target_language):
    """Traduce la palabra de vuelta al idioma especificado usando GoogleTranslator y compara."""
    if word is None or word.strip() == "":
        return None

    try:
        # Traducir de vuelta al idioma especificado
        translated_back = GoogleTranslator(source='en', target=target_language.lower()).translate(word)
        print(f"Traducción de '{word}' de vuelta a '{target_language}': '{translated_back}'")
        return translated_back
    except Exception as e:
        print(f"Error al traducir '{word}' de vuelta a '{target_language}': {e}")
        return None

def translate_regresar():
    data = request.get_json()
    abbreviation = data.get('abbreviation')  # Idioma seleccionado (por ejemplo 'en' para inglés)

    if not abbreviation:
        return jsonify({"error": "No se especificó el idioma."}), 400  # Añadir un control de errores aquí

    # Traducir la palabra "Regresar" al idioma seleccionado
    translated_word = translate_back("Go back", abbreviation)

    print(f"Traducción de ES a '{abbreviation}': '{translated_word}'")
    return jsonify({"translated": translated_word})

def translate_confirmation():
    data = request.get_json()
    abbreviation = data.get('abbreviation')  # Idioma seleccionado (por ejemplo 'en' para inglés)

    if not abbreviation:
        return jsonify({"error": "No se especificó el idioma."}), 400  # Control de error

    # Palabras a traducir
    words_to_translate = ["Yes", "No"]

    # Usar translate_back para traducir cada palabra
    translated_words = {}
    for word in words_to_translate:
        translated_word = translate_back(word, abbreviation)  # Traducir con función translate_back
        if word == "Yes":
            translated_words['yes'] = translated_word
        elif word == "No":
            translated_words['no'] = translated_word

    print(f"Traducción de ES a '{abbreviation}': Yes -> '{translated_words['yes']}', No -> '{translated_words['no']}'")
    return jsonify(translated_words)

def validate_and_select_words():
    
    if request.method == 'OPTIONS':
        return jsonify({"status": "OK"}), 200

    # Obtener JSON de la solicitud
    data = request.get_json()
    abbreviation = data.get('abbreviation')
    special_characters = data.get('specialCharacters', [])
    word_length = data.get('wordLength')

    # print("Abreviación recibida:", abbreviation)
    # print("Caracteres especiales recibidos:", special_characters)
    # print("Longitud de palabra solicitada:", word_length)

    # Ruta del archivo de idioma
    language_file_path = os.path.join(LANGUAGES_DIR, f'idioma_{abbreviation}.txt')
    # print(f"Intentando cargar archivo de idioma desde: {language_file_path}")  # Imprimir la ruta del archivo de idioma

    # Leer el archivo, validar y seleccionar palabras
    valid_words = []  # Lista para almacenar las palabras válidas de la longitud requerida
    with open(language_file_path, 'r', encoding='utf-8') as file:
        for index, line in enumerate(file):
            word = line.strip().upper()  # Limpiar espacios y convertir a mayúsculas

            # Validar cada carácter en la palabra
            char_count = 0  # Contador de caracteres válidos
            for char in word:
                if re.match(r'^[A-Z]$', char) or char in special_characters:
                    char_count += 1
                else:
                    return jsonify({"isValid": False, "error": f"Caracter no válido '{char}' en la palabra '{word}' en la línea {index + 1}."}), 400
            
            if char_count == word_length:
                valid_words.append(word)

    # Debug: Mostrar las palabras válidas encontradas
    # print("Palabras válidas encontradas:", valid_words)

    if not valid_words:
        return jsonify({"isValid": True, "message": "No hay palabras de la longitud especificada para jugar."}), 200

    # Seleccionar una palabra aleatoria de las válidas para el juego
    selected_word = random.choice(valid_words)
    current_app.config['SELECTED_WORD'] = selected_word
    # print("Palabra seleccionada para el juego:", selected_word)

    # Comparar para validar
    if translate_back(translate_to_english(selected_word), abbreviation).lower() != selected_word.lower():
        return jsonify({
            "isValid": False,
            "error": f"La palabra '{selected_word}' no es válida para el idioma '{abbreviation}'."
        }), 400

    return jsonify({"isValid": True, "selectedWord": selected_word, "validWords": valid_words}), 200
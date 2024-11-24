from flask import jsonify
import os

# Ruta de directorio de idiomas
LANGUAGES_DIR = os.path.join(os.path.dirname(__file__), '../Idiomas')

# Diccionario de abreviaturas y nombres completos de idiomas
LANGUAGE_NAMES = {
    'ES': 'Español',
    'EN': 'Inglés',
    'FR': 'Francés',
    'PT': 'Portugués',
    'DE': 'Alemán',
    'IT': 'Italiano',
    'EU': 'Euskera',
    'CA': 'Catalán',
    'GL': 'Gallego',
}

def get_language_name(abbreviation):
    """Devuelve el nombre completo del idioma según la abreviatura."""
    return LANGUAGE_NAMES.get(abbreviation, abbreviation)

def get_languages_dict():
    """Devuelve un diccionario con los idiomas disponibles, sin formato JSON."""
    languages = {}
    try:
        for filename in os.listdir(LANGUAGES_DIR):
            if filename.startswith('idioma_') and filename.endswith('.txt'):
                abbreviation = filename.split('_')[1].split('.')[0].upper()
                if abbreviation in LANGUAGE_NAMES:
                    languages[abbreviation] = get_language_name(abbreviation)
    except FileNotFoundError:
        print(f"La carpeta {LANGUAGES_DIR} no se encontró. Asegúrate de que la ruta es correcta.")
    
    return languages

def get_languages():
    """Devuelve un JSON con los idiomas disponibles para el frontend."""
    languages_dict = get_languages_dict()
    return jsonify(languages_dict)
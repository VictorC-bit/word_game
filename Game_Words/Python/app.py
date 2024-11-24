from flask import Flask
from flask_cors import CORS
from language import get_languages
from validateLanguageFile import validate_and_select_words, translate_regresar, translate_confirmation
from letter_check import letter_check  # Importar el endpoint para la verificación

# Crear instancia principal de Flask
app = Flask(__name__)

# Configurar una clave inicial para selected_word
app.config['SELECTED_WORD'] = None

# Configurar CORS permitiendo las solicitudes desde el origen necesario
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5500"}})

# Registrar las rutas
app.add_url_rule('/api/language', view_func=get_languages)
app.add_url_rule('/validate', view_func=validate_and_select_words, methods=['POST', 'OPTIONS'])
app.add_url_rule('/letter_check', view_func=letter_check, methods=['POST'])  # Asegúrate de registrar esta ruta
app.add_url_rule('/translate-regresar', view_func=translate_regresar, methods=['POST'])
app.add_url_rule('/translate_confirmation', view_func=translate_confirmation, methods=['POST'])

if __name__ == '__main__':
    app.run(debug=True)
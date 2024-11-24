from flask import request, jsonify, current_app

def letter_check():
    """Verifica el intento del jugador y devuelve el resultado."""
    data = request.get_json()
    guess_word = data.get('input', '').upper()
    
    selected_word = current_app.config.get('SELECTED_WORD')

    # Asegúrate de que selected_word está inicializada correctamente
    if selected_word is None:
        return jsonify({'error': 'No hay palabra seleccionada para verificar.'}), 500

    response = []

    # Si la palabra es correcta, llena el resultado con 'green'
    if guess_word == selected_word:
        response = ['green'] * len(selected_word)
        return jsonify({
            'result': response,
            'isCorrect': True,   # Señala que la palabra es correcta
            'selectedWord': selected_word
        })

    for i, char in enumerate(guess_word):
        if char == selected_word[i]:
            response.append('green')
        elif char in selected_word:
            response.append('yellow')
        else:
            response.append('red')

    # Verifica si los intentos están agotados y añade selectedWord en ese caso
    max_attempts = 5  # Puedes ajustar el número máximo de intentos aquí
    is_last_attempt = data.get('attemptCount', 0) >= max_attempts

    return jsonify({
        'result': response,
        'isCorrect': False,   # La palabra no es correcta
        'selectedWord': selected_word if is_last_attempt else None
    })
import logging
from flask import Flask, render_template
from flask_socketio import SocketIO, emit

log = logging.getLogger(__name__)
app = Flask(__name__,
            static_folder='./templates/public',
            template_folder="./templates/static")
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

socketio = SocketIO(app)


@app.route('/')
def index():
    return render_template('index.html')


# @app.route('/game/<game_code>')
# def game(game_code):
#     join_room(game_code)
#     return render_template('index.html')

@socketio.on('connect')
def test_connect():
    emit('my response', {'data': 'Connected'}, broadcast=True)


if __name__ == '__main__':
    socketio.run(app)

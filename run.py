import logging
from flask import Flask, render_template
from flask_socketio import SocketIO, emit, join_room

log = logging.getLogger(__name__)
app = Flask(__name__,
            static_folder='./templates/public',
            template_folder="./templates/static")
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

socketio = SocketIO(app)


@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('Register_Socket_Connection')
def register_socket_client(data):
    game_code = data['gameCode']
    print(f'Registering Connection for game code: {game_code}')
    join_room(game_code)


@socketio.on('Create_Player')
def create_player(player_name):
    print(f'Player {player_name} joined the game.')
    emit('Player_Joined', {'playerName': player_name}, broadcast=True)


@socketio.on('connect')
def test_connect():
    print('Received New Socket Connection')


if __name__ == '__main__':
    socketio.run(app)

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
def register_socket_client(game_code):
    print(f'Registering Connection for game code: {game_code}')
    join_room(game_code)


@socketio.on('Create_Player')
def create_player(data):
    player_name = data['playerName']
    game_code = data['gameCode']
    print(f'Player {player_name} joined the game.')
    emit('Player_Joined', {'playerName': player_name}, room=game_code)


@socketio.on('Update_Player_Set')
def update_player_set(data):
    players = data['players']
    game_code = data['gameCode']
    print(f'Host updated players to {players}')
    emit('Host_Updated_Player_Set', players, room=game_code)


@socketio.on('connect')
def test_connect():
    print('Received New Socket Connection')


if __name__ == '__main__':
    socketio.run(app)

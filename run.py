import logging
import flask
from flask_socketio import SocketIO, emit, join_room, leave_room, rooms

from templates import app
from templates.src import api

log = logging.getLogger(__name__)
socketio = SocketIO(app)

# sid_name_mapping = {}


@app.route('/')
def index():
    return flask.render_template('index.html')


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
    # sid_name_mapping[flask.request.sid] = player_name


@socketio.on('Update_Player_Set')
def update_player_set(data):
    players = data['players']
    game_code = data['gameCode']
    print(f'Host updated players to {players}')
    emit('Host_Updated_Player_Set', players, room=game_code)


@socketio.on('Huddle_Finished')
def assign_roles(data):
    players = data['players']
    game_code = data['gameCode']
    roles_in_game = data['rolesInGame']
    print(f'Beginning role assignment for game {game_code}')
    role_data = api.create_initial_role_assignments(players, roles_in_game)
    emit('Assigned_Roles', role_data, room=game_code)


@socketio.on('Confirm_Player')
def confirm_player(data):
    game_code = data['gameCode']
    player_name = data['playerName']
    print(f'Player {player_name} confirmed role')
    emit('Role_Confirmation_Count_Updated', room=game_code)


@socketio.on('Confirmation_Finished')
def confirm_player(data):
    game_code = data['gameCode']
    roles_in_game = data['rolesInGame']
    next_turn = api.get_next_turn_role(roles_in_game)
    print(f'Next Turn: {next_turn}')
    data = {
        'nextTurn': next_turn,
    }
    emit('Begin_Player_Turn', data, room=game_code)


@socketio.on('Player_Turn_Finish')
def player_turn_finish(data):
    game_code = data['gameCode']
    previous_turn = data['previousTurn']
    roles_in_game = data['rolesInGame']
    next_turn = api.get_next_turn_role(roles_in_game, previous_turn=previous_turn)
    print(f'Next Turn: {next_turn}')
    if next_turn:
        data = {
            'nextTurn': next_turn,
        }
        emit('Begin_Player_Turn', data, room=game_code)
    else:
        emit('Night_Finished', room=game_code)


# @socketio.on('disconnect')
# def handle_player_left():
#     player_name = sid_name_mapping[flask.request.sid]
#     for r in rooms():
#         leave_room(r)
#         print(f'Player {player_name} has left the game')
#         emit('Player_Left', {'playerName': player_name}, room=r)
#     del sid_name_mapping[flask.request.sid]


@socketio.on('connect')
def test_connect():
    print('Received New Socket Connection')


if __name__ == '__main__':
    socketio.run(app)

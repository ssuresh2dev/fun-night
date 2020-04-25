import logging
import flask
from flask_socketio import SocketIO, emit, join_room, leave_room
import random

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


@socketio.on('Update_Player_Set')
def update_player_set(data):
    players = data['players']
    game_code = data['gameCode']
    host_name = data['hostName']
    print(f'Host updated players to {players}')
    data = {
        'allPlayers': players,
        'hostName': host_name
    }
    emit('Host_Updated_Player_Set', data, room=game_code)


@socketio.on('Huddle_Finished')
def assign_roles(data):
    players = data['players']
    game_code = data['gameCode']
    roles_in_game = data['rolesInGame']
    print(f'Beginning role assignment for game {game_code}')
    role_data = api.create_initial_role_assignments(players, roles_in_game)
    data = {
        'roleData': role_data,
        'rolesInGame': roles_in_game
    }
    print(data)
    emit('Assigned_Roles', data, room=game_code)


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


@socketio.on('Werewolf_Designated')
def werewolf_designated(data):
    game_code = data['gameCode']
    player = data['player']
    role_data = data['roleData']
    role_data['goldenWolf'] = player
    data = {
        'roleData': role_data,
    }
    emit('Role_Assignments_Updated', data, room=game_code)


@socketio.on('Role_Switch')
def switch_roles(data):
    game_code = data['gameCode']
    source = data['sourcePlayer']
    target = data['targetPlayer']
    role_data = data['roleData']
    executing_role = data['executingRole']
    data = {
        'roleData': api.switch_roles(source, target, executing_role, role_data)
    }
    emit('Role_Assignments_Updated', data, room=game_code)


@socketio.on('Player_Ready_To_Vote')
def ready_to_vote(data):
    game_code = data['gameCode']
    player_name = data['player']
    print(f'Player {player_name} ready to vote')
    emit('Ready_To_Vote_Count_Updated', room=game_code)


@socketio.on('Player_Voted')
def player_voted(data):
    game_code = data['gameCode']
    player_name = data['player']
    print(f'Received vote for Player {player_name}')
    data = {
        'voteFor': player_name
    }
    emit('Vote_Updated', data, room=game_code)


@socketio.on('Vote_Finished')
def vote_finished(data):
    game_code = data['gameCode']
    votes_for = data['votesFor']
    role_data = data['roleData']
    winners, players_killed = api.get_winning_team_and_players(votes_for, role_data)
    data = {
        'winners': winners,
        'playersKilled': players_killed
    }
    print(data)
    print('Calculated Results')
    emit('Results_Calculated', data, room=game_code)


@socketio.on('Player_Left')
def player_left(data):
    game_code = data['gameCode']
    player_name = data['playerName']
    all_players = data['allPlayers']
    all_players.remove(player_name)
    host = data['host']
    data = {
        'allPlayers': all_players
    }
    if host:
        data['hostName'] = random.sample(all_players, 1)

    emit('Host_Updated_Player_Set', data, room=game_code)
    leave_room(game_code)


@socketio.on('Player_Requested_Podcaster_Vote')
def podcast_vote_requested(data):
    game_code = data['gameCode']
    player_name = data['player']
    print(f'{player_name} requested Podcaster vote')
    data = {
        'playerName': player_name
    }
    emit('Podcast_Vote_Requested', data, room=game_code)


@socketio.on('Podcast_Vote')
def podcast_vote(data):
    game_code = data['gameCode']
    vote = data['vote']
    print(f'Podcaster Vote: {vote}')
    data = {
        'vote': vote
    }
    emit('Podcast_Votes_Updated', data, room=game_code)


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

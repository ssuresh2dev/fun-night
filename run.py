import logging
import flask
from flask_socketio import SocketIO, emit, join_room, leave_room
import random
import copy
from datetime import datetime

from templates import app
from templates.src import api

import eventlet
eventlet.monkey_patch()

log = logging.getLogger(__name__)
socketio = SocketIO(app, logger=True, cors_allowed_origins='*')


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
    data = {
        'playerName': player_name,
    }
    socketio.emit('Player_Joined', data, room=game_code, include_self=True)


@socketio.on('Rejoin_Player')
def rejoin_player(data):
    player_name = data['playerName']
    game_code = data['gameCode']
    print(f'Player {player_name} attempting to rejoin the game')
    data = {
        'playerName': player_name,
    }
    socketio.emit('Player_Requested_Rejoin', data, room=game_code, include_self=True)


@socketio.on('Resync_Data')
def resync_data(data):
    game_code = data['gameCode']
    print(f'Data Resync in Progress for Player {data["requestingPlayer"]}')
    socketio.emit('Resync_Data_Received', data, room=game_code, include_self=True)


@socketio.on('Update_Player_Set')
def update_player_set(data):
    player_configs = data['playerConfigs']
    game_code = data['gameCode']
    print(f'Host updated players to {list(player_configs.keys())}')
    data = {
        'playerConfigs': player_configs,
    }
    socketio.emit('Update_Player_Config', data, room=game_code, include_self=True)


@socketio.on('Huddle_Finished')
def assign_roles(data):
    player_configs = data['playerConfigs']
    game_code = data['gameCode']
    roles_in_game = data['rolesInGame']
    print(f'Beginning role assignment for game {game_code}')
    role_data = api.create_initial_role_assignments(list(player_configs.keys()), roles_in_game)
    data = {
        'roleData': role_data,
        'rolesInGame': roles_in_game
    }
    print(data)
    socketio.emit('Update_Role_Assignments', data, room=game_code, include_self=True)


@socketio.on('Confirm_Player')
def confirm_player(data):
    game_code = data['gameCode']
    player_name = data['playerName']
    player_config = data['playerConfig']
    copied = copy.deepcopy(player_config)
    copied['confirmedRole'] = True
    print(f'Player {player_name} confirmed role')
    data = {
        'playerConfig': copied,
        'playerName': player_name
    }
    socketio.emit('Update_Player_Config', data, room=game_code, include_self=True)


@socketio.on('Confirmation_Finished')
def confirm_player(data):
    game_code = data['gameCode']
    roles_in_game = data['rolesInGame']
    next_turn = api.get_next_turn_role(roles_in_game)
    print(f'Next Turn: {next_turn}')
    data = {
        'nextTurn': next_turn,
    }
    socketio.emit('Begin_Player_Turn', data, room=game_code, include_self=True)


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
        socketio.emit('Begin_Player_Turn', data, room=game_code, include_self=True)
    else:
        data = {
            'timestamp': datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        }
        socketio.emit('Night_Finished', data, room=game_code, include_self=True)


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
    socketio.emit('Update_Role_Assignments', data, room=game_code, include_self=True)


@socketio.on('Player_Ready_To_Vote')
def ready_to_vote(data):
    game_code = data['gameCode']
    player_name = data['player']
    player_config = data['playerConfig']
    print(f'Player {player_name} ready to vote')
    copied = copy.deepcopy(player_config)
    copied['readyToVote'] = True
    data = {
        'playerConfig': copied,
        'playerName': player_name
    }
    socketio.emit('Update_Player_Config', data, room=game_code, include_self=True)


@socketio.on('Player_Voted')
def player_voted(data):
    game_code = data['gameCode']
    player_name = data['playerName']
    player_config = data['playerConfig']
    voted_against = data['votedAgainst']
    copied = copy.deepcopy(player_config)
    copied['votedAgainst'] = voted_against
    print(f'Received vote for Player {voted_against}')
    data = {
        'playerConfig': copied,
        'playerName': player_name
    }
    socketio.emit('Update_Player_Config', data, room=game_code, include_self=True)


@socketio.on('Vote_Finished')
def vote_finished(data):
    game_code = data['gameCode']
    player_configs = data['playerConfigs']
    role_data = data['roleData']
    winners, players_killed = api.get_winning_team_and_players(player_configs, role_data)
    data = {
        'winners': winners,
        'playersKilled': players_killed
    }
    print(data)
    print('Calculated Results')
    socketio.emit('Results_Calculated', data, room=game_code, include_self=True)


@socketio.on('Player_Left')
def player_left(data):
    game_code = data['gameCode']
    player_name = data['playerName']
    player_configs = data['playerConfigs']
    host = data['host']
    data = {
        'playerName': player_name
    }
    if host:
        data['hostName'] = random.sample(list(player_configs.keys()), 1)

    socketio.emit('Update_Player_Config', data, room=game_code, include_self=True)
    leave_room(game_code)


@socketio.on('Player_Requested_Podcaster_Vote')
def podcast_vote_requested(data):
    game_code = data['gameCode']
    player_name = data['playerName']
    player_config = copy.deepcopy(data['playerConfig'])
    print(f'{player_name} requested Podcaster vote')
    player_config['podcastConfig']['claimStatus'] = 'Claimed'
    data = {
        'playerConfig': player_config,
        'playerName': player_name
    }
    socketio.emit('Update_Player_Config', data, room=game_code, include_self=True)


@socketio.on('Podcast_Vote')
def podcast_vote(data):
    game_code = data['gameCode']
    vote = data['vote']
    player_name = data['playerName']
    player_voted_on = data['playerVotedOn']
    player_voted_on_config = copy.deepcopy(data['playerVotedOnConfig'])
    print(f'Podcaster Vote: {vote}')
    if vote == 'Approved':
        player_voted_on_config['podcastConfig']['votesFor'].append(player_name)
    if vote == 'Approved':
        player_voted_on_config['podcastConfig']['votesAgainst'].append(player_name)
    num_votes_for = len(player_voted_on_config['podcastConfig']['votesFor'])
    num_votes_against = len(player_voted_on_config['podcastConfig']['votesAgainst'])
    num_total = len(list(player_voted_on_config.keys()))
    if num_votes_for + num_votes_against == num_total:
        if num_votes_for > (num_total // 2):
            player_voted_on_config['podcastConfig']['claimStatus'] = 'Approved'
        else:
            player_voted_on_config['podcastConfig']['claimStatus'] = 'Rejected'

    data = {
        'playerConfig': player_voted_on_config,
        'playerName': player_voted_on
    }
    socketio.emit('Update_Player_Config', data, room=game_code, include_self=True)


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
    socketio.run(app, debug=True)

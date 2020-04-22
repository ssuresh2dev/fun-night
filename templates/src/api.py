import random
import copy

from templates.src import constants


def create_initial_role_assignments(players, roles):
    random.shuffle(roles)
    num_players = len(players)
    current_assignments = {}
    original_role_mapping = {}
    center_roles = []
    for i in range(num_players + 3):
        if i < num_players:
            current_assignments[players[i]] = roles[i]
            original_role_mapping.setdefault(roles[i], []).append(players[i])
        else:
            center_roles.append(roles[i])
    return {
        'currentAssignments': current_assignments,
        'originalRoleMapping': original_role_mapping,
        'centerRoles': center_roles
    }


def get_next_turn_role(roles_in_game, previous_turn=None):
    begin_index = constants.ORDERED_NIGHT_ROLES.index(previous_turn) + 1 if previous_turn else 0
    for role in constants.ORDERED_NIGHT_ROLES[begin_index:]:
        if role in roles_in_game:
            return role

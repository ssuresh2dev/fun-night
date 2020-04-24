import random
import copy

from templates.src import constants


def create_initial_role_assignments(players, roles):
    random.shuffle(roles)
    num_players = len(players)
    current_assignments = {}
    original_role_mapping = {}
    center_roles = []
    golden_wolf = ''
    for role in constants.ALL_ROLES:
        if role in ['Werewolf', 'Mason', 'Villager']:
            original_role_mapping[role] = []
        else:
            original_role_mapping[role] = ''

    for i in range(num_players + 3):
        if i < num_players:
            current_assignments[players[i]] = roles[i]
            if roles[i] in ['Werewolf', 'Mason', 'Villager']:
                original_role_mapping[roles[i]].append(players[i])
            else:
                original_role_mapping[roles[i]] = players[i]
        else:
            center_roles.append(roles[i])
    if 'Werewolf' in original_role_mapping and len(original_role_mapping['Werewolf']) > 0:
        # Set one as the default in case no one chooses
        golden_wolf = original_role_mapping['Werewolf'][0]
    if 'Dog Whisperer' in original_role_mapping and len(original_role_mapping['Werewolf']) < 2:
        current_assignments[original_role_mapping['Dog Whisperer']] = 'Dog Whisperer -> Werewolf'

    random.shuffle(players)

    return {
        'currentAssignments': current_assignments,
        'originalRoleMapping': original_role_mapping,
        'centerRoles': center_roles,
        'goldenWolf': golden_wolf,
        'ordering': players
    }


def get_next_turn_role(roles_in_game, previous_turn=None):
    begin_index = constants.ORDERED_NIGHT_ROLES.index(previous_turn) + 1 if previous_turn else 0
    for role in constants.ORDERED_NIGHT_ROLES[begin_index:]:
        if role in roles_in_game:
            return role


def switch_roles(source_player, target_player, executor, role_data):
    new_data = copy.deepcopy(role_data)
    if executor == 'Agent of Chaos':
        aoc_player = source_player
        aoc_player_role = new_data['currentAssignments'][aoc_player]
        swapped_player = target_player
        swapped_player_role = new_data['currentAssignments'][swapped_player]
        if swapped_player_role in ['Werewolf', 'Minion', 'Dog Whisperer -> Werewolf']:
            new_swapped_player_role = aoc_player_role + ' -> Villager'
        elif swapped_player_role in ['Tanner', 'Boy Nextdoor']:
            new_swapped_player_role = aoc_player_role + ' -> ' + swapped_player_role
        elif 'Agent of Chaos' in swapped_player_role:
            # This happens if the inexplicable is executing this turn and chooses to swap with the person
            # who actually has the AOC card. We once again flip their role
            if 'Villager' in swapped_player_role:
                new_swapped_player_role = aoc_player_role + ' -> Werewolf'
            elif 'Werewolf' in swapped_player_role:
                new_swapped_player_role = aoc_player_role + ' -> Villager'
            else:
                new_swapped_player_role = aoc_player_role + ' -> ' + swapped_player_role
        else:
            new_swapped_player_role = aoc_player_role + ' ->  Werewolf'
        new_data['currentAssignments'][aoc_player] = swapped_player_role
        new_data['currentAssignments'][swapped_player] = new_swapped_player_role
    elif executor == 'Inexplicable':
        player = new_data['originalRoleMapping']['Inexplicable']
        if source_player == 'Inexplicable':
            # source and target are not players here, they're roles. Inexplicable is re-assigning self.
            new_data['currentAssignments'][player] = 'Inexplicable -> ' + target_player
        else:
            # Inexplicable has taken on another role and is performing it now.
            actual_role = new_data['currentAssignments'][player]
            if 'Inexplicable' in actual_role:
                assumed_role = actual_role.split(' -> ')[-1]
                if assumed_role == 'Agent of Chaos':
                    return switch_roles(source_player, target_player, 'Agent of Chaos', new_data)
                else:
                    return switch_roles(source_player, target_player, assumed_role, new_data)
            else:
                return switch_roles(source_player, target_player, actual_role, new_data)
    else:
        tmp = new_data['currentAssignments'][source_player]
        new_data['currentAssignments'][source_player] = new_data['currentAssignments'][target_player]
        new_data['currentAssignments'][target_player] = tmp

    return new_data


def get_neighbors(player, ordering):
    player_index = ordering.index(player)
    if player_index == len(ordering) - 1:
        return ordering[0], ordering[len(ordering) - 2]
    return ordering[player_index - 1], ordering[player_index + 1]


def get_team_affiliation_for_player(player, role_data):
    role = role_data['currentAssignments'][player]
    village_roles = ['Villager', 'Robber', 'Troublemaker', 'Mason',
                     'Seer', 'Inexplicable', 'Podcaster', 'Nut Job',
                     'Rationalist', 'Stoner', 'Devil\'s Advocate', 'Insomniac',
                     'Dog Whisperer']

    werewolf_roles = ['Werewolf', 'Minion']

    left, right = get_neighbors(player, role_data['ordering'])

    raw_affiliation = ''
    if role in village_roles or '-> Villager' in role:
        raw_affiliation = 'Village'
    elif role in werewolf_roles or '-> Werewolf' in role or '-> Minion' in role:
        raw_affiliation = 'Werewolf'
    elif 'Tanner' in role:
        raw_affiliation = 'Tanner - ' + player
    elif 'Boy Nextdoor' in role:
        raw_affiliation = 'Boy Nextdoor - ' + player

    if 'Boy Nextdoor' in role_data['currentAssignments'][left]:
        return 'Nextdoor' + left + ' - ' + raw_affiliation
    if 'Boy Nextdoor' in role_data['currentAssignments'][right]:
        return 'Nextdoor' + right + ' - ' + raw_affiliation
    else:
        return raw_affiliation


def get_winning_team_and_players(votes, role_data):
    highest_num_votes = max(set([votes.count(p) for p in votes]))
    players_with_highest_votes = [p for p in votes if votes.count(p) == highest_num_votes]
    players_with_highest_votes = list(set(players_with_highest_votes))

    affiliations = {}
    for vote in votes:
        aff = get_team_affiliation_for_player(vote, role_data)
        if len(aff) > 8 and aff[:8] == 'Nextdoor':
            key = aff.split(' - ')[0]
        else:
            key = aff
        if key in affiliations:
            affiliations[key] += 1
        else:
            affiliations[key] = 1

    if highest_num_votes == 1:
        # No one was killed, circle vote. village wins if no werewolf, otherwise werewolf wins
        if 'Werewolf' in affiliations:
            return [p for p in role_data['ordering'] if 'Werewolf' in get_team_affiliation_for_player(p, role_data)], ['No One']
        else:
            return [p for p in role_data['ordering'] if 'Village' in get_team_affiliation_for_player(p, role_data)], ['No One']

    winners = []
    ineligible_winners = []
    # Loop once for special roles
    for player in players_with_highest_votes:
        team = get_team_affiliation_for_player(player, role_data)
        if 'Tanner' in team:
            winners.append(player)
        if 'Boy Nextdoor' in team:
            neighbors = get_neighbors(player, role_data['ordering'])
            winners.extend(neighbors)
        if len(team) > 8 and team[:8] == 'Nextdoor':
            bn = team.split(' - ')[8:]
            winners.append(bn)
            ineligible_winners.append(get_neighbors(bn, role_data))

    did_kill_werewolf = False
    for player in players_with_highest_votes:
        team = get_team_affiliation_for_player(player, role_data)
        if team == 'Werewolf':
            if 'Werewolf' in role_data['currentAssignments'][player]:
                village_team = [p for p in role_data['ordering'] if 'Village' in get_team_affiliation_for_player(p, role_data)]
                winners.extend([v for v in village_team if v not in ineligible_winners])
                did_kill_werewolf = True

    if not did_kill_werewolf:
        werewolf_team = [p for p in role_data['ordering'] if 'Werewolf' in get_team_affiliation_for_player(p, role_data)]
        winners.extend([v for v in werewolf_team if v not in ineligible_winners])

    winners = list(set(winners))

    return winners, players_with_highest_votes


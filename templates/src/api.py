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
    if len(original_role_mapping['Werewolf']) > 0:
        # Set one as the default in case no one chooses
        golden_wolf = original_role_mapping['Werewolf'][0]
    if original_role_mapping['Dog Whisperer'] != '' and len(original_role_mapping['Werewolf']) < 2:
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
    if previous_turn in ['Agent of Chaos', 'Stoner', 'Robber', 'Troublemaker'] and 'Rationalist' in roles_in_game:
        return 'Rationalist - ' + previous_turn
    if not previous_turn:
        begin_index = 0
    elif 'Rationalist' in previous_turn:
        prev_prev = previous_turn.split(' - ')[1]
        begin_index = constants.ORDERED_NIGHT_ROLES.index(prev_prev) + 1
    else:
        begin_index = constants.ORDERED_NIGHT_ROLES.index(previous_turn) + 1

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


def get_winning_team_and_players(player_configs, role_data):
    all_players = role_data['ordering']
    votes = [player_configs[p]['votedAgainst'] for p in all_players]
    highest_num_votes = max(set([votes.count(v) for v in votes]))
    players_with_highest_votes = list(set([v for v in votes if votes.count(v) == highest_num_votes]))
    all_werewolves = [p for p in all_players if 'Werewolf' in role_data['currentAssignments'][p]]
    all_werewolf_or_minion = [p for p in all_players if 'Werewolf' in get_team_affiliation_for_player(p, role_data)]
    all_villager_affiliated = [p for p in all_players if 'Village' in get_team_affiliation_for_player(p, role_data)]

    if highest_num_votes == 1:
        werewolf_in_game = len(all_werewolves) > 0
        # No one was killed, circle vote. village wins if no werewolf, otherwise werewolf wins
        if werewolf_in_game:
            print('Werewolves win by circle vote')
            return all_werewolf_or_minion, ['No One']
        else:
            print('Villagers win by circle vote')
            return all_villager_affiliated, ['No One']

    # If all the werewolves killed the Devil's Advocate the vote doesn't matter
    werewolf_votes = list(set([player_configs[w]['votedAgainst'] for w in all_werewolves]))
    if len(werewolf_votes) == 1 and role_data['currentAssignments'][werewolf_votes[0]] == 'Devil\'s Advocate':
        print('Werewolves win by killing Devils Advocate')
        return all_werewolf_or_minion, [werewolf_votes[0]]

    winners = []
    ineligible_winners = []
    # Loop once for special roles
    for player in players_with_highest_votes:
        team = get_team_affiliation_for_player(player, role_data)
        if 'Tanner' in team:
            print('Tanner wins')
            winners.append(player)
        if 'Boy Nextdoor' in team:
            print('Boy Nextdoor neighbors win')
            neighbors = get_neighbors(player, role_data['ordering'])
            winners.extend(neighbors)
        if len(team) > 8 and team[:8] == 'Nextdoor':
            bn = team.split(' - ')[8:]
            winners.append(bn)
            print(f'{get_neighbors(bn, role_data)} automatically lose as neighbors')
            ineligible_winners.append(get_neighbors(bn, role_data))

    if len(players_with_highest_votes) == 1 and len(winners) > 0:
        # There's no tie, only a special role won
        print('Special role won with no tie!')
        return winners, [players_with_highest_votes]

    werewolves_killed = [w for w in all_werewolves if w in players_with_highest_votes]
    if werewolves_killed:
        # Dog Whisperer loses if the Golden Wolf was killed
        for w in werewolves_killed:
            if role_data['goldenWolf'] == w:
                for p in all_players:
                    if role_data['currentAssignments'][p] == 'Dog Whisperer':
                        print('Dog Whisperer loses as golden wolf died')
                        ineligible_winners.append(p)
        print('Villagers win by werewolf kill')
        winners.extend([v for v in all_villager_affiliated if v not in ineligible_winners])
    else:
        print('Werewolves win by no werewolf killed')
        winners.extend([w for w in all_werewolf_or_minion if w not in ineligible_winners])

    winners = list(set(winners))
    return winners, players_with_highest_votes


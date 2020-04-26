import React, { Component } from 'react';
import queryString from 'query-string';
import SocketIOClient from 'socket.io-client';
import PlayerInfo from "./PlayerInfo";
import PlayerHuddle from "./PlayerHuddle";
import constants from '../constants';
import utils from '../utils';
import RoleDescription from "./RoleDescription";
import RoleConfirmation from "./RoleConfirmation";
import PlayerCircle from "./PlayerCircle";
import PlayerActionConsole from "./PlayerActionConsole";
import DayDashboard from "./DayDashboard";
import EndDisplay from "./EndDisplay";

export default class GameContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            gameCode: '',
            gameState: 'createplayer',
            playerName: '',
            host: false,
            playerConfigs: {},
            rolesInGame: [],
            roleData: {},
            executingTurn: '',
            winners: [],
            playersKilled: []
        };
        this.socket = SocketIOClient(location.protocol + '//' + document.domain + ':' + location.port, {transports: ['websocket']});
        this.renderGetPlayerInfo = this.renderGetPlayerInfo.bind(this);
        this.renderPlayerHuddle = this.renderPlayerHuddle.bind(this);
        this.savePlayerInfo = this.savePlayerInfo.bind(this);
        this.onPlayerSetUpdated = this.onPlayerSetUpdated.bind(this);
        this.onPlayerJoined = this.onPlayerJoined.bind(this);
        this.huddleFinished = this.huddleFinished.bind(this);
        this.addRoleToGame = this.addRoleToGame.bind(this);
        this.playerConfirmedRole = this.playerConfirmedRole.bind(this);
        this.playerFinishedTurn = this.playerFinishedTurn.bind(this);
        this.onRoleSwitchTriggered = this.onRoleSwitchTriggered.bind(this);
        this.onWerewolfDesignated = this.onWerewolfDesignated.bind(this);
        this.onPlayerReadyToVote = this.onPlayerReadyToVote.bind(this);
        this.onLeaveGame = this.onLeaveGame.bind(this);
        this.dayFinished = this.dayFinished.bind(this);
        this.onPlayerRequestedPodcasterVote = this.onPlayerRequestedPodcasterVote.bind(this);
        this.onPodcastVote = this.onPodcastVote.bind(this);
    }

    componentDidMount() {
        const gameCode = this.props.match.params['gameCode'];
        this.socket.emit('Register_Socket_Connection', gameCode);
        const queryValues = queryString.parse(this.props.location.search);
        const host = queryValues.host === 'True';

        this.socket.on('Player_Joined', (data) => {
            if (this.state.host) {
                this.onPlayerJoined(data);
            }
        });

        this.socket.on('Player_Requested_Rejoin', (data) => {
            // Pick a player randomly to send back its data
            const requestingPlayer = data['playerName'];
            const eligibleResenders = this.getAllPlayerNames().filter((name) => name !== requestingPlayer);
            if (eligibleResenders.length > 0) {
                if (this.state.playerName === eligibleResenders[0]) {
                    this.socket.emit('Resync_Data', {
                        gameCode: this.state.gameCode,
                        gameState: this.state.gameState,
                        playerConfigs: this.state.playerConfigs,
                        rolesInGame: this.state.rolesInGame,
                        roleData: this.state.roleData,
                        executingTurn: this.state.executingTurn,
                        winners: this.state.winners,
                        playersKilled: this.state.playersKilled,
                        requestingPlayer: requestingPlayer
                    });
                }
            }
        });

        this.socket.on('Resync_Data_Received', (data) => {
           if (data['requestingPlayer'] === this.state.playerName) {
               this.setState({
                   gameState: data['gameState'],
                   playerConfigs: data['playerConfigs'],
                   rolesInGame: data['rolesInGame'],
                   roleData: data['roleData'],
                   executingTurn: data['executingTurn'],
                   winners: data['winners'],
                   playersKilled: data['playersKilled']
               });
           }
        });

        this.socket.on('Update_Player_Config', (data) => {
            this.onPlayerSetUpdated(data);
        });

        this.socket.on('Update_Role_Assignments', (data) => {
           this.onRoleAssignmentsUpdated(data);
        });

        this.socket.on('Begin_Player_Turn', (data) => {
            this.onBeginPlayerTurn(data);
        });

        this.socket.on('Night_Finished', () => {
            this.onNightFinished();
        });

        this.socket.on('Results_Calculated', (data) => {
            this.onResultsCalculated(data);
        });

        // Clear unused cache keys
        const allLocalStorageKeys = Object.keys(localStorage);
        for (const k of allLocalStorageKeys.values()) {
            if (k !== gameCode) {
                localStorage.removeItem(k);
            }
        }

        const cachedStateString = localStorage.getItem(gameCode);
        if (cachedStateString) {
            const cachedState = JSON.parse(cachedStateString);
            const localPlayerName = cachedState['playerName'];
            const localGameState = cachedState['gameState'];
            const localHost = host['host'];
            let localPlayerConfig = {};
            localPlayerConfig[localPlayerName] = {
                confirmedRole: false,
                readyToVote: false,
                votedAgainst: '',
                podcastConfig: {
                    claimStatus: '',
                    votesFor: [],
                    votesAgainst: []
                }
            };
            this.socket.emit('Rejoin_Player', {
                playerName: localPlayerName,
                gameCode: gameCode,
            });
            this.setState({
                playerName: localPlayerName,
                gameCode: gameCode,
                host: localHost,
                gameState: localGameState,
                playerConfigs: localPlayerConfig
            });
        }

        this.setState({
            gameCode: gameCode,
            host: host
        })
    }

    updateLocalStorage() {
        localStorage.setItem(this.state.gameCode, JSON.stringify({
            playerName: this.state.playerName,
            host: this.state.host,
            gameState: this.state.gameState
        }));
    }

    getAllPlayerNames() {
        return Object.keys(this.state.playerConfigs);
    }

    // Host Specific Functions

    onPlayerJoined(data) {
        let updatedPlayerConfig = {};
        Object.assign(updatedPlayerConfig, this.state.playerConfigs);
        updatedPlayerConfig[data['playerName']] = {
            confirmedRole: false,
            readyToVote: false,
            votedAgainst: '',
            podcastConfig: {
                claimStatus: '',
                votesFor: [],
                votesAgainst: []
            }
        };
        this.socket.emit('Update_Player_Set', {
            playerConfigs: updatedPlayerConfig,
            gameCode: this.state.gameCode
        });
        this.setState({
            playerConfigs: updatedPlayerConfig
        });
    }

    addRoleToGame(role) {
        this.setState({
            rolesInGame: [...this.state.rolesInGame, role]
        });
    }

    removeRoleFromGame(role) {
        let removed = false
        let updatedRoles = [];
        for (const r of this.state.rolesInGame.values()) {
            if (r !== role || removed) {
                updatedRoles = [...updatedRoles, r];
            } else {
                removed = true;
            }
        }
        this.setState({
            rolesInGame: updatedRoles
        });
    }

    huddleFinished() {
        this.socket.emit('Huddle_Finished', {
            gameCode: this.state.gameCode,
            rolesInGame: this.state.rolesInGame,
            playerConfigs: this.state.playerConfigs
        });
    }

    // All Player Functions

    onPlayerSetUpdated(data) {
        let updatedPlayerConfig = {};
        Object.assign(updatedPlayerConfig, this.state.playerConfigs);
        if ('hostName' in data) {
            // Someone left
            delete updatedPlayerConfig[data['playerName']];
            this.setState({
                playerConfigs: updatedPlayerConfig,
                host: data['hostName'] === this.state.playerName
            }, () => {
                this.updateLocalStorage();
            });
        } else if ('playerConfigs' in data) {
            // Update the entire player config state for all players
            this.setState({
                playerConfigs: data['playerConfigs']
            }, () => {
                this.updateGameStateIfNecessary();
            });
        } else {
            // A single player was updated
            updatedPlayerConfig[data['playerName']] = data['playerConfig'];
            this.setState({
                playerConfigs: updatedPlayerConfig
            }, () => {
                this.updateGameStateIfNecessary();
            });
        }
    }

    updateGameStateIfNecessary() {
        if (this.state.gameState === 'roleassignment') {
            let numConfirmations = 0;
            const allPlayers = this.getAllPlayerNames();
            for (const player of allPlayers.values()) {
                if (this.state.playerConfigs[player]['confirmedRole']) {
                    numConfirmations += 1;
                }
            }
            if (numConfirmations === allPlayers.length) {
                if (this.state.host) {
                    this.socket.emit('Confirmation_Finished', {
                        gameCode: this.state.gameCode,
                        rolesInGame: this.state.rolesInGame
                    });
                }
            }
        } else if (this.state.gameState === 'day') {
            let numReady = 0;
            const allPlayers = this.getAllPlayerNames();
            for (const player of allPlayers.values()) {
                if (this.state.playerConfigs[player]['readyToVote']) {
                    numReady += 1;
                }
            }
            if (numReady === allPlayers.length) {
                this.setState({
                    gameState: 'vote',
                });
            }
        } else if (this.state.gameState === 'vote') {
            let votesFor = [];
            const allPlayers = this.getAllPlayerNames();
            for (const player of allPlayers.values()) {
                if (this.state.playerConfigs[player]['votedAgainst'] !== '') {
                    votesFor = [...votesFor, this.state.playerConfigs[player]['votedAgainst']];
                }
            }
            if (votesFor.length === allPlayers.length) {
                if (this.state.host) {
                    this.socket.emit('Vote_Finished', {
                        gameCode: this.state.gameCode,
                        votesFor: votesFor,
                        roleData: this.state.roleData,
                    });
                }
            }
        }
    }

    onRoleAssignmentsUpdated(data) {
        if ('rolesInGame' in data) {
            this.setState({
                roleData: data['roleData'],
                rolesInGame: data['rolesInGame'],
                gameState: 'roleassignment'
            }, () => {
                this.updateLocalStorage();
            });
        } else {
            this.setState({
                roleData: data['roleData']
            });
        }
    }

    onBeginPlayerTurn(data) {
        this.setState({
            executingTurn: data['nextTurn'],
            gameState: 'night'
        }, () => {
            this.updateLocalStorage();
        });
    }

    onNightFinished() {
        this.setState({
            gameState: 'day'
        }, () => {
            this.updateLocalStorage();
        })
    }

    onResultsCalculated(data) {
        this.setState({
            gameState: 'end',
            winners: data['winners'],
            playersKilled: data['playersKilled']
        }, () => {
            localStorage.removeItem(this.state.gameCode);
        });
    }

    savePlayerInfo(playerName) {
        this.socket.emit('Create_Player', {
            playerName: playerName,
            gameCode: this.state.gameCode
        });
        this.setState({
            playerName: playerName,
            gameState: 'huddle'
        }, () => {
            this.updateLocalStorage();
        });
    }

    playerConfirmedRole() {
        this.socket.emit('Confirm_Player', {
            gameCode: this.state.gameCode,
            playerName: this.state.playerName,
            playerConfig: this.state.playerConfigs[this.state.playerName]
        });
    }

    playerFinishedTurn() {
        this.socket.emit('Player_Turn_Finish', {
            gameCode: this.state.gameCode,
            previousTurn: this.state.executingTurn,
            rolesInGame: this.state.rolesInGame
        });
        return [false, 0];
    }

    onRoleSwitchTriggered(player1, player2, executingRole) {
        this.socket.emit('Role_Switch', {
            gameCode: this.state.gameCode,
            sourcePlayer: player1,
            targetPlayer: player2,
            roleData: this.state.roleData,
            executingRole: executingRole
        })
    }

    onWerewolfDesignated(player) {
        this.socket.emit('Werewolf_Designated', {
            gameCode: this.state.gameCode,
            player: player,
            roleData: this.state.roleData
        });
    }

    onPlayerReadyToVote() {
        this.socket.emit('Player_Ready_To_Vote', {
            gameCode: this.state.gameCode,
            player: this.state.playerName,
            playerConfig: this.state.playerConfigs[this.state.playerName]
        });
    }

    onPlayerRequestedPodcasterVote() {
        this.socket.emit('Player_Requested_Podcaster_Vote', {
            gameCode: this.state.gameCode,
            playerName: this.state.playerName,
            playerConfig: this.state.playerConfigs[this.state.playerName]
        });
    }

    onPodcastVote(vote, player) {
        this.socket.emit('Podcast_Vote', {
            gameCode: this.state.gameCode,
            vote: vote,
            playerName: this.state.playerName,
            playerVotedOn: player,
            playerVotedOnConfig: this.state.playerConfigs[player]
        });
    }

    castVote(player) {
        this.socket.emit('Player_Voted', {
            gameCode: this.state.gameCode,
            playerName: this.state.playerName,
            votedAgainst: player,
            playerConfig: this.state.playerConfigs[this.state.playerName]
        });
    }

    onLeaveGame() {
        this.socket.emit('Player_Left', {
            gameCode: this.state.gameCode,
            playerName: this.state.playerName,
            playerConfig: this.state.playerConfigs[this.state.playerName],
            host: this.state.host
        })
    }

    dayFinished() {
        this.setState({
            gameState: 'vote'
        }, () => {
            this.updateLocalStorage();
        })
    }

    // Rendering Functions

    renderGetPlayerInfo() {
        if (this.state.gameState === 'createplayer') {
            return (
                <div className='centered-container'>
                    <div className='console player-info-console'>
                        <PlayerInfo
                            onSave={this.savePlayerInfo}/>
                    </div>
                </div>
            );
        }
    }

    renderPlayerHuddle() {
        if (this.state.gameState === 'huddle') {
            return (
                <div className='half-container'>
                    <PlayerHuddle
                        players={this.getAllPlayerNames()}
                        host={this.state.host}
                        onFinish={this.huddleFinished}
                        rolesInGame={this.state.rolesInGame}/>
                </div>
            );
        }
    }

    renderRoleChoices() {
        if (this.state.gameState === 'huddle') {
            return (
                <div className='half-container'>
                    <div className='console role-display-console'>
                        <div className='role-choices'>
                            {constants.ALL_ROLES.map((role) =>
                                <RoleDescription
                                    host={this.state.host}
                                    role={role}
                                    onRoleAdd={() => this.addRoleToGame(role)}
                                    onRoleRemove={() => this.removeRoleFromGame(role)}
                                    capacityFilled={this.state.rolesInGame.length === this.getAllPlayerNames().length + 3}/>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    }

    renderRoleConfirmation() {
        if (this.state.gameState === 'roleassignment') {
            if (Object.entries(this.state.roleData).length === 0) {
                return null;
            }
            const assignedRole = utils.getPlayerOriginalRole(this.state.playerName, this.state.roleData);
            return (
                <div className='centered-container'>
                    <RoleConfirmation
                        role={assignedRole}
                        onConfirm={this.playerConfirmedRole} />
                </div>
            );
        }
    }

    renderPlayerActionConsole() {
        if (this.state.gameState === 'night') {
            if (Object.entries(this.state.roleData).length === 0) {
                return null;
            }
            const assignedRole = utils.getPlayerOriginalRole(this.state.playerName, this.state.roleData);
            return (
                <div className='half-container'>
                    <PlayerActionConsole
                        role={assignedRole}
                        executingTurn={utils.getRationalistDeformattedRole(this.state.executingTurn)}
                        allPlayers={this.getAllPlayerNames()}
                        roleData={this.state.roleData}
                        rolesInGame={this.state.rolesInGame}
                        onRoleSwitch={this.onRoleSwitchTriggered}
                        onWerewolfDesignated={this.onWerewolfDesignated}
                        playerName={this.state.playerName}/>
                </div>
            );
        } else if (this.state.gameState === 'day') {
            if (Object.entries(this.state.playerConfigs).length === 0) {
                return null;
            }
            return (
                <div className='half-container'>
                    <DayDashboard
                        rolesInGame={this.state.rolesInGame}
                        roleData={this.state.roleData}
                        allPlayers={this.getAllPlayerNames()}
                        onReadyToVote={this.onPlayerReadyToVote}
                        onLeaveGame={this.onLeaveGame}
                        playerName={this.state.playerName}
                        playerConfigs={this.state.playerConfigs}
                        onPodcastRequest={this.onPlayerRequestedPodcasterVote}
                        onPodcastVote={this.onPodcastVote}/>
                </div>
            );
        }
    }

    renderPlayerCircle() {
        if (this.state.gameState === 'night') {
            return (
                <div className='half-container'>
                    <PlayerCircle
                        countdownTime={15}
                        executingTurn={utils.getRationalistDeformattedRole(this.state.executingTurn)}
                        onFinish={this.playerFinishedTurn}
                        gameState={'night'}/>
                </div>
            );
        } else if (this.state.gameState === 'day') {
            return (
                <div className='half-container'>
                    <PlayerCircle
                        countdownTime={420}
                        onFinish={this.dayFinished}
                        gameState={'day'}/>
                </div>
            );
        }
    }

    renderVote() {
        if (this.state.gameState === 'vote') {
            if (Object.entries(this.state.playerConfigs).length === 0) {
                return null;
            }
            const votedAgainst = this.state.playerConfigs[this.state.playerName]['votedAgainst'];
            return (
                <div className='centered-container'>
                    <div className='console vote-console'>
                        <label className='large-label'>Choose who to kill:</label>
                        {this.state.roleData['ordering'].map((player) => votedAgainst === '' ?
                            <button className='day-action-center-button' onClick={() => this.castVote(player)}>
                                {player}
                            </button> :
                            <button className={votedAgainst === player ? 'day-action-center-button-selected' : 'day-action-center-button'} disabled={true}>
                                {player}
                            </button>)}
                    </div>
                </div>
            );
        }
    }

    renderEnd() {
        if (this.state.gameState === 'end') {
            if (Object.entries(this.state.roleData).length === 0) {
                return null;
            }
            return (
                <div className='centered-container'>
                    <EndDisplay
                        winners={this.state.winners}
                        playersKilled={this.state.playersKilled}
                        playerName={this.state.playerName}
                        roleData={this.state.roleData}/>
                </div>
            );
        }
    }

    render() {
        return (
            <div className='main-container-night'>
                {this.renderGetPlayerInfo()}
                {this.renderPlayerHuddle()}
                {this.renderRoleChoices()}
                {this.renderRoleConfirmation()}
                {this.renderPlayerCircle()}
                {this.renderPlayerActionConsole()}
                {this.renderVote()}
                {this.renderEnd()}
            </div>
        );
    }

}

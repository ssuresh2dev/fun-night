import React, { Component } from 'react';
import queryString from 'query-string';
import socketIOClient from "socket.io-client";
import PlayerInfo from "./PlayerInfo";
import PlayerHuddle from "./PlayerHuddle";
import constants from '../constants';

export default class GameContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playerName: '',
            allPlayers: [],
            gameCode: '',
            host: false,
            gameState: 'createplayer',
            rolesInGame: [],
            roleData: {},
            playerConfirmedRole: false,
            numPlayersConfirmed: 0,
            executingTurn: ''
        };
        this.socket = socketIOClient('http://' + document.domain + ':' + location.port);
        this.renderGetPlayerInfo = this.renderGetPlayerInfo.bind(this);
        this.renderPlayerHuddle = this.renderPlayerHuddle.bind(this);
        this.savePlayerInfo = this.savePlayerInfo.bind(this);
        this.onPlayerSetUpdated = this.onPlayerSetUpdated.bind(this);
        this.onPlayerJoined = this.onPlayerJoined.bind(this);
        this.huddleFinished = this.huddleFinished.bind(this);
        this.addRoleToGame = this.addRoleToGame.bind(this);
        this.playerConfirmedRole = this.playerConfirmedRole.bind(this);
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

        this.socket.on('Player_Left', (data) => {
            if (this.state.host) {
                this.onPlayerLeft(data);
            }
        });

        this.socket.on('Host_Updated_Player_Set', (data) => {
            this.onPlayerSetUpdated(data);
        });

        this.socket.on('Assigned_Roles', (data) => {
           this.onRoleAssignmentCompleted(data);
        });

        this.socket.on('Role_Confirmation_Count_Updated', () => {
            this.onRoleConfirmationCountUpdated();
        });

        this.socket.on('Begin_Player_Turn', (data) => {
            this.onBeginPlayerTurn(data);
        });

        this.setState({
            gameCode: gameCode,
            host: host
        })
    }

    // Host Specific Functions

    onPlayerJoined(data) {
        const newPlayers = [...this.state.allPlayers, data['playerName']];
        this.socket.emit('Update_Player_Set', {
            players: newPlayers,
            gameCode: this.state.gameCode
        });
        this.setState({
            allPlayers: newPlayers
        });
    }

    onPlayerLeft(data) {
        const newPlayers = this.state.allPlayers.filter(p => p !== data['playerName']);
        this.socket.emit('Update_Player_Set', {
            players: newPlayers,
            gameCode: this.state.gameCode
        });
        this.setState({
            allPlayers: newPlayers
        });
    }

    addRoleToGame(role) {
        this.setState({
            rolesInGame: [...this.state.rolesInGame, role]
        });
    }

    huddleFinished() {
        this.socket.emit('Huddle_Finished', {
            gameCode: this.state.gameCode,
            rolesInGame: this.state.rolesInGame,
            players: this.state.allPlayers
        });
    }

    // All Player Functions

    onPlayerSetUpdated(data) {
        this.setState({
            allPlayers: data
        });
    }

    onRoleAssignmentCompleted(data) {
        this.setState({
            roleData: data,
            gameState: 'roleassignment'
        });
    }

    onRoleConfirmationCountUpdated() {
        const confirmed = this.state.numPlayersConfirmed + 1;
        if (confirmed === this.state.allPlayers.length) {
            if (this.state.host) {
                this.socket.emit('Confirmation_Finished', {
                    gameCode: this.state.gameCode,
                    rolesInGame: this.state.rolesInGame
                });
            }
        }
        this.setState({
            numPlayersConfirmed: confirmed
        });
    }

    onBeginPlayerTurn(data) {
        this.setState({
            executingTurn: data['nextTurn'],
            gameState: 'night'
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
        });
    }

    playerConfirmedRole() {
        this.socket.emit('Confirm_Player', {
            gameCode: this.state.gameCode,
            playerName: this.state.playerName
        });
        this.setState({
            playerConfirmedRole: true
        })
    }

    // Rendering Functions

    renderGetPlayerInfo() {
        if (this.state.gameState === 'createplayer') {
            return (
                <div id='player-info'>
                    <PlayerInfo
                        onSave={this.savePlayerInfo}/>
                </div>
            );
        }
    }

    renderPlayerHuddle() {
        if (this.state.gameState === 'huddle') {
            return (
                <div id='player-huddle'>
                    <PlayerHuddle
                        host={this.state.host}
                        players={this.state.allPlayers}
                        onFinish={this.huddleFinished}/>
                </div>
            );
        }
    }

    renderRoleChoices() {
        if (this.state.gameState === 'huddle') {
            if (this.state.host) {
                return (
                    <div id='role-choices'>
                        {constants.ALL_ROLES.map((role) =>
                            <button onClick={() => this.addRoleToGame(role)}>{role}</button>)}
                    </div>
                );
            } else {
                return (
                    <div id='role-choices'>
                        {constants.ALL_ROLES.map((role) => <label>{role}</label>)}
                    </div>
                );
            }

        }
    }

    renderRoleConfirmation() {
        if (this.state.gameState === 'roleassignment') {
            const assignedRole = this.state.roleData['currentAssignments'][this.state.playerName];
            if (!this.state.playerConfirmedRole) {
                return (
                    <div id='roleconfirmation'>
                        <label>Your Assigned Role: {assignedRole}</label>
                        <button onClick={this.playerConfirmedRole}>Confirm</button>
                    </div>
                );
            } else {
                return (
                    <div id='roleconfirmation'>
                        <label>Your Assigned Role: {assignedRole}</label>
                        <label>Waiting for others to confirm...</label>
                    </div>
                );
            }

        }
    }

    renderPlayerTurn() {
        if (this.state.gameState === 'night') {
            const assignedRole = this.state.roleData['currentAssignments'][this.state.playerName];
            if (this.state.executingTurn !== assignedRole) {
                return (
                    <div id='awaiting-turn'>
                        <label>Current Turn: {this.state.executingTurn}</label>
                    </div>
                );
            } else {
                return (
                    <div id='player-turn'>
                        <label>Your Turn!</label>
                    </div>
                );
            }

        }
    }

    render() {
        return (
            <div id='fun-night-main-container' style={{ textAlign: "center" }}>
                <h1>One Night</h1>
                {this.renderGetPlayerInfo()}
                {this.renderPlayerHuddle()}
                {this.renderRoleChoices()}
                {this.renderRoleConfirmation()}
                {this.renderPlayerTurn()}
            </div>
        );
    }

}

import React, { Component } from 'react';
import queryString from 'query-string';
import socketIOClient from "socket.io-client";
import PlayerInfo from "./PlayerInfo";
import PlayerHuddle from "./PlayerHuddle";
import constants from '../constants';
import RoleDescription from "./RoleDescription";
import RoleConfirmation from "./RoleConfirmation";
import PlayerCircle from "./PlayerCircle";
import RoleCard from "./RoleCard";
import utils from "../utils";
import PlayerActionConsole from "./PlayerActionConsole";

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
        this.playerFinishedTurn = this.playerFinishedTurn.bind(this);
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

    playerFinishedTurn() {
        this.socket.emit('Player_Turn_Finish', {
            gameCode: this.state.gameCode,
            previousTurn: this.state.executingTurn,
            rolesInGame: this.state.rolesInGame
        });
        return [false, 0];
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
                        players={this.state.allPlayers}
                        host={this.state.host}
                        onFinish={this.huddleFinished} />
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
                                    onRoleRemove={() => this.removeRoleFromGame(role)}/>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    }

    renderRoleConfirmation() {
        if (this.state.gameState === 'roleassignment') {
            const assignedRole = this.state.roleData['currentAssignments'][this.state.playerName];
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
            const assignedRole = this.state.roleData['currentAssignments'][this.state.playerName];
            return (
                <div className='half-container'>
                    <PlayerActionConsole role={assignedRole} />
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
                        executingTurn={this.state.executingTurn}
                        onFinish={this.playerFinishedTurn}/>
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
            </div>
        );
    }

}

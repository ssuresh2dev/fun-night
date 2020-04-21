import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import PlayerInfo from "./PlayerInfo";

export default class GameContainer extends Component {

    constructor(props) {
        super(props);
        const gameCode = this.props.match.params;
        this.state = {
            playerName: '',
            allPlayers: [],
            gameCode: gameCode
        };
        this.socket = socketIOClient('http://' + document.domain + ':' + location.port);
        this.socket.emit('Register_Socket_Connection', gameCode);
        this.socket.on('Player_Joined', (data) => {
            this.onPlayerJoined(data);
        });

        this.renderGetPlayerInfo = this.renderGetPlayerInfo.bind(this);
        this.renderPlayerHuddle = this.renderPlayerHuddle.bind(this);
        this.savePlayerInfo = this.savePlayerInfo.bind(this);
    }

    onPlayerJoined(data) {
        this.setState({
            allPlayers: [...this.state.allPlayers, data['playerName']]
        });
    }

    savePlayerInfo(playerName) {
        this.socket.emit('Create_Player', playerName);
        this.setState({
            playerName: playerName
        });
    }

    renderGetPlayerInfo() {
        if (!this.state.playerName) {
            return (
                <PlayerInfo
                    onSave={this.savePlayerInfo}/>
            );
        }
    }

    renderPlayerHuddle() {
        if (this.state.allPlayers !== []) {
            return this.state.allPlayers.map((player) =>
                <label>{player}</label>
            );
        }
    }

    render() {
        return (
            <div id='fun-night-main-container' style={{ textAlign: "center" }}>
                <h1>One Night</h1>
                <div id='player-info'>{this.renderGetPlayerInfo()}</div>
                <div id='player-huddle'>{this.renderPlayerHuddle()}</div>
            </div>
        );
    }

}

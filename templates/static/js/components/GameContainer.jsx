import React, { Component } from 'react';
import queryString from 'query-string';
import socketIOClient from "socket.io-client";
import PlayerInfo from "./PlayerInfo";

export default class GameContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playerName: '',
            allPlayers: [],
            gameCode: '',
            host: false
        };
        this.socket = socketIOClient('http://' + document.domain + ':' + location.port);
        this.renderGetPlayerInfo = this.renderGetPlayerInfo.bind(this);
        this.renderPlayerHuddle = this.renderPlayerHuddle.bind(this);
        this.savePlayerInfo = this.savePlayerInfo.bind(this);
        this.onPlayerSetUpdated = this.onPlayerSetUpdated.bind(this);
        this.onPlayerJoined = this.onPlayerJoined.bind(this);
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

        this.socket.on('Host_Updated_Player_Set', (data) => {
            this.onPlayerSetUpdated(data);
        });


        this.setState({
            gameCode: gameCode,
            host: host
        });
    }

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

    onPlayerSetUpdated(data) {
        this.setState({
            allPlayers: data
        });
    }

    savePlayerInfo(playerName) {
        this.socket.emit('Create_Player', {
            playerName: playerName,
            gameCode: this.state.gameCode
        });
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

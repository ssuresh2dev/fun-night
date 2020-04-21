import React, { Component } from 'react';
import { useHistory } from "react-router-dom";
import socketIOClient from "socket.io-client";

export default class Main extends Component {

    createId() {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var i = 0; i < 4; i++) {
            result += characters.charAt(Math.floor(Math.random() * 26));
        }
        return result;
    }

    createGame() {
        var gameCode = this.createId();
        this.props.history.push('/game/' + gameCode);
    }

    joinGame() {
        if (this.refs.existingGameCode !== null) {
            var gameCode = this.refs.existingGameCode.value;
            this.props.history.push('/game/' + gameCode);
        }
    }

    render() {
       return (
           <div style={{ textAlign: "center" }}>
               <button onClick={() => this.createGame() }>New Game</button>
               <input type="text" ref="existingGameCode" />
               <button onClick={() => this.joinGame() }>Join Existing</button>
          </div>
       )
    }
}

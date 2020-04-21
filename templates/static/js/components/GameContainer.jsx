import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

export default class GameContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            endpoint: 'http://' + document.domain + ':' + location.port
        }
    }

    componentDidMount() {
        const gameCode = this.props.match.params;
        const socket = socketIOClient(this.state.endpoint);
        socket.on('my response', (data) => {
            document.body.style.backgroundColor = 'blue';
        })
    }

    render() {
       return (
           <div style={{ textAlign: "center" }}>
               <h3>Game</h3>
           </div>
       )
    }
}

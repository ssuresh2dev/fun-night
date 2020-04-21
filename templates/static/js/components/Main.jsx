import React, { Component } from 'react';
import socketIOClient from "socket.io-client";

export default class Main extends Component {
    constructor() {
        super();
        this.state = {
            endpoint: 'http://127.0.0.1:5000',
            color: 'white'
        }
    }

    send() {
        const socket = socketIOClient(this.state.endpoint);
        socket.emit('change color', this.state.color);
    }

    setColor(color) {
        this.setState({ color });
    }

    render() {
       return (
           <div style={{ textAlign: "center" }}>
               <button onClick={() => this.send() }>Change Color</button>
               <button id="blue" onClick={() => this.setColor('blue')}>Blue</button>
               <button id="red" onClick={() => this.setColor('red')}>Red</button>
          </div>
       )
    }
}

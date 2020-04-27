import React, { Component } from 'react';
import '../../../public/css/main.css';

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
        this.props.history.push({
            pathname: '/game/' + gameCode,
            search: '?host=True'
        });
    }

    joinGame() {
        if (this.refs.existingGameCode !== null) {
            var gameCode = this.refs.existingGameCode.value;
            this.props.history.push('/game/' + gameCode);
        }
    }

    render() {
       return (
           <div className='main-container-night'>
               <img className='logo' src='../../../public/images/logo.png'/>
               <div className='centered-container'>
                   <div className='console landing-page-console'>
                       <input className='large-input' type="text" ref="existingGameCode" placeholder='Game Code'/>
                       <button className='action-button' onClick={() => this.joinGame() }>Join Existing</button>
                       <hr />
                       <button className='action-button' onClick={() => this.createGame() }>New Game</button>
                   </div>
               </div>
               <label className='footer'>Designed with &hearts; by Sameer Suresh</label>
          </div>
       )
    }
}

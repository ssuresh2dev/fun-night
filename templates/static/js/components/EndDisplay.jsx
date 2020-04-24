import React, {Component} from 'react';

export default class EndDisplay extends Component {

    constructor(props) {
        super(props);
        this.leaveGame = this.leaveGame.bind(this);
    }

    leaveGame() {
        window.location.href = '/';
    }

    render() {
        const didWin = this.props.winners.length > 0 ? this.props.winners.indexOf(this.props.playerName) > -1 : false;
        const playersKilled = this.props.playersKilled;
        let killedPlayersLabel = playersKilled.length > 1 ? 'Killed Players:' : 'Killed Player:';
        return (
            <div className='console endgame-console'>
                <label className='xlarge-label'>{didWin ? 'You Win!' : 'You Lose!'}</label>
                <div className='gap'>
                    <label className='medium-label'>{killedPlayersLabel}</label>
                    {playersKilled.map((player) =>
                        <label className='large-label'>{player === this.props.playerName ? 'You' : player}</label>
                    )}
                </div>
                <hr/>
                <label className='medium-label'>Final Roles:</label>
                <div className='final-role-grid'>
                    {this.props.roleData['ordering'].map((name) =>
                        <label className='small-label'>{name}: {this.props.roleData['currentAssignments'][name]}</label>)}
                </div>
                <button className='action-button' onClick={this.leaveGame}>Leave</button>
            </div>
        );
    }
};

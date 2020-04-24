import React, {Component} from 'react';

export default class EndDisplay extends Component {

    render() {
        const didWin = this.props.winners.length > 0 ? this.props.winners.indexOf(this.props.playerName) > -1 : false;
        const playerKilled = this.props.playerKilled;
        return (
            <div className='console endgame-console'>
                <label className='xlarge-label'>{didWin ? 'You Win!' : 'You Lose!'}</label>
                <div className='gap'>
                    <label className='medium-label'>Killed Player:</label>
                    <label className='large-label'>{playerKilled === this.props.playerName ? 'You' : playerKilled}</label>
                </div>
                <hr/>
                <label className='medium-label'>Final Roles:</label>
                <div className='final-role-grid'>
                    {this.props.roleData['ordering'].map((name) =>
                        <label className='small-label'>{name}: {this.props.roleData['currentAssignments'][name]}</label>)}
                </div>
                <button className='action-button'>Leave</button>
            </div>
        );
    }
};

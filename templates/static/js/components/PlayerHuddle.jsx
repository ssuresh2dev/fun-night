import React, {Component} from 'react';

export default class PlayerHuddle extends Component {

    constructor(props) {
        super(props);
        this.renderPlayerList = this.renderPlayerList.bind(this);
        this.renderStartButton = this.renderStartButton.bind(this);
    }

    renderPlayerList() {
        const numPlayers = this.props.players.length;
        return this.props.players.map((player) =>
            <div>
                <hr />
                <label className={numPlayers > 6 ? 'small-label' : 'medium-label'}>
                    {player}
                </label>
            </div>
        );
    }

    renderStartButton() {
        if (this.props.host) {
            if (this.props.players.length < 3) {
                return <button className='disabled-bottom-confirmation-button' disabled={true}>Waiting for More Players...</button>
            } else if (this.props.rolesInGame.length < this.props.players.length + 3) {
                return <button className='disabled-bottom-confirmation-button' disabled={true}>Select More Roles...</button>
            } else {
                return <button className='bottom-confirmation-button' onClick={this.props.onFinish}>Assign Roles</button>;
            }
        }
    }

    render() {
        return (
            <div className='console huddle-console'>
                <div className='connected-player-table'>
                    <label className='large-label'>Connected Players</label>
                    {this.renderPlayerList()}
                </div>
                <div className='huddle-confirmation'>
                    {this.renderStartButton()}
                </div>
            </div>
        );
    }
};

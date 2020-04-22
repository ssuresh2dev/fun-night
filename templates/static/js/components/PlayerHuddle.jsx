import React, {Component} from 'react';

export default class PlayerHuddle extends Component {

    constructor(props) {
        super(props);
        this.renderPlayerList = this.renderPlayerList.bind(this);
        this.renderStartButton = this.renderStartButton.bind(this);
    }

    renderPlayerList() {
        return this.props.players.map((player) =>
            <label>{player}</label>
        );
    }

    renderStartButton() {
        if (this.props.host) {
            return (
                <button onClick={this.props.onFinish}>Assign Roles</button>
            );
        }
    }

    render() {
        return (
            <div id='player-huddle'>
                {this.renderPlayerList()}
                {this.renderStartButton()}
            </div>
        );
    }
};

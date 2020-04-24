import React, {Component} from 'react';

export default class Troublemaker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstPlayer: '',
            secondPlayer: '',
            didSwap: false
        };

        this.onPlayerSelected = this.onPlayerSelected.bind(this);
    }

    onPlayerSelected(player) {
        if (this.state.firstPlayer === '') {
            this.setState({
                firstPlayer: player
            });
        } else {
            this.props.onRoleSwitch(this.state.firstPlayer, this.state.secondPlayer);
            this.setState({
                secondPlayer: player,
                didSwap: true
            });
        }
    }

    renderPreSelect() {
        const otherPlayers = this.props.allPlayers.filter((name) => name !== this.props.playerName);
        return (
            <div className='action-container'>
                <label className='medium-label'>Select two players to swap:</label>
                {otherPlayers.map((name) => name !== this.state.firstPlayer ?
                    <button className='day-action-center-button' onClick={() => this.onPlayerSelected(name)}>{name}</button> :
                    <button className='day-action-center-button-selected' disabled={true}>{name}</button>)}
            </div>
        );
    }

    renderConfirmation() {
        return (
            <div className='action-container'>
                <label className='medium-label'>Swapped Roles:</label>
                <label className='large-label'>{this.state.firstPlayer}</label>
                <label className='small-label'>and</label>
                <label className='large-label'>{this.state.secondPlayer}</label>
            </div>
        );
    }

    render() {
        if (!this.state.didSwap) {
            return this.renderPreSelect();
        } else {
            return this.renderConfirmation();
        }
    }
};

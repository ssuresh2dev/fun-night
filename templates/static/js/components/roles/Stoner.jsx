import React, {Component} from 'react';
import utils from "../../utils";

export default class Stoner extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstPlayer: '',
            secondPlayer: '',
            revealedRole: '',
            chosenPlayer: ''
        };

        this.onPlayerSelected = this.onPlayerSelected.bind(this);
        this.onPlayerReassigned = this.onPlayerReassigned.bind(this);
    }

    onPlayerSelected(player) {
        if (this.state.firstPlayer === '') {
            this.setState({
                firstPlayer: player
            });
        } else {
            const role1 = this.props.roleData['currentAssignments'][this.state.firstPlayer];
            const role2 = this.props.roleData['currentAssignments'][player];
            const choices = [role1, role2];
            const revealedRole = choices[Math.floor(Math.random()*2)];
            this.setState({
                secondPlayer: player,
                revealedRole: revealedRole
            });
        }
    }

    onPlayerReassigned(player) {
        const playerRole = this.props.roleData['currentAssignments'][player];
        if (this.state.revealedRole !== playerRole) {
            this.props.onRoleSwitch(this.state.firstPlayer, this.state.secondPlayer);
        }
        this.setState({
            chosenPlayer: player
        });
    }

    renderPreSelect() {
        const otherPlayers = this.props.allPlayers.filter((name) => name !== this.props.playerName);
        return (
            <div className='action-container'>
                <label className='medium-label'>Select two players to shuffle:</label>
                {otherPlayers.map((name) => name !== this.state.firstPlayer ?
                    <button className='day-action-center-button' onClick={() => this.onPlayerSelected(name)}>{name}</button> :
                    <button className='day-action-center-button-selected' disabled={true}>{name}</button>)}
            </div>
        );
    }

    renderPostSelect() {
        const player1 = this.state.firstPlayer;
        const player2 = this.state.secondPlayer;
        return (
            <div className='action-container'>
                <label className='medium-label'>Roles Shuffled. Pick a player to give this role back to:</label>
                <label className='large-label'>{utils.getDisplayNameForRole(this.state.revealedRole)}</label>
                <div className='gap'>
                    <button className='day-action-center-button' onClick={() => this.onPlayerReassigned(player1)}>{player1}</button>
                    <button className='day-action-center-button' onClick={() => this.onPlayerReassigned(player2)}>{player2}</button>
                </div>
            </div>
        );
    }

    renderConfirmation() {
        return (
            <div className='action-container'>
                <label className='medium-label'>Assigned</label>
                <label className='large-label'>{utils.getDisplayNameForRole(this.state.revealedRole)}</label>
                <label className='small-label'>to</label>
                <label className='large-label'>{this.state.chosenPlayer}</label>
            </div>
        );
    }

    render() {
        if (this.state.revealedRole === '') {
            return this.renderPreSelect();
        } else if (this.state.chosenPlayer === '') {
            return this.renderPostSelect();
        } else {
            return this.renderConfirmation();
        }
    }
};

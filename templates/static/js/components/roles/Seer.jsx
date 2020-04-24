import React, {Component} from 'react';
import utils from "../../utils";

export default class Seer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            revealedRole: '',
            selectedPlayer: '',
            centerCards: [],
            didSee: false
        };

        this.onPlayerSelected = this.onPlayerSelected.bind(this);
        this.onCenterSelected = this.onCenterSelected.bind(this);
    }

    onPlayerSelected(player) {
        const role = this.props.roleData['currentAssignments'][player];
        this.setState({
            revealedRole: role,
            selectedPlayer: player,
            didSee: true
        });
    }

    onCenterSelected() {
        const centerRoles = this.props.roleData['centerRoles'].sort(() => 0.5 - Math.random());
        this.setState({
            centerCards: centerRoles.splice(0, 2),
            didSee: true
        });
    }

    renderPreSelect() {
        const otherPlayers = this.props.allPlayers.filter((name) => name !== this.props.playerName);
        return (
            <div className='action-container'>
                <label className='medium-label'>View any other player's role, or two center cards</label>
                <button className='day-action-center-button' onClick={() => this.onCenterSelected()}>Center Cards</button>
                <hr style='width: 60%;'/>
                {otherPlayers.map((name) =>
                    <button className='day-action-center-button' onClick={() => this.onPlayerSelected(name)}>{name}</button>)}
            </div>
        );
    }

    renderPostSelect() {
        if (this.state.revealedRole !== '') {
            return (
                <div className='action-container'>
                    <label className='medium-label'>{this.state.selectedPlayer}'s Role:</label>
                    <label className='large-label'>{utils.getDisplayNameForRole(this.state.revealedRole)}</label>
                </div>
            );
        } else {
            return (
                <div className='action-container'>
                    <label className='medium-label'>Revealed Cards:</label>
                    <label className='large-label'>{this.state.centerCards[0]}</label>
                    <label className='small-label'>and</label>
                    <label className='large-label'>{this.state.centerCards[1]}</label>
                </div>
            );
        }

    }

    render() {
        if (!this.state.didSee) {
            return this.renderPreSelect();
        } else {
            return this.renderPostSelect();
        }
    }
};

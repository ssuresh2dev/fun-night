import React, {Component} from 'react';
import utils from "../../utils";

export default class Rationalist extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedPlayer: ''
        };

        this.onPlayerSelected = this.onPlayerSelected.bind(this);
    }

    onPlayerSelected(player) {
        this.setState({
            selectedPlayer: player
        });
        this.props.onPlayerSelect(player);
    }

    renderPreSelect() {
        const otherPlayers = this.props.allPlayers.filter((name) => name !== this.props.playerName);
        return (
            <div className='action-container'>
                <label className='medium-label'>Choose a player's role to view</label>
                {otherPlayers.map((name) =>
                    <button className='day-action-center-button' onClick={() => this.onPlayerSelected(name)}>{name}</button>)}
            </div>
        );
    }

    renderPostSelect(player) {
        const role = this.props.roleData['currentAssignments'][player];
        return (
            <div className='action-container'>
                <label className='medium-label'>{player}'s Role:</label>
                <label className='large-label'>{utils.getDisplayNameForRole(role)}</label>
            </div>
        );
    }

    render() {
        if (this.props.selectedPlayer) {
            return this.renderPostSelect(this.props.selectedPlayer);
        } else if (this.state.selectedPlayer) {
            return this.renderPostSelect(this.state.selectedPlayer);
        } else {
            return this.renderPreSelect();
        }
    }
};

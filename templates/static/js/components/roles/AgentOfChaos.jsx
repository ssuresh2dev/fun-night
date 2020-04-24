import React, {Component} from 'react';
import utils from '../../utils';

export default class AgentOfChaos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newRole: ''
        };

        this.onPlayerSelected = this.onPlayerSelected.bind(this);
    }

    onPlayerSelected(player) {
        const newRole = this.props.roleData['currentAssignments'][player];
        this.props.onRoleSwitch(this.props.playerName, player);
        this.setState({
            newRole: newRole
        });
    }

    renderPreSelect() {
        const otherPlayers = this.props.allPlayers.filter((name) => name !== this.props.playerName);
        return (
            <div className='action-container'>
                <label className='medium-label'>Select a player to switch with:</label>
                {otherPlayers.map((name) =>
                    <button className='day-action-center-button' onClick={() => this.onPlayerSelected(name)}>{name}</button>)}
            </div>
        );
    }

    renderConfirmation() {
        return (
            <div className='action-container'>
                <label className='medium-label'>Your New Role:</label>
                <label className='large-label'>{utils.getDisplayNameForRole(this.state.newRole)}</label>
            </div>
        );
    }

    render() {
        if (this.state.newRole === '') {
            return this.renderPreSelect();
        } else {
            return this.renderConfirmation();
        }
    }
};

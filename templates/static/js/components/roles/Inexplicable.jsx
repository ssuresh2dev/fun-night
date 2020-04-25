import React, {Component} from 'react';
import Seer from "./Seer";
import Robber from "./Robber";
import Troublemaker from "./Troublemaker";
import Insomniac from "./Insomniac";
import AgentOfChaos from "./AgentOfChaos";

export default class Inexplicable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            coinFlip: '',
            roleSelection: '',
            roleActionPending: false
        };

        this.handleCoinFlip = this.handleCoinFlip.bind(this);
        this.handleRoleSelection = this.handleRoleSelection.bind(this);
    }

    handleCoinFlip() {
        const val = Math.floor(Math.random() * 2);
        this.setState({
            coinFlip: val === 0 ? 'Heads' : 'Tails'
        })
    }

    handleRoleSelection(role) {
        const rolesNeedingAction = ['Stoner', 'Seer', 'Robber', 'Troublemaker', 'Insomniac', 'Agent of Chaos'];
        this.setState({
            roleSelection: role,
            roleActionPending: rolesNeedingAction.indexOf(role) > -1
        });
        if (this.props.roleData['currentAssignments'][this.props.playerName] === 'Inexplicable') {
            this.props.onRoleSwitch('Inexplicable', role);
        }
    }

    renderCoinFlip() {
        return (
            <div className='action-container'>
                <label className='medium-label'>Flip a Coin:</label>
                <div className='gap'>
                    <button className='day-action-center-button' onClick={this.handleCoinFlip}>Flip</button>
                </div>
            </div>
        );
    }

    renderTailResult() {
        return (
            <div className='action-container'>
                <label className='medium-label'>Result: Tails</label>
            </div>
        );
    }

    renderRoleSelection() {
        const ineligibleRoles = ['Mason', 'Dog Whisperer', 'Devil\'s Advocate', 'Rationalist'];
        const eligibleRoles = this.props.rolesInGame.filter((role) => ineligibleRoles.indexOf(role) === -1);
        const filtered = [...new Set(eligibleRoles)];
        return (
            <div className='action-container'>
                <label className='medium-label'>Choose a new role:</label>
                {filtered.map((name) =>
                    <button className='day-action-center-button' onClick={() => this.handleRoleSelection(name)}>{name}</button>)}
            </div>
        );
    }

    renderRoleAction() {
        if (this.state.roleSelection === 'Stoner') {
            return <Stoner
                        roleData={this.props.roleData}
                        allPlayers={this.props.allPlayers}
                        playerName={this.props.playerName}
                        onRoleSwitch={this.props.onRoleSwitch}/>;
        } else if (this.state.roleSelection === 'Seer') {
            return <Seer
                        roleData={this.props.roleData}
                        allPlayers={this.props.allPlayers}
                        playerName={this.props.playerName}/>;
        } else if (this.state.roleSelection === 'Robber') {
            return <Robber
                        roleData={this.props.roleData}
                        allPlayers={this.props.allPlayers}
                        playerName={this.props.playerName}
                        onRoleSwitch={this.props.onRoleSwitch}/>;
        } else if (this.state.roleSelection === 'Troublemaker') {
            return <Troublemaker
                        allPlayers={this.props.allPlayers}
                        playerName={this.props.playerName}
                        onRoleSwitch={this.props.onRoleSwitch}/>;
        } else if (this.state.roleSelection === 'Insomniac') {
            return <Insomniac
                        roleData={this.props.roleData}
                        playerName={this.props.playerName}/>;
        } else if (this.state.roleSelection === 'Agent of Chaos') {
            return <AgentOfChaos
                        roleData={this.props.roleData}
                        allPlayers={this.props.allPlayers}
                        playerName={this.props.playerName}
                        onRoleSwitch={this.props.onRoleSwitch}/>;
        }
    }

    renderConfirmation() {
        return (
            <div className='action-container'>
                <label className='medium-label'>Your role is now:</label>
                <label className='large-label'>{this.state.roleSelection}</label>
            </div>
        );
    }

    render() {
        if (this.state.coinFlip === '') {
            return this.renderCoinFlip();
        } else if (this.state.coinFlip === 'Tails') {
            return this.renderTailResult();
        } else if (this.state.roleSelection === '') {
            return this.renderRoleSelection();
        } else if (this.state.roleActionPending) {
            return this.renderRoleAction();
        } else {
            return this.renderConfirmation();
        }
    }
};

import React, {Component} from 'react';
import utils from "../utils";
import Werewolf from "./roles/Werewolf";
import AgentOfChaos from "./roles/AgentOfChaos";
import DevilsAdvocate from "./roles/DevilsAdvocate";
import DogWhisperer from "./roles/DogWhisperer";
import Inexplicable from "./roles/Inexplicable";
import Insomniac from "./roles/Insomniac";
import Mason from "./roles/Mason";
import Minion from "./roles/Minion";
import Rationalist from "./roles/Rationalist";
import Seer from "./roles/Seer";
import Stoner from "./roles/Stoner";
import Troublemaker from "./roles/Troublemaker";
import Robber from "./roles/Robber";

export default class PlayerActionConsole extends Component {

    constructor(props) {
        super(props);
        this.getActionComponentForRole = this.getActionComponentForRole.bind(this);
        this.state = {
            rationalistPlayer: ''
        }
    }

    getActionComponentForRole() {
        const executingTurn = this.props.executingTurn;
        const assignedRole = this.props.role;
        if (executingTurn === 'Werewolf') {
            return <Werewolf
                        roleData={this.props.roleData}
                        rolesInGame={this.props.rolesInGame}
                        playerName={this.props.playerName}
                        isGoldenWolfTurn={false}/>;
        } else if (executingTurn === 'Minion') {
            return <Minion roleData={this.props.roleData}/>;
        } else if (executingTurn === 'Devil\'s Advocate') {
            return <DevilsAdvocate roleData={this.props.roleData}/>;
        } else if (executingTurn === 'Dog Whisperer') {
            if (assignedRole === 'Dog Whisperer') {
                return <DogWhisperer roleData={this.props.roleData}/>;
            } else {
                return <Werewolf
                            roleData={this.props.roleData}
                            rolesInGame={this.props.rolesInGame}
                            playerName={this.props.playerName}
                            isGoldenWolfTurn={true}/>;
            }
        } else if (executingTurn === 'Mason') {
            return <Mason
                        roleData={this.props.roleData}
                        playerName={this.props.playerName}/>;
        } else if (executingTurn === 'Seer') {
            return <Seer
                        roleData={this.props.roleData}
                        allPlayers={this.props.allPlayers}
                        playerName={this.props.playerName}/>;
        } else if (executingTurn === 'Rationalist') {
            if (this.state.rationalistPlayer !== '') {
                return <Rationalist
                            playerName={this.props.playerName}
                            roleData={this.props.roleData}
                            allPlayers={this.props.allPlayers}
                            selectedPlayer={this.state.rationalistPlayer}/>;
            } else {
                return <Rationalist
                            playerName={this.props.playerName}
                            roleData={this.props.roleData}
                            allPlayers={this.props.allPlayers}
                            onPlayerSelect={(player) => this.setState({rationalistPlayer: player})}/>;
            }
        } else if (executingTurn === 'Insomniac') {
            return <Insomniac
                        roleData={this.props.roleData}
                        playerName={this.props.playerName}/>;
        } else if (executingTurn === 'Stoner') {
            return <Stoner
                        roleData={this.props.roleData}
                        allPlayers={this.props.allPlayers}
                        playerName={this.props.playerName}
                        onRoleSwitch={(p1, p2) => this.props.onRoleSwitch(p1, p2, 'Stoner')}/>;
        } else if (executingTurn === 'Agent of Chaos') {
            return <AgentOfChaos
                        roleData={this.props.roleData}
                        allPlayers={this.props.allPlayers}
                        playerName={this.props.playerName}
                        onRoleSwitch={(p1, p2) => this.props.onRoleSwitch(p1, p2, 'Agent of Chaos')}/>;
        } else if (executingTurn === 'Robber') {
            return <Robber
                        roleData={this.props.roleData}
                        allPlayers={this.props.allPlayers}
                        playerName={this.props.playerName}
                        onRoleSwitch={(p1, p2) => this.props.onRoleSwitch(p1, p2, 'Robber')}/>;
        } else if (executingTurn === 'Troublemaker') {
            return <Troublemaker
                        allPlayers={this.props.allPlayers}
                        playerName={this.props.playerName}
                        onRoleSwitch={(p1, p2) => this.props.onRoleSwitch(p1, p2, 'Troublemaker')}/>;
        } else if (executingTurn === 'Inexplicable') {
            return <Inexplicable
                        roleData={this.props.roleData}
                        allPlayers={this.props.allPlayers}
                        playerName={this.props.playerName}
                        onRoleSwitch={(p1, p2) => this.props.onRoleSwitch(p1, p2, 'Inexplicable')}
                        rolesInGame={this.props.rolesInGame}/>;
        }
    }

    renderPlayerActionCenter() {
        const assignedRole = this.props.role;
        const executingTurn = this.props.executingTurn;
        const goldenWolf = this.props.roleData['goldenWolf'];
        const renderAction = executingTurn === assignedRole || (executingTurn === 'Dog Whisperer' && goldenWolf === this.props.playerName);

        return (
            <div className='player-action-center'>
                {renderAction ? this.getActionComponentForRole() : <label className='large-label'>Nothing to do yet!</label>}
            </div>
        );
    }

    render() {
        const assignedRole = this.props.role;
        return (
            <div className='console player-night-turn-console'>
                <label className='large-label'>Your Assigned Role</label>
                <div className='role-card'>
                    <div className='role-left-panel'>
                        <img className='larger-role-image' src={utils.getImagePathForRole(assignedRole)}/>
                        <label className='adjusted-small-label'>{assignedRole}</label>
                    </div>
                    <div className='role-right-panel'>
                        <label className='larger-role-description'>{utils.getDescriptionForRole(assignedRole)}</label>
                    </div>
                </div>
                <div className='gap'>
                    <hr/>
                </div>
                {this.renderPlayerActionCenter()}
            </div>
        );
    }
};

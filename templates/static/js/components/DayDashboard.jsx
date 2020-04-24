import React, {Component} from 'react';
import utils from "../utils";

export default class DayDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isReadyToVote: false
        };
        this.handleReadyToVote = this.handleReadyToVote.bind(this);
        this.handleLeaveGame = this.handleLeaveGame.bind(this);
    }

    handleReadyToVote() {
        this.props.onReadyToVote();
        this.setState({
            isReadyToVote: true
        })
    }

    handleLeaveGame() {
        this.props.onLeaveGame();
        window.location.href = '/';
    }

    render() {
        const sortedRoles = this.props.rolesInGame.sort();
        return (
            <div className='console day-dashboard-console'>
                <label className='large-label'>Actions</label>
                {this.state.isReadyToVote ?
                    <button className='day-action-center-button-selected' disabled={true}> Ready to Vote</button> :
                    <button className='day-action-center-button' onClick={this.handleReadyToVote}> Ready to Vote</button>}
                {this.props.rolesInGame.indexOf('Podcaster') > -1 ?
                    <button className='day-action-center-button'>Request Podcaster Vote</button> :
                    null}
                <button className='day-action-center-button' onClick={this.handleLeaveGame}>Leave Game</button>
                <div className='gap'>
                    <hr />
                </div>
                <label className='medium-label'>Roles In Play</label>
                <div className='available-roles-view'>
                    {sortedRoles.map((role) =>
                        <img className='expanded-role-image' src={utils.getImagePathForRole(role)}/>)}
                </div>
            </div>
        );
    }
};

import React, {Component} from 'react';
import utils from "../utils";
import Rationalist from "./roles/Rationalist";

export default class DayDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isReadyToVote: false,
            podcastVote: ''
        };
        this.handleReadyToVote = this.handleReadyToVote.bind(this);
        this.handleLeaveGame = this.handleLeaveGame.bind(this);
        this.handlePodcastVote = this.handlePodcastVote.bind(this);
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

    handlePodcastVote(vote) {
        this.props.onPodcastVote(vote);
        this.setState({
            podcastVote: vote
        });
    }

    renderPodcastContent() {
        if (this.props.rolesInGame.indexOf('Podcaster') > -1) {
            if (this.props.podcastRequester === '') {
                return (
                    <div className='podcast-request-container'>
                        <label className='small-label'>Podcaster Request: None</label>
                        <div className='gap'>
                            <button className='day-action-center-button' onClick={this.props.onPodcastRequest}>Request Podcaster Vote</button>
                        </div>
                    </div>
                );
            } else if (this.props.podcastRequestResult === '') {
                return (
                    <div className='podcast-request-container'>
                        <label className='small-label'>Podcaster Request: {this.props.podcastRequester}</label>
                        <button
                            className={this.state.podcastVote === 'Approved' ? 'day-action-center-button-selected' : 'day-action-center-button'}
                            onClick={() => this.handlePodcastVote('Approved')}
                            disabled={this.state.podcastVote !== ''}>Approve</button>
                        <button
                            className={this.state.podcastVote === 'Rejected' ? 'day-action-center-button-selected' : 'day-action-center-button'}
                            onClick={() => this.handlePodcastVote('Rejected')}
                            disabled={this.state.podcastVote !== ''}>Reject</button>
                    </div>
                );
            } else if (this.props.playerName !== this.props.podcastRequester || this.props.podcastRequestResult === 'Rejected') {
                return (
                    <div className='podcast-request-container'>
                        <label className='medium-label'>Podcast Vote Result:</label>
                        <div className='gap'>
                            <label className='large-label'>{this.props.podcastRequestResult}</label>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className='podcast-request-container'>
                        <label className='medium-label'>Podcast Vote Approved</label>
                        <div className='podcaster-player-action-center'>
                            <Rationalist
                                roleData={this.props.roleData}
                                allPlayers={this.props.allPlayers}
                                onPlayerSelect={() => {}} />
                        </div>
                    </div>
                );
            }
        }
    }

    render() {
        const sortedRoles = this.props.rolesInGame.sort();
        const podcasterInGame = this.props.rolesInGame.indexOf('Podcaster') > -1;
        return (
            <div className='console day-dashboard-console'>
                <label className='large-label'>Actions</label>
                {this.state.isReadyToVote ?
                    <button className='day-action-center-button-selected' disabled={true}> Ready to Vote</button> :
                    <button className='day-action-center-button' onClick={this.handleReadyToVote}> Ready to Vote</button>}
                <button className='day-action-center-button' onClick={this.handleLeaveGame}>Leave Game</button>
                {this.renderPodcastContent()}

                <div className='gap'>
                    <hr />
                </div>
                <label className='medium-label'>Roles In Play</label>
                <div className={podcasterInGame ? 'available-roles-view-with-podcaster' : 'available-roles-view-no-podcaster'}>
                    {sortedRoles.map((role) =>
                        <img className='expanded-role-image' src={utils.getImagePathForRole(role)}/>)}
                </div>
            </div>
        );
    }
};

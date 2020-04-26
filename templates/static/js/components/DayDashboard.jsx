import React, {Component} from 'react';
import utils from "../utils";
import Rationalist from "./roles/Rationalist";

export default class DayDashboard extends Component {

    constructor(props) {
        super(props);

        this.handleLeaveGame = this.handleLeaveGame.bind(this);
    }

    handleLeaveGame() {
        this.props.onLeaveGame();
        window.location.href = '/';
    }


    getPodcastRequestClaimStatus() {
        let didSeeReject = false;
        for (const player of this.props.allPlayers.values()) {
            const playerClaimStatus = this.props.playerConfigs[player]['podcastConfig']['claimStatus'];
            if (playerClaimStatus === 'Approved') {
                return playerClaimStatus;
            } else if (playerClaimStatus === 'Claimed') {
                return player;
            } else if (playerClaimStatus === 'Rejected') {
                didSeeReject = true;
            }
        }
        return didSeeReject ? 'Rejected' : 'None';
    }

    getVoteStatusForPlayer(player) {
        if (this.props.playerConfigs[player]['podcastConfig']['votesFor'].indexOf(this.props.playerName) > -1) {
            return 'Approved';
        } else if (this.props.playerConfigs[player]['podcastConfig']['votesAgainst'].indexOf(this.props.playerName) > -1) {
            return 'Rejected';
        }
        return '';
    }

    renderPodcastContent() {
        if (this.props.rolesInGame.indexOf('Podcaster') > -1) {
            const claimStatus = this.getPodcastRequestClaimStatus();
            const playerClaimStatus = this.props.playerConfigs[this.props.playerName]['podcastConfig']['claimStatus'];
            if (claimStatus === 'None' || (claimStatus === 'Rejected' && playerClaimStatus !== 'Rejected')) {
                return (
                    <div className='podcast-request-container'>
                        <label className='small-label'>Podcaster Request: {claimStatus}</label>
                        <div className='gap'>
                            <button className='day-action-center-button' onClick={this.props.onPodcastRequest}>Request Podcaster Vote</button>
                        </div>
                    </div>
                );
            } else if (claimStatus !== 'Approved' && claimStatus !== 'Rejected') {
                const voteStatus = this.getVoteStatusForPlayer(claimStatus);
                return (
                    <div className='podcast-request-container'>
                        <label className='small-label'>Podcaster Request: {claimStatus}</label>
                        <button
                            className={voteStatus === 'Approved' ? 'day-action-center-button-selected' : 'day-action-center-button'}
                            onClick={() => this.props.onPodcastVote('Approved', claimStatus)}
                            disabled={voteStatus !== ''}>Approve</button>
                        <button
                            className={voteStatus === 'Rejected' ? 'day-action-center-button-selected' : 'day-action-center-button'}
                            onClick={() => this.props.onPodcastVote('Rejected', claimStatus)}
                            disabled={voteStatus !== ''}>Reject</button>
                    </div>
                );
            } else if (playerClaimStatus === 'Rejected' || (claimStatus === 'Approved' && playerClaimStatus !== 'Approved')) {
                return (
                    <div className='podcast-request-container'>
                        <label className='medium-label'>Podcast Vote Result:</label>
                        <div className='gap'>
                            <label className='large-label'>{claimStatus}</label>
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
        const isReadyToVote = this.props.playerConfigs[this.props.playerName]['readyToVote'];
        return (
            <div className='console day-dashboard-console'>
                <label className='large-label'>Actions</label>
                {isReadyToVote ?
                    <button className='day-action-center-button-selected' disabled={true}> Ready to Vote</button> :
                    <button className='day-action-center-button' onClick={this.props.onReadyToVote}> Ready to Vote</button>}
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

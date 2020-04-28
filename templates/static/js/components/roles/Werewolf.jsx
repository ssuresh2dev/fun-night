import React, {Component} from 'react';

export default class Werewolf extends Component {

    constructor(props) {
        super(props);
        this.state = {
            revealedCenterCard: ''
        };

        this.onRevealCenterCard = this.onRevealCenterCard.bind(this);
    }

    onRevealCenterCard() {
        const indexOfCard = Math.floor(Math.random() * 3);
        const centerCard = this.props.roleData['centerRoles'][indexOfCard];
        this.setState({
            revealedCenterCard: centerCard
        })
    }

    renderWerewolfTurn() {
        const allWerewolves = this.props.roleData['originalRoleMapping']['Werewolf'];
        const otherWerewolves = allWerewolves.filter((name) => name !== this.props.playerName);
        const dogWhispererInGame = this.props.rolesInGame.indexOf('Dog Whisperer') > -1;
        const isAssignedGoldenWolf = dogWhispererInGame && this.props.playerName === this.props.roleData['goldenWolf'];
        const singleWerewolfDW = 'You must reveal yourself as the Golden Wolf to the Dog Whisperer';
        const multiWerewolfDW = 'You are the Golden Wolf! You must reveal yourself to the Dog Whisperer when they wake up';

        if (otherWerewolves.length === 0) {
            return (
                <div className='action-container'>
                    <label className='medium-label'>You are the only Werewolf.</label>
                    <label className='small-label'>Inspect a card from the center:</label>
                    {this.state.revealedCenterCard === '' ?
                        <button className='day-action-center-button' onClick={this.onRevealCenterCard}>Reveal</button> :
                        <label className='large-label'>{this.state.revealedCenterCard}</label>}
                    {isAssignedGoldenWolf ? <label className='small-label'>{singleWerewolfDW}</label> : null}
                </div>
            );
        } else {
            return (
                <div className='action-container'>
                    <label className='medium-label'>These are your fellow Werewolves:</label>
                    {otherWerewolves.map((name) => <label className='large-label'>{name}</label>)}
                    {isAssignedGoldenWolf ? <label className='small-label'>{multiWerewolfDW}</label> : null}
                </div>
            );
        }
    }

    renderGoldenWolfTurn() {
        const dogWhisperer = this.props.roleData['originalRoleMapping']['Dog Whisperer'];
        return (
            <div className='action-container'>
                <label className='medium-label'>You were chosen as the Golden Wolf</label>
                {dogWhisperer === '' ?
                    <div className='gap'>
                        <label className='small-label'>There is no Dog Whisperer in the game</label>
                    </div> :
                    <div className='gap'>
                        <label className='small-label'>The Dog Whisperer is:</label>
                        <label className='large-label'>{dogWhisperer}</label>
                    </div>

                }
            </div>
        );
    }

    render() {
        if (this.props.isGoldenWolfTurn) {
            return this.renderGoldenWolfTurn();
        } else {
            return this.renderWerewolfTurn();
        }
    }
};

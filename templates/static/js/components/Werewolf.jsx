import React, {Component} from 'react';

export default class Werewolf extends Component {

    constructor(props) {
        super(props);
        this.state = {
            revealedCenterCard: ''
        };

        this.revealCenterCard = this.revealCenterCard.bind(this);
    }

    revealCenterCard() {
        const indexOfCard = Math.floor(Math.random() * 3);
        const centerCard = this.props.roleData['centerRoles'][indexOfCard];
        this.setState({
            revealedCenterCard: centerCard
        })
    }

    render() {
        if (this.props.playerRole === 'Werewolf') {
            const allWerewolves = this.props.roleData['originalRoleMapping']['Werewolf'];
            const dogWhispererInGame = this.props.rolesInPlay.indexOf('Dog Whisperer') > -1;
            const singleWerewolfDogWhisperer = 'You are the only Werewolf. You must reveal yourself to the Dog Whisperer.';
            const singleWerewolf = 'You are the only Werewolf.';

            if (allWerewolves.length === 1) {
                return (
                    <div id='role-console'>
                        <label>{dogWhispererInGame ? singleWerewolfDogWhisperer : singleWerewolf}</label>
                        <label>Inspect a card from the center:</label>
                        {this.state.revealedCenterCard === '' ?
                            <button onClick={this.revealCenterCard}>Reveal</button> :
                            <label>{this.state.revealedCenterCard}</label>}
                    </div>
                );
            } else {
                return (
                    <div id='role-console'>
                        <label>These are your fellow Werewolves:</label>
                        {allWerewolves.map((name) => <label>{name}</label>)}
                        {this.state.revealedCenterCard === '' ?
                            <button onClick={this.revealCenterCard}>Reveal</button> :
                            <label>{this.state.revealedCenterCard}</label>}
                    </div>
                );
            }
        }

    }
};

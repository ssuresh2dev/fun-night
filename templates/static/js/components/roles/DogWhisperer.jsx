import React, {Component} from 'react';

export default class DogWhisperer extends Component {

    constructor(props) {
        super(props);
    }

    renderGoldenWolfText() {
        const goldenWolf = this.props.roleData['goldenWolf'];
        const allWerewolves = this.props.roleData['originalRoleMapping']['Werewolf'];
        if (allWerewolves.length === 0) {
            return (
                <div className='gap'>
                    <label className='large-label'>No Werewolves! You must behave as a Werewolf now.</label>
                </div>
            );
        } else if (allWerewolves.length === 1) {
            return (
                <div className='gap'>
                    <label className='large-label'>{goldenWolf}</label>
                    <label className='small-label'>This is the only Werewolf in the game. You must behave as a Werewolf now.</label>
                </div>
            );
        } else {
            return (
                <div className='gap'>
                    <label className='large-label'>{goldenWolf}</label>
                </div>
            );
        }
    }

    render() {
        return (
            <div className='action-container'>
                <label className='medium-label'>This is the Golden Wolf:</label>
                {this.renderGoldenWolfText()}
            </div>
        );
    }
};

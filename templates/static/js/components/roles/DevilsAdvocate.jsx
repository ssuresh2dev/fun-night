import React, {Component} from 'react';

export default class DevilsAdvocate extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const allWerewolves = this.props.roleData['originalRoleMapping']['Werewolf'];
        return (
            <div className='action-container'>
                <label className='medium-label'>These are the Werewolves:</label>
                {allWerewolves.length > 0 ?
                    allWerewolves.map((name) => <label className='large-label'>{name}</label>) :
                    <label className='large-label'>No Werewolves! You must behave as a Werewolf now.</label>}
            </div>
        );
    }
};

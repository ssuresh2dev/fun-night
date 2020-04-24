import React, {Component} from 'react';

export default class Mason extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const masons = this.props.roleData['originalRoleMapping']['Mason'];
        const otherMasons = masons.filter((name) => name !== this.props.playerName);
        return (
            <div className='action-container'>
                <label className='medium-label'>These are the other Masons:</label>
                {otherMasons.length > 0 ?
                    otherMasons.map((name) => <label className='large-label'>{name}</label>) :
                    <label className='large-label'>No Other Masons!</label>}
            </div>
        );
    }
};

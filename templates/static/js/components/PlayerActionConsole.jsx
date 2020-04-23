import React, {Component} from 'react';
import utils from "../utils";

export default class PlayerActionConsole extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const assignedRole = this.props.role;
        return (
            <div className='console player-night-turn-console'>
                <label className='large-label'>Your Assigned Role</label>
                <div className='role-card'>
                    <div className='role-left-panel'>
                        <img className='larger-role-image' src={utils.getImagePathForRole(assignedRole)}/>
                        <label className='small-label'>{assignedRole}</label>
                    </div>
                    <div className='role-right-panel'>
                        <label className='larger-role-description'>{utils.getDescriptionForRole(assignedRole)}</label>
                    </div>
                </div>
                <div className='gap'>
                    <hr/>
                </div>
                <div className='player-action-center'>
                    <label className='large-label'>Nothing to do yet!</label>
                </div>
            </div>
        );
    }
};

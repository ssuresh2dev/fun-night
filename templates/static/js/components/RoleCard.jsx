import React, {Component} from 'react';
import utils from "../utils";

export default class RoleCard extends Component {

    render() {
        return (
            <div className='role-card'>
                <div className='role-left-panel'>
                    <img className='role-image' src={utils.getImagePathForRole(this.props.role)}/>
                    <label className='small-label'>{this.props.role}</label>
                </div>
                <div className='role-right-panel'>
                    <label className='role-description'>{utils.getDescriptionForRole(this.props.role)}</label>
                </div>
            </div>
        );
    }
};

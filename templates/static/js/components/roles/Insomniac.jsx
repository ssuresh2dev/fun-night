import React, {Component} from 'react';
import utils from "../../utils";

export default class Insomniac extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const role = this.props.roleData['currentAssignments'][this.props.playerName];
        return (
            <div className='action-container'>
                <label className='medium-label'>This is your current role:</label>
                <label className='large-label'>{utils.getDisplayNameForRole(role)}</label>
            </div>
        );
    }
};

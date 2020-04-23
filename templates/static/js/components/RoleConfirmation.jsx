import React, {Component} from 'react';
import utils from '../utils';

export default class RoleConfirmation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            didConfirm: false
        };
        this.handleConfirmation = this.handleConfirmation.bind(this);
    }

    handleConfirmation() {
        this.setState({
            didConfirm: true
        });
        this.props.onConfirm();
    }

    render() {
        return (
            <div className='console role-confirmation-console'>
                <div className='role-confirmation-info'>
                    <label className='large-label'>Your Assigned Role</label>
                    <img className='role-image' src={utils.getImagePathForRole(this.props.role)}/>
                    <label className='xlarge-label'>{this.props.role}</label>
                </div>
                <button className='role-confirmation-button' onClick={this.handleConfirmation}>{this.state.didConfirm ? 'Waiting for others...' : 'Confirm'}</button>
            </div>
        );
    }
};

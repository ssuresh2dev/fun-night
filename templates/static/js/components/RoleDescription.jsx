import React, {Component} from 'react';
import { Badge } from '@material-ui/core';
import RoleCard from "./RoleCard";

export default class RoleDescription extends Component {

    constructor(props) {
        super(props);
        this.handleRoleAdded = this.handleRoleAdded.bind(this);
        this.handleRoleRemoved = this.handleRoleRemoved.bind(this);
        this.getBadgeContent = this.getBadgeContent.bind(this);
        this.state = {
            selectedCount: 0
        }
    }

    handleRoleAdded() {
        const role = this.props.role;
        const multipleSupportedRoles = ['Werewolf', 'Villager', 'Mason'];
        if ((this.state.selectedCount === 0 || multipleSupportedRoles.indexOf(role) > -1) && !this.props.capacityFilled) {
            this.setState({
                selectedCount: this.state.selectedCount + 1
            });
            this.props.onRoleAdd();
        }
    }

    handleRoleRemoved() {
        if (this.state.selectedCount > 0) {
            this.setState({
                selectedCount: this.state.selectedCount - 1
            });
            this.props.onRoleRemove();
        }
    }

    getBadgeContent() {
        return this.state.selectedCount ? this.state.selectedCount : '0';
    }

    render() {
        if (this.props.host) {
            return (
                <div className='host-accounted-role-card'>
                    <Badge component='span' badgeContent={this.getBadgeContent()} color='primary'>
                        <RoleCard role={this.props.role} />
                    </Badge>
                    <div className='host-role-selection'>
                        <button className='host-role-selection-button' onClick={this.handleRoleAdded}>Add</button>
                        <button className='host-role-selection-button' onClick={this.handleRoleRemoved}>Remove</button>
                    </div>
                </div>
            );
        } else {
            return (
                <div className='host-accounted-role-card'>
                    <RoleCard role={this.props.role} />
                </div>
            );
        }
    }
};

import React, {Component} from 'react';

export default class PlayerInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playerNameInput: ''
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.savePlayerInfo = this.savePlayerInfo.bind(this);
    }

    handleInputChange(content) {
        this.setState({
            playerNameInput: content.target.value
        });
    }

    savePlayerInfo() {
        this.props.onSave(this.state.playerNameInput);
    }

    render() {
        return (
            <div>
                <label className='large-label'>Enter Your Name</label>
                <input type="text" className='large-input' onChange={this.handleInputChange}/>
                <button className='action-button' onClick={this.savePlayerInfo}>Save</button>
            </div>
        );
    }
};

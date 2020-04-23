import React, {Component} from 'react';
import {CountdownCircleTimer} from "react-countdown-circle-timer";

export default class PlayerCircle extends Component {

    constructor(props) {
        super(props);
        this.renderCircleContent = this.renderCircleContent.bind(this);
    }

    renderCircleContent(value) {
        return (
            <div className='circle-content-container'>
                <div className='circle-content'>
                    <label className='xlarge-label'>Currently Awake:</label>
                    <label className='xxlarge-label'>{this.props.executingTurn}</label>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className='console player-circle-console'>
                <CountdownCircleTimer
                    isPlaying={true}
                    durationSeconds={this.props.countdownTime}
                    colors={[["#EA6227", 0.33]]}
                    onComplete={this.props.onFinish}
                    size={400}
                    renderTime={(value) => this.renderCircleContent(value)}
                    key={this.props.executingTurn}/>
            </div>
        );
    }
};

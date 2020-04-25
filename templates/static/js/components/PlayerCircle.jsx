import React, {Component} from 'react';
import {CountdownCircleTimer} from "react-countdown-circle-timer";

export default class PlayerCircle extends Component {

    constructor(props) {
        super(props);
        this.renderNightContent = this.renderNightContent.bind(this);
        this.renderDayContent = this.renderDayContent.bind(this);
    }

    renderNightContent({remainingTime}) {
        return (
            <div className='circle-content-container'>
                <div className='circle-content'>
                    <label className='xlarge-label'>Currently Awake:</label>
                    <label className='xxlarge-label'>{this.props.executingTurn}</label>
                </div>
            </div>
        );
    }

    renderDayContent({remainingTime}) {
        const minutes = Math.floor(remainingTime / 60);
        let seconds = remainingTime - (minutes * 60);
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return (
            <div className='circle-content-container'>
                <div className='centered-circle-content'>
                    <label className='circle-content-timer'>{minutes}:{seconds}</label>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className='console player-circle-console'>
                <CountdownCircleTimer
                    isPlaying={true}
                    duration={this.props.countdownTime}
                    colors={[["#EA6227", 0.33]]}
                    onComplete={this.props.onFinish}
                    size={400}
                    key={this.props.gameState === 'night' ? this.props.executingTurn: this.props.gameState}>
                    {this.props.gameState === 'night' ? this.renderNightContent : this.renderDayContent}
                </CountdownCircleTimer>
            </div>
        );
    }
};

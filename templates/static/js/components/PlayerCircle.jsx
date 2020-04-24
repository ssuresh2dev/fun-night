import React, {Component} from 'react';
import {CountdownCircleTimer} from "react-countdown-circle-timer";

export default class PlayerCircle extends Component {

    constructor(props) {
        super(props);
        this.renderNightContent = this.renderNightContent.bind(this);
        this.renderDayContent = this.renderDayContent.bind(this);
    }

    renderNightContent(value) {
        return (
            <div className='circle-content-container'>
                <div className='circle-content'>
                    <label className='xlarge-label'>Currently Awake:</label>
                    <label className='xxlarge-label'>{this.props.executingTurn}</label>
                </div>
            </div>
        );
    }

    renderDayContent(value) {
        const minutes = Math.floor(value / 60);
        let seconds = value - (minutes * 60);
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
                    durationSeconds={this.props.countdownTime}
                    colors={[["#EA6227", 0.33]]}
                    onComplete={this.props.onFinish}
                    size={400}
                    renderTime={(value) => this.props.gameState === 'night' ? this.renderNightContent(value) : this.renderDayContent(value)}
                    key={this.props.gameState === 'night' ? this.props.executingTurn: this.props.gameState}/>
            </div>
        );
    }
};

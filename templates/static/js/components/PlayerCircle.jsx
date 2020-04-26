import React, {Component} from 'react';
import {CountdownCircleTimer} from "react-countdown-circle-timer";

export default class PlayerCircle extends Component {

    constructor(props) {
        super(props);
        this.renderNightContent = this.renderNightContent.bind(this);
        this.renderDayContent = this.renderDayContent.bind(this);
    }

    getPlayerLabelCoordinates() {
        let xCoords = [];
        let yCoords = [];
        const numPlayers = this.props.allPlayers.length;
        for (let i = 0; i < numPlayers; i++) {
            let degree = 360 / numPlayers * i;
            let changeY = 260 - (Math.sin(degree * Math.PI / 180) * 260);
            changeY = Math.round(changeY * 100) / 100;
            let changeX = 260 - (Math.cos(degree * Math.PI / 180) * 260);
            changeX = Math.round(changeX * 100) / 100;

            // Rotate by 90 degrees to be top-centric
            const tmp = changeX;
            changeX = -1 * changeY;
            changeY = tmp;
            if (changeX < 0) {
                changeX += 520;
            }

            yCoords = [...yCoords, changeY];
            xCoords = [...xCoords, changeX];
        }
        return [xCoords, yCoords];
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

    renderPlayerLabels() {
        const coordinates = this.getPlayerLabelCoordinates();
        let labels = [];
        for (let i = 0; i < this.props.allPlayers.length; i++) {
            const style = {
                container: {
                    fontSize: '16px',
                    fontFamily: 'Avenir, monospace',
                    width: '50px',
                    position: 'absolute',
                    left: (coordinates[0][i] - 25) + 'px',
                    top: coordinates[1][i] + 'px'
                }
            };
            labels.push(
                <label style={style.container}>
                    {this.props.allPlayers[i]}
                </label>
            );
        }
        return labels;
    }

    render() {
        return (
            <div className='console player-circle-console'>
                <div className='circle-with-names-container'>
                    <CountdownCircleTimer
                        isPlaying={true}
                        duration={this.props.countdownTime}
                        colors={[["#EA6227", 0.33]]}
                        onComplete={this.props.onFinish}
                        size={400}
                        key={this.props.gameState === 'night' ? this.props.executingTurn: this.props.gameState}>
                        {this.props.gameState === 'night' ? this.renderNightContent : this.renderDayContent}
                    </CountdownCircleTimer>
                    {this.renderPlayerLabels()}
                </div>
            </div>
        );
    }
};

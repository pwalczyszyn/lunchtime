import React from 'react';

const times = {
    weekdays: {
        1: 'Mon',
        2: 'Tue',
        3: 'Wed',
        4: 'Thu',
        5: 'Fri',
        6: 'Sat',
        0: 'Sun'
    },
    hours: Array(24).fill(0).map((v, i) => i), // 0..23
    minutes: [0, 15, 30, 45]
};

class DayInput extends React.Component {

    constructor(props) {
        super(props);

        this.state = props.day;
    }

    onHourChange(event, target) {
        const propName = `${target}Time`;
        const time = this.state[propName];
        this.setState({
            [propName]: `${event.target.value}:${time.split(':')[1]}`
        });
    }

    onMinChange(event, target) {
        const propName = `${target}Time`;
        const time = this.state[propName];
        this.setState({
            [propName]: `${time.split(':')[0]}:${event.target.value}`
        });
    }

    onEnabledChange(event) {
        this.setState({
            enabled: event.target.value
        });
    }

    render() {

        const startHour = this.state.startTime.split(':')[0];
        const startMin = this.state.startTime.split(':')[1];
        const endHour = this.state.endTime.split(':')[0];
        const endMin = this.state.endTime.split(':')[1];

        return <div className="App-dayInput-container">
            <input type="checkbox" checked={this.state.enabled} onChange={event => this.onEnabledChange(event)} />
            Start time:
            <select value={startHour} onChange={event => this.onHourChange(event, 'start')}>
                {times.hours.map(hour => <option key={hour} value={hour}>{hour}</option>)}
            </select>
            <select value={startMin} onChange={event => this.onMinChange(event, 'start')}>
                {times.minutes.map(min => <option key={min} value={min}>{min}</option>)}
            </select>
            End time:
            <select value={endHour} onChange={event => this.onHourChange(event, 'end')}>
                {times.hours.map(hour => <option key={hour} value={hour}>{hour}</option>)}
            </select>
            <select value={endMin} onChange={event => this.onMinChange(event, 'end')}>
                {times.minutes.map(min => <option key={min} value={min}>{min}</option>)}
            </select>
        </div>;
    }
}

export default class FeedEdit extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            feed: props.feed || {
                id: undefined,
                weekdays: Object.keys(times.weekdays).map(dayNum => {
                    return {
                        enabled: false,
                        dayNum: dayNum,
                        dayLabel: times.weekdays[dayNum],
                        startTime: '11:30',
                        endTime: '12:30',
                    };
                })
            }
        };
    }

    onAddClick() {
        if (!this.state.feed.id) {
            alert('Missing FB feed ID!');
            return;
        }
        this.props.onAdd(this.state.feed);
    }

    render() {

        const feed = this.state.feed;

        return <div>
            <label>
                FB Page ID:
                <input type="text" value={feed.id} onChange={event => feed.id = event.target.value}/>
            </label>
            {feed.weekdays.map(day => <DayInput key={day.dayNum} day={day} />)}
            <div>
                <button onClick={event => this.onAddClick()}>Add</button>
            </div>
        </div>;
    }
}

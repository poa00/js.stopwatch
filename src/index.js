import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import 'normalize.css';
import 'purecss/build/pure.css';
import './index.css';

function Button(props) {
  return (
    <button className='pure-button button' style={{color: props.color, background: props.background}} onClick={() => !props.disabled && props.onClick()}>{props.title}</button>
  )
}

function Buttons(props) {
  return (<div className='buttons'>{props.children}</div>)
}

function Display(props) {
  const total_time = moment.duration(props.total_time);
  const format_time = (n) => n < 10 ? '0' + n : n;
  const hundreth_of_a_second = Math.floor(total_time.milliseconds() / 10);
  return (
    <div className={props.selector}>
      {format_time(total_time.minutes())}:{format_time(total_time.seconds())}:{format_time(hundreth_of_a_second)}
    </div>
  );
}

function LapRow(props) {
  return (
    <tr>
        <td>Lap {props.number}</td>
        <td><Display total_time={props.total_time} selector='table_row' /></td>
    </tr>
  )
}

function LapsTable(props) {
  return (
    <table className='pure-table pure-table-bordered laps_table'>
        <tbody>
          {props.lap_markers.map((lap, index) => (
            <LapRow
              key={props.lap_markers.length - index}
              number={props.lap_markers.length - index}
              total_time={index === 0 ? props.now_minus_start + lap : lap}
            />
          ))}
        </tbody>
    </table>
  )
}

class Stopwatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lap_markers: [],
      start: 0,
      now: 0,
    }
  }

  componentWillUnmount() {
    clearInterval(this.tick);
  }

  lap = () => {
    const lap_marker = new Date().getTime();
    const { lap_markers, now, start } = this.state;
    const [lap1, ...more] = lap_markers;
    this.setState({
      lap_markers: [0, lap1 + now - start, ...more],
      start: lap_marker,
      now: lap_marker,
    })
  }

  start = () => {
    const now = new Date().getTime();
    this.setState({
      lap_markers: [0],
      start: now,
      now: now,
    })
    this.tick = setInterval(() => {
      this.setState({now: new Date().getTime()});
    }, 100);
  }

  stop = () => {
    clearInterval(this.tick);
    const { lap_markers, now, start } = this.state;
    const [lap1, ...more] = lap_markers;
    this.setState({
      lap_markers: [lap1 + now - start, ...more],
      start: 0,
      now: 0,
    })
  }

  reset = () => {
    this.setState({
      lap_markers: [],
      start: 0,
      now: 0,
    })
  }

  resume = () => {
    const now = new Date().getTime();
    this.setState({
      start: now,
      now: now
    });
    this.tick = setInterval(() => {
      this.setState({now: new Date().getTime()});
    }, 100);
  }

  render() {
    const {now, start, lap_markers} = this.state;
    const now_minus_start = now - start;
    return (
      <div>
        <div className='pure-g container'>
          <div className='pure-u-5-6'>
          </div>
          <div className='pure-u-1-8'>
            {lap_markers.length === 0 && (
              <Buttons>
                <p>
                  <Button
                    background='#00ffa2'
                    color='#004466'
                    onClick={this.start}
                    title='Start'
                  />
                </p>
                <p>
                  <Button
                    background='#ffffff'
                    color='#004466'
                    disabled
                    title='Reset'
                  />
                </p>
              </Buttons>
            )}
            {start > 0 && (
              <Buttons>
                <p>
                  <Button
                    background='#ff5500'
                    color='#004466'
                    onClick={this.stop}
                    title='Stop'
                  />
                </p>
                <p>
                  <Button
                    background='#ffffff'
                    color='#004466'
                    onClick={this.lap}
                    title='Lap'
                  />
                </p>
              </Buttons>
            )}
            {lap_markers.length > 0 && start === 0 && (
              <Buttons>
                <p>
                  <Button
                    background='#00ffa2'
                    color='#004466'
                    onClick={this.resume}
                    title='Start'
                  />
                </p>
                <p>
                  <Button
                    background='#ffffff'
                    color='#004466'
                    onClick={this.reset}
                    title='Reset'
                  />
                </p>
              </Buttons>
            )}
          </div>
          <div className='pure-u-1-24'>
          </div>
        </div>
        <div className='pure-g container'>
          <div className='pure-u-1-24'>
          </div>
          <div className='pure-u-1-3'>
            <Display
              total_time={lap_markers.reduce((total, curr) => total + curr, 0) + now_minus_start}
              selector='main_display'
            />
          </div>
        </div>
        <div className='pure-g container'>
          <div className='pure-u-1-24'>
          </div>
          <div className='pure-u-1-3'>
            <LapsTable
              lap_markers={lap_markers}
              now_minus_start={now_minus_start}
            />
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Stopwatch />,
  document.getElementById('root')
);

import '../styles/CountdownClock.css';
import React from 'react';
import convertToMinutes from '../functions/convertToMinutes';

class CountdownClock extends React.Component{
  constructor(props){
    super(props);
      this.state = {
        timeRemaining: 1500,      //in seconds
        breakLength: 300,         //in seconds
        sessionLength: 25,        //in minutes
        paused: true,
        onBreak: false
      }
      this.displayTime = this.displayTime.bind(this);
      this.playPause = this.playPause.bind(this);
      this.handlePlayPause = this.handlePlayPause.bind(this);
      this.handleBreak = this.handleBreak.bind(this);
      this.reset = this.reset.bind(this);

      this.increaseSessionLength = this.increaseSessionLength.bind(this);
      this.decreaseSessionLength = this.decreaseSessionLength.bind(this);
      this.increaseBreakLength = this.increaseBreakLength.bind(this);
      this.decreaseBreakLength = this.decreaseBreakLength.bind(this);
  }

/*DISPLAYS TIME IN CLOCK FASHION*/
  displayTime = (minutesAndSeconds) => {       
    let minutes = minutesAndSeconds[0];
    let seconds = minutesAndSeconds[1];
    return (
      <span id='clock-display'>
        {minutes < 0 ? <h1 className='timer'>00</h1> : minutes < 10 ? <h1 className='timer'>0{minutes}</h1> 
          : <h1 className='timer'>{minutes}</h1>}
        {seconds === null ? <h1 className='timer'>:00</h1> : seconds < 10 ? <h1 className='timer'>:0{seconds}</h1> 
          : <h1 className='timer'>:{seconds}</h1>}
      </span>
    )
  }
/*END OF CLOCK-DISPLAY LOGIC*/

/*TOGGLE PAUSE*/
  playPause(){                                                          
    this.setState({paused: !this.state.paused}, this.handlePlayPause);  
  }
/*END OF TOGGLING PAUSE IN STATE*/

/*HANDLES TIMER LOGIC BASED ON CURRENT STATE*/
  handlePlayPause(){                                                 
    if(!this.state.paused){                                              //If the timer ISN'T paused...
      let rightNow = new Date().getTime();                                   //Make a var equal to the current time in ms
      let OneSecondFromNow = new Date().getTime() + 1000;                    //Make another variable equal to one second from now
      let interval = setInterval(() => {                                     //3. Local var 'interval' is equal to this loop function that gets called every 30ms and doesn't stop until cleared(), returns current loop number
        rightNow = new Date().getTime();                                         //Reassign the value of rightNow to this very moment in milliseconds           
        if(this.state.timeRemaining !== 0 && rightNow > OneSecondFromNow)        //If timer is still going and current time is greater than one second from when we started checking...
        {                                                   
          this.setState(newState => ({timeRemaining: newState.timeRemaining - 1}))               //Take away a second from the clock
          OneSecondFromNow += 1000;                                                  //Add one second to the time we want to compare against
        }
        else if(this.state.timeRemaining === 0){                                 //If the timer has reached 0...
          clearInterval(localStorage.getItem('interval'));                           //Stop the current loop
          document.getElementById('beep').play();                                    //Play the alarm sound
          this.handleBreak();                                //Then handleBreak after 5 seconds
        }
      }, 30);
      localStorage.clear();                                                  //1. Clear any local storage data
      localStorage.setItem('interval', interval);                            //2. Then set storage key 'interval' equal to the above local var 'interval', automatically calling its loop function until cleared
    }                                                                            
    else if(this.state.paused){                                          //If the timer IS paused...
      clearInterval(localStorage.getItem("interval"));                       //End the current loop when paused to prevent multiple loops being created and running at once
    }
  }
  /*END OF HANDLING TIMER LOGIC*/

  /*HANDLE BREAK WHEN TIMER REACHES ZERO*/
  handleBreak(){
    console.log('handle break: ' + this.state.onBreak);
    setTimeout(() => 
    {
      if(this.state.onBreak){
        this.setState({timeRemaining: this.state.sessionLength*60, onBreak: false}, () => setTimeout(this.handlePlayPause, 1000));
        console.log('onBreak: ' + this.state.onBreak);
      }
      else if(!this.state.onBreak){
        this.setState({timeRemaining: this.state.breakLength, onBreak: true}, () => setTimeout(this.handlePlayPause, 1000));
        console.log('!onBreak: ' + this.state.onBreak);
      }
    }, 1000)
  }
  /*END OF HANDLING BREAK*/ 

  /*INCREASE BREAK LENGTH*/
  increaseBreakLength(){
    if(this.state.onBreak){
      this.state.breakLength <= 3540 ? this.setState(newState => ({breakLength: newState.breakLength + 60, timeRemaining: newState.timeRemaining + 60})) : null;
    }
    else{
      this.state.breakLength <= 3540 ? this.setState(newState => ({breakLength: newState.breakLength + 60})) : null;
    }
  }
  /*END OF INCREASE BREAK LENGTH*/

/*DECREASE BREAK LENGTH*/
  decreaseBreakLength(){
    if(this.state.onBreak){
      this.state.breakLength > 60 ? this.setState(newState => ({breakLength: newState.breakLength - 60, timeRemaining: newState.timeRemaining - 60})) : null;
    }
    else{
      this.state.breakLength > 60 ? this.setState(newState => ({breakLength: newState.breakLength - 60})) : null;
    }
  }
/*END OF DECREASE BREAK LENGTH*/

/*INCREASE SESSION LENGTH*/
  increaseSessionLength(){
    if(!this.state.onBreak){
      this.state.sessionLength <= 59 ? 
        this.setState(newState => ({
          sessionLength: newState.sessionLength + 1 , timeRemaining: newState.timeRemaining + 60
        })) : null;
    }
    else{
      this.state.sessionLength <= 59 ? this.setState(newState => ({sessionLength: newState.sessionLength + 1})) : null;
    }
  }
/*END OF INCREASE SESSION LENGTH*/

/*DECREASE SESSION LENGTH*/
  decreaseSessionLength(){
    if(!this.state.onBreak){
      /*
      this.state.timeRemaining > 60 ? this.setState(newState => ({
        sessionLength: newState.sessionLength - 1, timeRemaining: newState.timeRemaining - 60
      })) : null;
      */
      this.state.timeRemaining > 60 ? this.setState(state => ({sessionLength: state.sessionLength - 1, timeRemaining: state.timeRemaining - 60})) 
      : this.state.timeRemaining <= 60 && this.state.timeRemaining > 10 ? this.setState({timeRemaining: this.state.timeRemaining - 10}) 
      : null;
      
    }
    else{
      this.state.sessionLength > 1 ? this.setState(newState => ({sessionLength: newState.sessionLength - 1})) 
      : null;
    }
  }
  /*END OF DECREASE SESSION LENGTH*/

  /*RESET STATE*/
  reset(){                                                               //Set timer and break time back to original
    document.getElementById('beep').pause();
    document.getElementById('beep').currentTime = 0;
    this.setState({timeRemaining: 1500, breakLength: 300, sessionLength: 25, paused: true, onBreak: false}, this.playPause())
  }
  /*END OF STATE RESET*/

  render(){
    return(
      <div id='app'>
        <audio id='beep' src='alarm.mp3'></audio>
        <h1 className='title'>25 + 5 CLOCK</h1>
        <div className='sessionBreakRowHeaders'>
          <span id='break-label' className='label'>Break Length</span> <span id='session-label' className='label'>Session Length</span>
        </div>
        <div className='sessionBreakRow'>
          <div className='buttonRow'>
            <button id='break-increment' onClick={() => this.increaseBreakLength()}>UP</button>
            <h1 id='break-length'>{convertToMinutes(this.state.breakLength)}</h1>
            <button id='break-decrement' onClick={() => this.decreaseBreakLength()}>DOWN</button>
          </div>
          <div className='buttonRow'>
            <button id='session-increment' onClick={() => this.increaseSessionLength()}>UP</button>
            <h1 id='session-length'>{this.state.sessionLength}</h1>
            <button id='session-decrement' onClick={() => this.decreaseSessionLength()}>DOWN</button>
          </div>
        </div>
        <div className='timerDisplay'>
          <h1 id='timer-label'>{this.state.onBreak ? 'Break' : 'Session'}</h1>
          <h1 id='time-left'>{this.displayTime(convertToMinutes(this.state.timeRemaining))}</h1>
        </div>
        <div className='buttonRow'>
          <button id='start_stop' className='playPause' onClick={this.playPause}>
            {this.state.paused && 'play'}{!this.state.paused && 'pause'}
          </button>
          <button id='reset' onClick={this.reset}>Reset</button>
        </div>
      </div>
    )
  }
}

export default CountdownClock

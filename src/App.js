import React, { Component } from 'react';
import './App.css';
// import $ from 'jquery';
import Webcam from 'react-webcam';

class WebcamCapture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
  }
  setRef = (webcam) => {
    this.webcam = webcam;
  }

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    // var data = function to convert imageSrc to the format
    // var data;
    // $.post("demo_test.asp", data, function(data, status){ // $ is a jquery object
    //     alert("Data: " + data + "\nStatus: " + status);
    // });
    this.setState({message: 'I took the picture'});
  };

  render() {
    return (
      <div>
        {this.state.message}
        <Webcam
          audio={false}
          height={350}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={350}
        />
        <button onClick={this.capture}>Capture photo</button>
      </div> 
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Ava</h1>
        </header>
        <p className="App-intro">
          Before we let you access your account, we need to verify your identity. Please sit in front of your webcam.
        </p>
        <WebcamCapture/> 
      </div>
    );
  }
}

export default App;

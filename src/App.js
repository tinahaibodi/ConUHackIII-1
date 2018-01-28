 /*eslint-env jquery*/

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
    this.count = 0;
    this.pictures = [];
    this.cap = this.cap.bind(this);
    this.sendPics = this.sendPics.bind(this); 
    this.capture = this.capture.bind(this);
  }

  setRef = (webcam) => {
    this.webcam = webcam;
  }


  capture = () => {
    var imageSrc = this.webcam.getScreenshot();
    this.pictures.push(imageSrc);
    // var data = function to convert imageSrc to the format
    // var data;
    // $.post("demo_test.asp", data, function(data, status){ // $ is a jquery object
    //     alert("Data: " + data + "\nStatus: " + status);
    // });
    console.log(imageSrc)
    this.setState({message: 'I took the picture' + String(this.count)});
    this.count += 1;

    if (this.count == 10) {
      clearInterval(this.nIntervalId); 
      this.count = 0;
      this.sendPics();
      this.pictures = [];
    }  

  }

  sendPics() {
//  $.post("demo_test.asp", this.pictures, function(data, status){ // $ is a jquery object
   //     alert("Data: " + data + "\nStatus: " + status);
  //    });

    $.getJSON("demo_test.asp", {
        wordlist: JSON.stringify(this.pictures)
    }, function(data, status){
        console.log(data.result)
         alert("Data: " + data + "\nStatus: " + status);
      });
  }

  cap() {
    this.nIntervalId = setInterval(this.capture, 500); 
  }

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
        <button onClick={this.cap}>Capture photo</button>
      </div> 
      )
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

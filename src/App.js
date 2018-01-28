 /*eslint-env jquery*/

import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';
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

    if (this.count == 1) {
      clearInterval(this.nIntervalId); 
      this.count = 0;
      this.sendPics();
      this.pictures = [];
    }  

  }

  b64toBlob(b64Data, contentType, sliceSize) {
          contentType = contentType || '';
          sliceSize = sliceSize || 512;

          var byteCharacters = atob(b64Data);
          var byteArrays = [];

          for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
              var slice = byteCharacters.slice(offset, offset + sliceSize);

              var byteNumbers = new Array(slice.length);
              for (var i = 0; i < slice.length; i++) {
                  byteNumbers[i] = slice.charCodeAt(i);
              }

              var byteArray = new Uint8Array(byteNumbers);

              byteArrays.push(byteArray);
          }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
  }

  convertB64(imageSrc) {
    var ImageURL = imageSrc
    // Split the base64 string in data and contentType
    var block = ImageURL.split(";");
    // Get the content type of the image
    var contentType = block[0].split(":")[1];// In this case "image/gif"
    // get the real base64 content of the file
    var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

    // Convert it to a blob to upload
    var blob = this.b64toBlob(realData, contentType);

    // Create a FormData and append the file with "image" as parameter name
    var formDataToUpload = new FormData();
    formDataToUpload.append("image", blob);

    return formDataToUpload;
  }

  sendPics() {
    var formDataToUpload = this.convertB64(this.pictures[0]);

    $.ajax({
      method: 'POST',
      url: "http://localhost:5000/demo_test.asp",
      data: formDataToUpload,
      contentType: false,
      processData: false,
      dataType: "json",
      success: function(data, status) {
        alert("Data: " + data + "\nStatus: " + status);
      }
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

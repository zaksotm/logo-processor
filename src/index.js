import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
//import './style/_buttons.scss';
import ImageUploader from 'react-images-upload';
import Jimp from 'jimp/es';

var jimp = require('jimp');


//Three global color data structures, one a map of objects, one an array,
//and one a 2D array
//TODO: Downscale to remove map of objects, unneeded
var colors = {
  black: '#000000',
  onyx: '#333538',
  charcoal: '#5f6468',
  concrete: '#97a0a7',
  quicksilver: '#e4e5e6',
  bleach: '#ffffff',
  rich_brown: '#372820',
  mushroom: '#716257',
  sand: '#bab3a0',
  natural: '#f9f4ec',
  navy: '#081e2c',
  ultramarine: '#29217d',
  lagoon: '#003e66',
  cerulean: '#0169ca',
  cornflower: '#529afc',
  cyan: '#009ff1',
  peacock: '#01aec9',
  aruba: '#9dfbe7',
  lake: '#6ac4dd',
  seafoam: '#4ca696',
  reef: '#00947d',
  teal: '#007171',
  pine: '#2b4423',
  kelly: '#21772f',
  jade: '#14b25a',
  turf: '#60933b',
  lime: '#a0ce3e',
  goldenrod: '#d5d03a',
  yellow: '#fff71b',
  sunflower: '#ffc938',
  carmel: '#d8a15e',
  clementine: '#ff9a23',
  living_coral: '#fb686d',
  persimmon: '#fd5130',
  red_orange: '#db1d3c',
  red: '#c50f2d',
  burnt_orange: '#a84c28',
  rust: '#763742',
  maroon: '#581c32',
  deep_pink: '#c40876',
  hibiscus: '#de4b9b',
  blush: '#fdaeca',
  peach: '#f7bfab',
  lavender: '#a08dd6',
  iris: '#77479f',
  purple: '#5d1e5c',
  royal_purple: '#401e72',
  moose: '#653c2c',
  violet: '#6753b2',
  green_apple: '#76c727',
  carrot: '#fd673e',
  lapis: '#3c2f8f',
  parrot: '#2fd078',
  french_blue: '#638ee4',
};

//TODO: Move initialization of arrays to seperate function
var colorsFreq = new Array(54);
var colorsArray = new Array(54);

//Initialize colorsArray
//load only hex values of colors into an array
for (var i = 0; i < colorsArray.length; i++){
  colorsArray[i] = Object.values(colors)[i];
}

//make colorsFreq into a 2D array
for (var i = 0; i < colorsFreq.length; i++){
  colorsFreq[i] = new Array(2);
}

//Initialize colorsFreq
//copy array into new 2d array, starting with 0 for all frequencies
for (var i = 0; i < colorsFreq.length; i++){
  colorsFreq[i][0] = colorsArray[i];
  colorsFreq[i][1] = 0;
}

var nearestColor = require('nearest-color').from(colors);

//initialize the default image
const src = require("./test2.jpg");
//janky way around CORS policy for getting from dropbox link, pass through cors-anywhere server
//var dropboxURL = "0"
//var imgFinal = ("https://cors-anywhere.herokuapp.com/" + dropboxURL.slice(0, -1) + "1");

//-------------------------------------------------------------
//Main classes for displaying the output image array
//-------------------------------------------------------------
class DisplayLogoImg extends React.Component{
  render(){
    return(
      <div className="workDisplay">
        <div width="300">
        Source
          <img className="workImage" src={this.props.output[0]} alt="Source" />
        </div>
        <div>
        Scale : Color Correction
          <img className="workImage" src={this.props.output[1]} alt="Result #1" />
        </div>
        <div>
        Scale : Greyscale : Color Correction
          <img className="workImage" src={this.props.output[2]} alt="Result #2" />
        </div>
        <div>
        Scale : Posterize : Color Correction
          <img className="workImage" src={this.props.output[3]} alt="Result #3" />
          <img className="workImage" src={this.props.output[4]} alt="Result #4" />
          <img className="workImage" src={this.props.output[5]} alt="Result #5" />
          <img className="workImage" src={this.props.output[6]} alt="Result #6" />
        </div>
        <div>
        Scale : Color Correction (Reduction)
          <img className="workImage" src={this.props.output[7]} alt="Result #7" />
          <img className="workImage" src={this.props.output[8]} alt="Result #8" />
          <img className="workImage" src={this.props.output[9]} alt="Result #9" />
          <img className="workImage" src={this.props.output[10]} alt="Result #10" />
        </div>
        <div>
        Scale : Posterize : Color Correction (Reduction)
          <img className="workImage" src={this.props.output[11]} alt="Result #11" />
          <img className="workImage" src={this.props.output[12]} alt="Result #12" />
          <img className="workImage" src={this.props.output[13]} alt="Result #13" />
          <img className="workImage" src={this.props.output[14]} alt="Result #14" />
        </div>
      </div>
    )
  }
}

//-------------------------------------------------------------
//Custom classes for each button, passes state up
//TODO:   Merge all of one type into a single class? [buttons, forms, etc]
//        Transfer classes into seperate file and import it
//-------------------------------------------------------------

class Linkform extends React.Component {
  render() {
    return (
      <form>
        <label>
          Dropbox Link:
          <input type="text" onChange={this.props.onChange}/>
        </label>
      </form>
    );
  }
}

class ScaleForm extends React.Component{
  render(){
    return(
      <form>
        <label>
          Resize X:
          <input type="number" onChange={this.props.onChangeX} />
        </label>
        <label>
          Resize Y:
          <input type="number" onChange={this.props.onChangeY} />
        </label>
      </form>
    )
  }
}

class ProcessButton extends React.Component{
  render(){
    return(
      <button onClick={() => this.props.onClick()}>Process Logo</button>
    )
  }
}

class SubmitButton extends React.Component{
  render(){
    return(
      <button onClick={() => this.props.onClick()}>Submit Link</button>
    )
  }
}

class DownloadButton extends React.Component{
  render(){
    return(
      <button onClick={() => this.props.onClick()}>Download BMP</button>
    )
  }
}

class ConvertButton extends React.Component{
  render(){
    return(
      <button onClick={() => this.props.onClick()}>Debug v2</button>
    )
  }
}

//-------------------------------------------------------------
//Main editor app class, contains most info in state
//-------------------------------------------------------------
class Editor extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      //value that holds the path to default image, then the base64 data of render
      //base64 used by Jimp, since it is a web-based app. Local files caused issues.
      picture: src,
      //Array of output pictures
      output: [],
      dropboxLink: "",
      scaleX: 150,
      scaleY: 150,
    };
    this.myRef = React.createRef();
    //TODO: Bind these functions in their declaration, similar to handleX functions
    this.onDrop = this.onDrop.bind(this);
    this.jimpScale = this.jimpScale.bind(this);
    this.jimpResize = this.jimpResize.bind(this);
    this.jimpTest = this.jimpTest.bind(this);
    this.onScaleFormChangeX = this.onScaleFormChangeX.bind(this);
    this.onScaleFormChangeY = this.onScaleFormChangeY.bind(this);
  }

  componentDidUpdate(prevProps, prevState){
    if (prevState.dropboxLink !== this.state.dropboxLink){
      console.log("dropboxLink state has changed: " + this.state.dropboxLink);
      console.log(this.output);
    }
  }

  //-------------------------------------------------------------
  //Functions to handle events when different buttons are clicked
  //or values are changed
  //-------------------------------------------------------------
  handleProcessButtonClick = (i) => {
      //Format: posterize[bool], posterize value, scale[bool], scaleX, scaleY, greyscale[bool], numColors
      //TODO: format better, into a function or something
      //Scale : Color Correction
      this.jimpLogoCreation(this.state.output[0], false, 0, true, this.state.scaleX, this.state.scaleY);
      //Scale : Greyscale : Color Correction
      this.jimpLogoCreation(this.state.output[0], false, 0, true, this.state.scaleX, this.state.scaleY, true);
      //Scale : Posterize : Color Correction
      this.jimpLogoCreation(this.state.output[0], true, 7, true, this.state.scaleX, this.state.scaleY);
      this.jimpLogoCreation(this.state.output[0], true, 5, true, this.state.scaleX, this.state.scaleY);
      this.jimpLogoCreation(this.state.output[0], true, 3, true, this.state.scaleX, this.state.scaleY);
      this.jimpLogoCreation(this.state.output[0], true, 2, true, this.state.scaleX, this.state.scaleY);
      //Scale : Color Correction (Reduction)
      this.jimpLogoCreation(this.state.output[0], false, 0, true, this.state.scaleX, this.state.scaleY, false, 5);
      this.jimpLogoCreation(this.state.output[0], false, 0, true, this.state.scaleX, this.state.scaleY, false, 4);
      this.jimpLogoCreation(this.state.output[0], false, 0, true, this.state.scaleX, this.state.scaleY, false, 3);
      this.jimpLogoCreation(this.state.output[0], false, 0, true, this.state.scaleX, this.state.scaleY, false, 2);
      //Scale : Posterize : Color Correction (Reduction)
      this.jimpLogoCreation(this.state.output[0], true, 7, true, this.state.scaleX, this.state.scaleY, false, 5);
      this.jimpLogoCreation(this.state.output[0], true, 5, true, this.state.scaleX, this.state.scaleY, false, 4);
      this.jimpLogoCreation(this.state.output[0], true, 3, true, this.state.scaleX, this.state.scaleY, false, 3);
      this.jimpLogoCreation(this.state.output[0], true, 2, true, this.state.scaleX, this.state.scaleY, false, 2);
  }

  handleConvertButtonClick = (i) => {
    /*
    for (let [name, value] of Object.entries(colors)) {
      console.log(`${name}: ${value}`);
    }
    */
    //NOTE - THIS RETURNS THE VALUE, NO NEED FOR .VALUE
    console.log(colorsArray);
    console.log(colorsFreq);

  }

  handleSubmitButtonClick = (i) => {
    console.log("Submit Button Clicked");
    this.setState({
      output: [this.state.dropboxLink],
    });
  }

  handleDownloadButtonClick = (i) => {
    console.log("Download Button Clicked");
  }

  handleLinkChange = (i) => {
    this.setState({
      dropboxLink: "https://cors-anywhere.herokuapp.com/" + i.target.value.slice(0, -1) + "1",
    });
  }

  //picture is an array passed from image uploader
  //pull most recently uploaded picture from current session
  //TODO: reformat these functions into handleDrop and handleLinkChange
  onDrop(picture){
    //TODO: Insert function calls directly here to auto work on image
    var localImg = URL.createObjectURL(picture[picture.length - 1]);
    //Set state for display
    this.setState({
      output: [URL.createObjectURL(picture[picture.length - 1])],
    });
  }

  onScaleFormChangeX(event){
    //form takes in a string, need to parse into an Int for use in Jimp
    this.setState({
      scaleX: parseInt(event.target.value, 10)
    });
  }

  onScaleFormChangeY(event){
    //form takes in a string, need to parse into an Int for use in Jimp
    this.setState({
      scaleY: parseInt(event.target.value, 10)
    });
  }

  //-------------------------------------------------------------
  //render functions for each visible element
  //TODO: combine everything in the same div into one render function
  //like buttons for control panel and such
  //-------------------------------------------------------------

  renderLogoImage(){
    return (
      <div>
        <DisplayLogoImg
          picture={this.state.picture}
          output={this.state.output}
        />
      </div>
    )
  }

  renderProcessButton(i){
    return(
      <ProcessButton
        onClick={this.handleProcessButtonClick}
      />
    )
  }

  renderSubmitButton(i){
    return(
      <SubmitButton
        onClick={this.handleSubmitButtonClick}
      />
    )
  }

  renderDownloadButton(i){
    return(
      <DownloadButton
        onClick={this.handleDownloadButtonClick}
      />
    )
  }

  renderConvertButton(i){
    return(
      <ConvertButton
        onClick={this.handleConvertButtonClick}
      />
    )
  }

  renderScaleForm(i){
    return(
      <ScaleForm
        onChangeX={this.onScaleFormChangeX}
        onChangeY={this.onScaleFormChangeY}
      />
    )
  }

  renderImageUploader(){
    return(
      <ImageUploader
        withIcon={true}
        buttonText='Choose image'
        label="Max file size: 5mb, Filetypes accepted: .bmp | .jpg | .png"
        fileContainerStyle={{backgroundColor: "grey"}}
        singleImage={true}
        onChange={this.onDrop}
        imgExtension={['.jpg', '.gif', '.png', '.bmp']}
        maxFileSize={5242880}
      />
    )
  }

  renderLinkForm(){
    return(
      <Linkform onChange={this.handleLinkChange}/>
    )
  }


  //-------------------------------------------------------------
  //Functions to do the actual editing on the image
  //-------------------------------------------------------------
  jimpConvert(path, x, y){
    jimp.read(path, function(err, image) {
      image.getBase64(Jimp.AUTO, function(err, data){
        this.setState({
          picture: data.replace("image/png", "image/bmp"),
        });
      }.bind(this));
    }.bind(this));
  }


  jimpLogoCreation(path, posBool, pos, scale, scaleX, scaleY, grayscale, numColors){
    jimp.read(path, function(err, image) {
      //create local array of colors and populate it from global
      //TODO: Check if need to unallocate memory here
      var localColors = new Array(54);
      if (localColors[0] === undefined){
        for (var i = 0; i < colorsArray.length; i++){
          localColors[i] = colorsArray[i];
        }
      }

      if (scale)
        image.resize(scaleX, scaleY);
      if (posBool)
        image.posterize(pos);
      if (grayscale)
        image.greyscale();
      if (numColors !== undefined){
        localColors.length = numColors;
        //update colorsArray with new color order,
        //important for removing correct colors when downsizing
        for (var i = 0; i < numColors; i++){
          localColors[i] = colorsFreq[i][0];
        }
        console.log("localColors Updated: " + localColors);
      }

      //initialize getNewColor with new colorsArray
      var getNewColor = nearestColor.from(localColors);
      //Function to replace colors with our palette
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
        //First log RGB value of current pixel, toString(16) converts
        //into hex form, padStart for 1 digit values
        //var position = [x, y];
        //red
        var red = this.bitmap.data[idx];
        var redHex = red.toString(16).padStart(2, "0");
        //green
        var green = this.bitmap.data[idx + 1];
        var greenHex = green.toString(16).padStart(2, "0");
        //blue
        var blue = this.bitmap.data[idx + 2];
        var blueHex = blue.toString(16).padStart(2, "0");

        //Run nearestColor on this pixel
        var close = getNewColor('#' + redHex + greenHex + blueHex);

        //future timesave: Don't run this every time, only log frequency
        //the first time you parse the image
        for (var i = 0; i < colorsFreq.length; i++){
          if (colorsFreq[i][0] === close)
            colorsFreq[i][1]++;
        }

        var closeRed = parseInt(close.substr(1,2), 16);
        var closeGreen = parseInt(close.substr(3,2), 16);
        var closeBlue = parseInt(close.substr(5,2), 16);

        //Change pixel colors into nearest from our palette
        //red
        this.bitmap.data[idx] = closeRed;
        //green
        this.bitmap.data[idx + 1] = closeGreen;
        //blue
        this.bitmap.data[idx + 2] = closeBlue;
      })

      //sort colorsFreq by frequency
      colorsFreq.sort(sortFunction);
      function sortFunction(a, b){
        if (a[1] === b[1]) {
          return 0;
        }
        else {
          return (a[1] > b[1]) ? -1 : 1;
        }
      }

      //add result to output array
      image.getBase64(Jimp.MIME_BMP, function(err, data){
        this.setState(prevState => ({
          output: [...prevState.output, data]
        }))
        console.log("image added");
      }.bind(this));

      //apply edited image to picture state
      /*
      image.getBase64(Jimp.MIME_BMP, function(err, data){
        this.setState({
          picture: data,
        });
      }.bind(this));
      */


    }.bind(this));
  }

  jimpScale(path, x, y){
    jimp.read(path, function(err, image) {
      //image.scaleToFit(x,y);
      image.getBase64(Jimp.MIME_BMP, function(err, data){
        this.setState(prevState => ({
          output: [...prevState.output, data]
        }))
        console.log("image scaled");
      }.bind(this));
    }.bind(this));
  }

  jimpResize(path, x, y){
    jimp.read(path, function(err, image) {
      image.resize(x,y);
      image.getBase64(Jimp.MIME_BMP, function(err, data){
        this.setState({
          picture: data,
        });
      }.bind(this));
    }.bind(this));
  }

  jimpResizeBMP(path, x, y){
    jimp.read(path, function(err, image) {
      image.resize(x,y);
      image.getBase64(Jimp.MIME_BMP, function(err, data){
        this.setState({
          bmpPicture: data,
        });
      }.bind(this));
    }.bind(this));
  }

  //map logo onto bitmap according to preset
  //TODO: adjust for each preset

  /*
  jimpMap(path1, path2){
    jimp.read(this.state.bmpPicture, function(err, bmpImage) {
      jimp.read(this.state.picture, function(err, logo) {
        bmpImage.composite(logo, 20, 20);
        bmpImage.getBase64(Jimp.AUTO, function(err, data){
          this.setState({
            bmpPicture: data,
          });
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }
  */

  jimpTest(path){
    var local;
    jimp.read(path, function(err, image) {
      this.local = image;
    }.bind(this));
    return local;
  }

  jimpPosterize(path, x){
    jimp.read(path, function(err, image) {
      image.posterize(x);
      image.getBase64(Jimp.MIME_BMP, function(err, data){
        this.setState({
          picture: data,
        });
      }.bind(this));
    }.bind(this));
  }

  //-------------------------------------------------------------
  //Final render of the application
  //-------------------------------------------------------------
  render() {
    return (
      <div>
        <div className="workDisplay">
          {this.renderLogoImage()}
        </div>
        <div className="panelDisplay">
          {this.renderLinkForm()}
          {this.renderSubmitButton()}
          {this.renderImageUploader()}
          {this.renderScaleForm()}
          {this.renderProcessButton()}
          {this.renderConvertButton()}
        </div>
      </div>
    );
  }
}


//-------------------------------------------------------------
//Overreaching App class, not nessecary at the moment but may be used later
//-------------------------------------------------------------
class App extends React.Component {
  render() {
    return (
      <div className="app">
        <div className="app-img">
          <Editor />
        </div>
        <div className="img-fields">
          <div>
          </div>
        </div>
      </div>
    );
  }
}


//-------------------------------------------------------------
//Final DOM render, required by React
//-------------------------------------------------------------
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

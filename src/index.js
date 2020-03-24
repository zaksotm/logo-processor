//TODO/NOTES:
//instead of storing results in state, use global array
//maybe 2d array for properties? idk

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

var outputImages = new Array();
var firstrun = true;
var sourceImg = "";
var sourceColorChange = "";

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
        <div className="gallery">
          <h1>Source</h1>
          <img className="workImage" src={sourceImg} alt="Source" />
        </div>
        <div className="gallery">
          <h1>Results</h1>
          <h2>Scaled</h2>
          <img className="workImage" src={outputImages[0]} alt="Result #1" />
          <h2>Scaled + Our Colors</h2>
          <img className="workImage" src={outputImages[1]} alt="Result #1" />
          <h2>Scaled + Greyscale + Our Colors</h2>
          <img className="workImage" src={outputImages[2]} alt="Result #1" />
          <h2>Scaled + Our Colors (Max 5,4,3,2)</h2>
          <img className="workImage" src={outputImages[3]} alt="Result #1" />
          <img className="workImage" src={outputImages[4]} alt="Result #1" />
          <img className="workImage" src={outputImages[5]} alt="Result #1" />
          <img className="workImage" src={outputImages[6]} alt="Result #1" />
          <h2>Scaled + Posterized (Values 7-5-3-2) + Our Colors</h2>
          <img className="workImage" src={outputImages[7]} alt="Result #1" />
          <img className="workImage" src={outputImages[8]} alt="Result #1" />
          <img className="workImage" src={outputImages[9]} alt="Result #1" />
          <img className="workImage" src={outputImages[10]} alt="Result #1" />
          <h2>Scaled + Posterized (Value 7) + Our Colors (Max 5,4,3,2)</h2>
          <img className="workImage" src={outputImages[11]} alt="Result #1" />
          <img className="workImage" src={outputImages[12]} alt="Result #1" />
          <img className="workImage" src={outputImages[13]} alt="Result #1" />
          <img className="workImage" src={outputImages[14]} alt="Result #1" />
          <h2>Scaled + Posterized (Value 5) + Our Colors (Max 5,4,3,2)</h2>
          <img className="workImage" src={outputImages[15]} alt="Result #1" />
          <img className="workImage" src={outputImages[16]} alt="Result #1" />
          <img className="workImage" src={outputImages[17]} alt="Result #1" />
          <img className="workImage" src={outputImages[18]} alt="Result #1" />
          <h2>Scaled + Posterized (Value 3) + Our Colors (Max 5,4,3,2)</h2>
          <img className="workImage" src={outputImages[19]} alt="Result #1" />
          <img className="workImage" src={outputImages[20]} alt="Result #1" />
          <img className="workImage" src={outputImages[21]} alt="Result #1" />
          <img className="workImage" src={outputImages[22]} alt="Result #1" />
          <h2>Scaled + Posterized (Value 2) + Our Colors (Max 5,4,3,2)</h2>
          <img className="workImage" src={outputImages[23]} alt="Result #1" />
          <img className="workImage" src={outputImages[24]} alt="Result #1" />
          <img className="workImage" src={outputImages[25]} alt="Result #1" />
          <img className="workImage" src={outputImages[26]} alt="Result #1" />
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
      <form className="myForm">
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
      <form className="myForm">
        <label>
          Resize X:
          <input type="number" onChange={this.props.onChangeX} />
        </label>
        <label>
          Resize Y:
          <input type="number" onChange={this.props.onChangeY} />
        </label>
        Leave blank to keep aspect ratio
      </form>
    )
  }
}

class StretchForm extends React.Component{
  render(){
    return(
      <form className="myForm">
        <label>
          Stretch 25% vertically?:
          <input type="checkbox" onChange={this.props.onChange} />
        </label>
      </form>
    )
  }
}

//TODO: Change hardcoded max images for loading to variable
class ProcessButton extends React.Component{
  render(){
    return(
      <div>
        <button className="myButton" onClick={() => this.props.onClick()}>BMP My Logo!</button>
      </div>
    )
  }
}

class SubmitButton extends React.Component{
  render(){
    return(
      <button className="myButton" onClick={() => this.props.onClick()}>Submit Link</button>
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

class ColorChangeButton extends React.Component{
  render(){
    return(
      <button className="myButton" onClick={() => this.props.onClick()}>Replace Colors Only</button>
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
      scaleX: 0,
      scaleY: 0,
      imagesLoaded: 0,
      stretch: false,
    };
    this.myRef = React.createRef();
    //TODO: Bind these functions in their declaration, similar to handleX functions
    this.onDrop = this.onDrop.bind(this);
    this.onScaleFormChangeX = this.onScaleFormChangeX.bind(this);
    this.onScaleFormChangeY = this.onScaleFormChangeY.bind(this);
    this.onStretchFormChange = this.onStretchFormChange.bind(this);
    this.onProcessButtonClick = this.onProcessButtonClick.bind(this);
    this.onColorChangeButtonClick = this.onColorChangeButtonClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState){
    if (prevState.output !== this.state.output){
      //console.log("output state has changed: " + this.state.output[0]);
    }
  }

  //-------------------------------------------------------------
  //Functions to handle events when different buttons are clicked
  //or values are changed
  //-------------------------------------------------------------
  handleSubmitButtonClick = (i) => {
    console.log("Submit Button Clicked");
    outputImages[0] = this.state.dropboxLink;
    sourceImg = this.state.dropboxLink;
    console.log(sourceImg);
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
    outputImages.push(localImg);
    sourceImg = localImg;
    /*
    this.setState({
      output: [URL.createObjectURL(picture[picture.length - 1])],
    });
    */
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

  onStretchFormChange(event){
    //console.log(event.target.checked);
    this.setState({
      stretch: event.target.checked,
    });
  }

  async onProcessButtonClick(){
    //Scale image first
    await this.jimpResize(outputImages[0], true, this.state.scaleX, this.state.scaleY, this.state.stretch);
    //Scale : Color Correction
    await this.jimpLogoCreationAsync(outputImages[0], false, 0);
    //Scale : Greyscale : Color Correction
    await this.jimpLogoCreationAsync(outputImages[0], false, 0, true);
    //Scale : Color Correction (Reduction)
    await this.jimpLogoCreationAsync(outputImages[0], false, 0, false, 5);
    await this.jimpLogoCreationAsync(outputImages[0], false, 0, false, 4);
    await this.jimpLogoCreationAsync(outputImages[0], false, 0, false, 3);
    await this.jimpLogoCreationAsync(outputImages[0], false, 0, false, 2);
    //Scale : Posterize : Color Correction
    await this.jimpLogoCreationAsync(outputImages[0], true, 7);
    await this.jimpLogoCreationAsync(outputImages[0], true, 5);
    await this.jimpLogoCreationAsync(outputImages[0], true, 3);
    await this.jimpLogoCreationAsync(outputImages[0], true, 2);
    //Scale : Posterize : Color Correction (Reduction)
    await this.jimpLogoCreationAsync(outputImages[0], true, 7, false, 5);
    await this.jimpLogoCreationAsync(outputImages[0], true, 7, false, 4);
    await this.jimpLogoCreationAsync(outputImages[0], true, 7, false, 3);
    await this.jimpLogoCreationAsync(outputImages[0], true, 7, false, 2);
    await this.jimpLogoCreationAsync(outputImages[0], true, 5, false, 5);
    await this.jimpLogoCreationAsync(outputImages[0], true, 5, false, 4);
    await this.jimpLogoCreationAsync(outputImages[0], true, 5, false, 3);
    await this.jimpLogoCreationAsync(outputImages[0], true, 5, false, 2);
    await this.jimpLogoCreationAsync(outputImages[0], true, 3, false, 5);
    await this.jimpLogoCreationAsync(outputImages[0], true, 3, false, 4);
    await this.jimpLogoCreationAsync(outputImages[0], true, 3, false, 3);
    await this.jimpLogoCreationAsync(outputImages[0], true, 3, false, 2);
    await this.jimpLogoCreationAsync(outputImages[0], true, 2, false, 5);
    await this.jimpLogoCreationAsync(outputImages[0], true, 2, false, 4);
    await this.jimpLogoCreationAsync(outputImages[0], true, 2, false, 3);
    await this.jimpLogoCreationAsync(outputImages[0], true, 2, false, 2);
  }

  async onColorChangeButtonClick(){
    await this.jimpLogoCreationAsync(outputImages[0], false, 0, false, undefined, true);
  }

  //-------------------------------------------------------------
  //render functions for each visible element
  //TODO: combine everything in the same div into one render function
  //like buttons for control panel and such
  //-------------------------------------------------------------

  renderLogoImage(){
    if (outputImages[25] !== undefined)
      return (
        <div>
          <DisplayLogoImg
            picture={this.state.picture}
            output={this.state.output}
          />
        </div>
      )
    else if (sourceColorChange !== "")
      return (
        <div className="workDisplay">
          <img src={sourceColorChange} alt="sourceColorChange"/>
        </div>
      )
  }

  renderProcessButton(i){
    return(
      <ProcessButton
        onClick={this.onProcessButtonClick}
        imagesLoaded={this.state.imagesLoaded}
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

  renderColorChangeButton(i){
    return(
      <ColorChangeButton
        onClick={this.onColorChangeButtonClick}
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

  renderStretchForm(i){
    return(
      <StretchForm
        onChange={this.onStretchFormChange}
      />
    )
  }

  renderImageUploader(){
    return(
      <ImageUploader
        withIcon={false}
        buttonText='Choose image'
        label="Max file size: 5mb, Filetypes accepted: .bmp | .jpg | .png"
        fileContainerStyle={{backgroundColor: "EDEEF0"}}
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
  //TODO: Update to using promise
  async jimpResize(path, scale, scaleX, scaleY, stretch){
    let image = await jimp.read(path);

    if (scale){
      if (scaleX === 0){
        if (scaleY === 0){
          //if both fields are not input, scale to 100 X and scale Y according to aspect ratio
          console.log("Found no size variables");
          image.resize(100, jimp.AUTO, jimp.RESIZE_BEZIER);
        }
        else {
          //if only the Y vaue is input,
          console.log("Only found y value");
          image.resize(jimp.AUTO, scaleY, jimp.RESIZE_BEZIER);
        }
      }
      else if (scaleY === 0){
        if (scaleX === 0){
          //if both fields are not input, scale to 100 X and scale Y according to aspect ratio
          console.log("Found no size variables");
          image.resize(100, jimp.AUTO, jimp.RESIZE_BEZIER);
        }
        else {
          //if only the X vaue is input,
          console.log("Only found x value");
          image.resize(scaleX, jimp.AUTO, jimp.RESIZE_BEZIER);
        }
      }
      //if both values are input
      else {
        console.log("Found both size variables");
        image.resize(scaleX, scaleY, jimp.RESIZE_BEZIER);
      }
    }
    if (stretch){
      var newHeight = Math.round(image.bitmap.height * 1.25);
      image.resize(image.bitmap.width, newHeight, jimp.RESIZE_BEZIER);
      console.log("Image stretched");
    }

    let data = await image.getBase64Async(Jimp.MIME_BMP);
    outputImages[0] = data;
  }

  async jimpLogoCreationAsync(path, posBool, pos, grayscale, numColors, onlyColorBool){
    let image = await jimp.read(path);
    console.log("Image read");

    //create local array of colors and populate it from global
    //TODO: Check if need to unallocate memory here
    var localColors = new Array(54);
    if (localColors[0] === undefined){
      for (var i = 0; i < colorsArray.length; i++){
        localColors[i] = colorsArray[i];
      }
    }
    console.log("localColors Initialized");
    if (posBool)
      image.posterize(pos);
    if (grayscale)
      image.greyscale();

    //initialize getNewColor with new colorsArray
    var getFirstColor = nearestColor.from(colorsArray);

    //function to scan for most popular colors in image, only do on first run
    if (firstrun){
      console.log('Calculating most popular colors....');
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
        var close = getFirstColor('#' + redHex + greenHex + blueHex);

        //future timesave: Don't run this every time, only log frequency
        //the first time you parse the image
        for (var i = 0; i < colorsFreq.length; i++){
          if (colorsFreq[i][0] === close){
            colorsFreq[i][1]++;
          }
        }
      })
      firstrun = false;

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
    }

    console.log("Colors Calculated");

    if (numColors !== undefined){
      localColors.length = numColors;
      //update colorsArray with new color order,
      //important for removing correct colors when downsizing
      for (var i = 0; i < numColors; i++){
        localColors[i] = colorsFreq[i][0];
      }
      //console.log("localColors Updated: " + localColors);
    }

    //
    var getNewColor = nearestColor.from(localColors);

    //Function to replace colors with our palette
    console.log("Replacing colors...");
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

    console.log("Colors Replaced");

    //add result to output array
    let data = await image.getBase64Async(Jimp.MIME_BMP);
    outputImages.push(data);

    if (onlyColorBool)
      sourceColorChange = data;
    this.forceUpdate();
  }
  //-------------------------------------------------------------
  //Final render of the application
  //-------------------------------------------------------------
  render() {
    return (
      <div>
        <div className="selectImageDisplay">
          <h1>Select Your Image</h1>
          {this.renderLinkForm()}
          {this.renderSubmitButton()}
          <br></br>
          <p className="or"> OR</p>
          <br></br>
          {this.renderImageUploader()}
        </div>
        <div className="optionsDisplay">
          <h1>Options</h1>
          {this.renderScaleForm()}
          {this.renderStretchForm()}
        </div>
        <div className="buttonDisplay">
          {this.renderProcessButton()}
          <br></br>
          <p className="or"> OR</p>
          <br></br>
          {this.renderColorChangeButton()}
        </div>
        <div className="workDisplay">
          {this.renderLogoImage()}
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

// global constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

//Global Variables
var pattern = [2, 2, 4, 3]; //var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var mistake_count = 0;

var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0;

function startGame(){
  mistake_count = 0;
  // make new pattern
  for(let i = 0; i < pattern.length;i++){
    pattern[i] = Math.floor((Math.random() * 4) + 1)
  }
    //initialize game variables
    progress = 0;
    gamePlaying = true;
   // swap the Start and Stop buttons
   document.getElementById("startBtn").classList.add("hidden");
   document.getElementById("stopBtn").classList.remove("hidden");
   playClueSequence();
  
}

function stopGame(){
  //modify game variable
   gamePlaying = false;
  //hide stop button and unhide start button
   document.getElementById("stopBtn").classList.add("hidden")
   document.getElementById("startBtn").classList.remove("hidden")
}

// Sound Synthesis Functions
const freqMap = {
  1: 288.6,
  2: 359.6,
  3: 492,
  4: 570,
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

function loseGame() {
  stopGame();
  alert("Game Over. You lost.")
  console.log("Game has ended.")
}

function winGame() {
  stopGame();
  alert("Game Over. You Won!")
  console.log("Game has ended")
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext 
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)


function lightButton(btn){
  document.getElementById("button"+ btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+ btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn); 
    //setTimeout is a function that calls another
    //function in the future, first paramter is the the function
    // second parameter is when the function should be called,
    //and third paramter is an argument for the function being called
    
  }
}

function playClueSequence(){
  guessCounter = 0;
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i = 0; i <= progress; i++){ // for each clue that is revealed so far
    setTimeout(playSingleClue, delay, pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function guess(btn) {
  if(!gamePlaying){
    return;
  }
  if (btn == pattern[guessCounter]){
     if (guessCounter == progress)
    {
      if (progress == pattern.length - 1) {
        winGame();
      }
      else {
        progress++;
        playClueSequence();
      }
    }
    else {
      guessCounter++;
    }
  }

    else {
      alert("You have " + (3 - (mistake_count + 1)) + " attempts left.");
      mistake_count++;
      if(mistake_count == 3) {loseGame();}
      //loseGame();
    }
}

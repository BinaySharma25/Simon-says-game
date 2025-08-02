let gameSeq = [];
let userSeq = [];

let btns = ["red", "green", "yellow" ,"blue"];

let started = false;
let level = 0;
let score = 0;
let isPlaying = false;

let h2 = document.querySelector("h2");

// Sound effects (using Web Audio API)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration = 200) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
}

// Sound frequencies for each color
const soundFreqs = {
    red: 440,    // A4
    green: 523,  // C5
    yellow: 659, // E5
    blue: 784    // G5
};

let highScore = 0;
let highScoreElem = document.getElementById("high-score");

if(localStorage.getItem("simonHighScore")){
    highScore = parseInt(localStorage.getItem("simonHighScore"));
    highScoreElem.innerText = `High Score: ${highScore}`;
}

function updateHighScore(newScore){
    if(newScore > highScore){
        highScore = newScore;
        highScoreElem.innerText = `High Score: ${highScore}`;
        localStorage.setItem("simonHighScore", highScore);
    }
}

// Add score display
let scoreElem = document.getElementById("score");

//step-1
document.addEventListener("keypress" , function(){
    if(started == false){
        console.log("game started");
        started = true;
        score = 0;
        updateScore();
        levelUp();
    }
});

//step-2
function btnFlash(btn){
    btn.classList.add("flash");
    playSound(soundFreqs[btn.getAttribute("id")]);
    setTimeout(function(){
        btn.classList.remove("flash");
    }, 300);
}

function userFlash(btn){
    btn.classList.add("userflash");
    playSound(soundFreqs[btn.getAttribute("id")]);
    setTimeout(function(){
        btn.classList.remove("userflash");
    }, 300);
}

function levelUp(){
    userSeq = [];
    level++;
    score += level * 10;
    updateScore();
    
    const flashDuration = 300;
    
    h2.innerText = `Level ${level}`;
    h2.style.color = `hsl(${level * 20}, 70%, 50%)`;

    let randIdx = Math.floor(Math.random() * btns.length);
    let randColor = btns[randIdx];
    let randbtn = document.querySelector(`.${randColor}`);
    gameSeq.push(randColor);
    
    showSequence(0, flashDuration);
}

function showSequence(index, duration) {
    if (index >= gameSeq.length) {
        isPlaying = true;
        return;
    }
    
    const btn = document.querySelector(`.${gameSeq[index]}`);
    btnFlash(btn);
    
    setTimeout(() => {
        showSequence(index + 1, duration);
    }, duration + 100);
}

function updateScore() {
    if (scoreElem) {
        scoreElem.innerText = `Score: ${score}`;
    }
}

//step-3
function checkAns(idx){
    if(userSeq[idx] === gameSeq[idx]){
        if(userSeq.length == gameSeq.length){
            // Add bonus for perfect timing
            const timingBonus = Math.floor(Math.random() * 5) + 1;
            score += timingBonus;
            updateScore();
            
            // Show success animation
            document.querySelector("body").style.backgroundColor = "#90EE90";
            setTimeout(function(){
                document.querySelector("body").style.backgroundColor = "white";
            }, 200);
            
            setTimeout(levelUp, 1000);
        }
    }else{
        updateHighScore(score);
        h2.innerHTML = `Game Over! Your score was <b>${score}</b> <br> Press any key to start.`;
        h2.style.color = "red";
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function(){
            document.querySelector("body").style.backgroundColor = "white";
        }, 150);
        reset();
    }
}

function btnPress() {
    if (!isPlaying) return;
    
    let btn = this;
    userFlash(btn);

    userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    checkAns(userSeq.length - 1);
}

let allBtns = document.querySelectorAll(".btn");
for(btn of allBtns){
 btn.addEventListener("click",btnPress);
}

function reset(){
    started = false;
    isPlaying = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    score = 0;
    updateScore();
    h2.style.color = "black";
}
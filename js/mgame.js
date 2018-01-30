
var cards=[];
var faceUp=[];
var turns=-1;
var matches=0;
var designChoice="glyphs";
var faceDesign=[];
var gameSeconds=0;
var gameMinutes=0;
var gameHours =0;
var myTime;
var starCount=3;
var bestTurns=0;
var gameStarted=false;
var newBestTurns=false;
var newBestTime=false;
var bestSeconds=0;
var bestStars=0;
var newBestStars=false;

function buildGrid() {
    //sets up grid and start game
    //called from onload, gameOver(), resetGame(), closeMenu()
    prepBuildGrid();
    document.getElementById("card-grid").remove();

    let newCardGrid=document.createElement('div');
    for (let x=0; x<=3; x++) {  //layout rows
        let newRowDiv=document.createElement('div');
        for (let i=(x*4); i<=(x*4)+3; i++) { //layout columns
            let newWrapDiv=document.createElement('div');
            let newFrontDiv=document.createElement('div');
            let newBackDiv=document.createElement('div');
            let newBackP=document.createElement('p');

            //build back of card
            switch(designChoice) {
                case "dogs":
                case "flowers":
                    newBackDiv.style.backgroundImage="url("+cards[i].iconString+")";
                    newBackDiv.style.backgroundSize="cover";
                    break;

                default:
                    newBackP.classList.add("card__back--glyph");
                    newBackP.classList.add("glyphicon");
                    newBackP.classList.add(cards[i].iconString);
                    newBackDiv.appendChild(newBackP);
            }
            newBackDiv.classList.add("card");
            newBackDiv.classList.add("card__back");

            //build front of card
            newFrontDiv.classList.add("card");
            newFrontDiv.classList.add("card__front");
            newFrontDiv.classList.add("card__front--shadow");

            //build wrapper for card
            newWrapDiv.classList.add("card");
            newWrapDiv.classList.add("card__wrapper");
            newWrapDiv.id=i;
            newWrapDiv.addEventListener('click', function(){ cardClicked(this);});
            newWrapDiv.appendChild(newFrontDiv);
            newWrapDiv.appendChild(newBackDiv);

            //add wrapper with card to row
            newRowDiv.appendChild(newWrapDiv);
        }
        //add row to card grid
        newRowDiv.classList.add("container__row");
        newCardGrid.appendChild(newRowDiv);
    }
    //append new card grid
    newCardGrid.id="card-grid";
    document.getElementById("field").appendChild(newCardGrid);
}

function prepBuildGrid() {
    //called from buildGrid()
    // reset all the variables
    cards=[];
    faceUp=[];
    turns=-1;
    matches=0;
    gameSeconds=-1;
    gameMinutes=0;
    gamehours=0;
    newBestTurns=false;
    newBestStars=false;
    newBestTime=false;
    gameStarted=false;
    starCount=3;

    clearInterval(myTime);
    buildIconArray();
    gameTimer();  //once to set/reset timer to zero
    displayTopMarks();
    updateTurns();

    for (let x=1; x<=3; x++) {  //  set/reset stars
        document.getElementById('star'+x).classList.remove("glyphicon-star-empty");
        document.getElementById('star'+x).classList.add("glyphicon-star");
    }
}

function buildIconArray() {
    //Get the design choice then randomly sort the face elements and
    //select the first 8 - duplicate those so there are two of each
    //then randomly sort again.
    //called from buildGrid()
    setFaceDesign();
    let numArray=[];
    let card={};
    let designCount=Object.keys(faceDesign).length;  //how many face designs available

    for(let i=0; i<=designCount-1; i++) {
        numArray.push(i);
    }

    //randomly sort all face options
    numArray.sort(function(a, b){return 0.5-Math.random()});
    //grab the first eight face options and duplicate so there are 16
    let iconArray=numArray.slice(0,8);
    //duplicate array so there are two of each element (faces)
    iconArray=iconArray.concat(iconArray);
    //randomly sort the 16 faces
    iconArray.sort(function(a, b){return 0.5-Math.random()});

    for (let i=0; i<=15; i++) {
        card={
            flipped: "False",
            iconString: faceDesign[iconArray[i]]
        }
        cards.push(card);
    }
}

function setFaceDesign() {
    //called from buildIconArray()
    faceDesign=[];
    switch (designChoice) {
        case "dogs":
            for (let i=1; i<=11; i++) {
                faceDesign.push("./img/dog"+i+".jpg");
            }
            break;

        case "flowers":
            for (let i=1; i<=14; i++) {
            faceDesign.push("./img/flower"+i+".jpg");
            }
            break;

        default:
            for (let i=1; i<=25; i++) {
            faceDesign.push("glyphicon"+i);
            }
    }
}

function displayTopMarks() {
    //check if stored locally and retrieve
    //called from buildGrid()
    if (typeof(Storage)!=="undefined") {
        if (typeof(localStorage.bestScore)!=="undefined") {
            bestTurns=Number(localStorage.bestScore);
        }
        if (typeof(localStorage.bestTime)!=="undefined") {
            bestSeconds=Number(localStorage.bestTime);
        }
        if (typeof(localStorage.bestTime)!=="undefined") {
            bestStars=Number(localStorage.bestStars);
        } else {
            bestStars=1;
        }
    }
    document.getElementById('best-score').innerHTML="Fewest Turns: "+bestTurns;
    document.getElementById('best-time').innerHTML="Fasted Game: "+ formatTime(bestSeconds);
}

function formatTime(s) {
    //returns time of game in 0h 00m 00s format
    //called by displayTopMarks(), gameOver(), gameTimer()
    let hStr, mStr, sStr, timeString;
    let hours=Math.floor(s/3600);
    let minutes=Math.floor((s-(hours*3600))/60);
    let seconds=s-((hours*3600)+(minutes*60));

    (hours===0) ? hStr="" : hStr=hours;
    (hours>0 && minutes<10) ? mStr="0"+minutes : mStr=minutes;
    (seconds<10) ? sStr="0"+seconds : sStr=seconds;
    (hours===0) ? timeString=mStr+"m "+sStr+"s" : timeString=hStr+"h "+mStr+"m "+sStr+"s";

    return(timeString);
}

function cardClicked(e) {
    //evaluate clicked card and act on it
    //call via listener on each card
    let eIndex=e.getAttribute("id");

    //if game hasn't started - this is first card click - start timer
    if (!gameStarted) {
        gameStarted=true;
        myTime=setInterval(gameTimer, 1000);
    }
    if (!(faceUp.length===2)) {  //only 2 clicks at a time please
        if (cards[eIndex].flipped==="False") {
            e.classList.add("bounce-up");
            cards[e.getAttribute("id")].flipped="True";
            faceUp.push(e.getAttribute("id"));

            setTimeout(flipUp, 850);  //delayed for bounce up
            setTimeout(removeFrontShadow,1000);  //delated for bounce and flip

            if (faceUp.length===2) {
                //check if cards match
                updateTurns();
                (cards[faceUp[0]].iconString===cards[faceUp[1]].iconString) ? setTimeout(cardsMatch, 1500) : setTimeout(cardsNoMatch, 1500);
            }
        }   //else card is face up -- do nothing
    }

    function flipUp() {
        //flip face up
        e.classList.add("flip-up");
    }

    function removeFrontShadow() {
        e.querySelector('.card__front').classList.remove('card__front--shadow');
    }
}

function cardsMatch() {
    //cards are a match -- process events
    //called from cardClicked()
    document.getElementById(faceUp[0]).classList.add("aniMatch");
    document.getElementById(faceUp[1]).classList.add("aniMatch");
    matches+=1;
    faceUp=[];

    if (matches===8){
        //game is over
        clearInterval(myTime);  //stop timer
        saveTopMarks();  //compare and save top marks
        setTimeout(gameOver, 800);  //launch modal
    }
    //back to listening for click
}

function cardsNoMatch() {
    //cards don't match -- process events
    //called from cardClicked()
    for (let i=0; i<=1; i++) {
        document.getElementById(faceUp[i]).classList.add("aniNoMatch");
        document.getElementById(faceUp[i]).classList.add("aniNoMatch");
        document.getElementById(faceUp[i]).classList.remove("bounce-up");
        //document.getElementById(faceUp[i]).classList.remove("bump");
        setTimeout(flipDown.bind(null, i), 700);
        document.getElementById(faceUp[i]).querySelector('.card__front').classList.add('card__front--shadow');
        cards[faceUp[i]].flipped="False";
    }
    setTimeout(clearFaceUp, 750);
    //back to listening

    function clearFaceUp(){
        faceUp=[];
    }

    function flipDown(i) {
        //flip face down
        document.getElementById(faceUp[i]).classList.remove("flip-up");
        document.getElementById(faceUp[i]).classList.remove("aniNoMatch");
    }
}

function saveTopMarks() {
    //compare game marks to top marks and save
    //called from cardsMatch()
    (bestTurns===0) ? noTopScores() : compareScores();
}

function noTopScores() {
    //top scores haven't been set so set equal to current game
    //called from saveTopMarks()
    bestTurns=turns;
    newBestTurns=true;
    bestSeconds=gameSeconds;
    newBestTime=true;
    bestStars=starCount;
    newBestStars=true;

    if (typeof(Storage)!=="undefined") {
        localStorage.setItem('bestTime',bestSeconds);
        localStorage.setItem('bestScore',bestTurns);
        localStorage.setItem('bestStars',bestStars);
    }
}

function compareScores() {
    //compare current game to top scores
    //called from saveTopMarks()
    if (turns<=bestTurns) {
        bestTurns=turns;
        newBestTurns=true;
    }
    if (gameSeconds<=bestSeconds) {
        bestSeconds=gameSeconds;
        newBestTime=true;
    }
    if (starCount>=bestStars) {
        bestStars=starCount;
        newBestStars=true;
    }
    if (typeof(Storage)!=="undefined") {
        localStorage.setItem('bestTime',bestSeconds);
        localStorage.setItem('bestScore',bestTurns);
        localStorage.setItem('bestStars',bestStars);
    }
}

function gameOver() {
    //launch gameOver modal and display game stats
    //called by cardsMatch()
    let modal=document.getElementById('overModal');
    let okButton=document.querySelectorAll('#overModal #over-ok')[0];
    //catch esc key so modal can be closed.
    document.addEventListener('keydown', escClose);

    newBestTime ? addAsterick("time-record") : removeAsterick("time-record");
    newBestTurns ? addAsterick("turns-record") : removeAsterick("turns-record");
    newBestStars ? addAsterick("stars-record") : removeAsterick("stars-record");

    //show modal
    modal.style.display="block";

    //build star ranking div's
    buildStars("star-list", "your-stars", starCount);
    buildStars("best-star-list", "best-stars", bestStars);

    //set rest of game stats and top scores
    document.getElementById('your-turns').innerHTML=turns;
    document.getElementById('best-turns').innerHTML=bestTurns;
    document.getElementById('your-time').innerHTML=formatTime(gameSeconds);
    document.getElementById('top-time').innerHTML=formatTime(bestSeconds);

    okButton.onclick=function() {
        modal.style.display="none";
        buildGrid();
    }
    window.onclick=function(event) {
        if (event.target===modal) {
            modal.style.display="none";
            buildGrid();
        }
    }

    function escClose(event) {
        const key=event.key;
        if (key==="Escape") {
            modal.style.display="none";
            document.removeEventListener('keydown', escClose);
            buildGrid();
        }
    }
}

function addAsterick(id) {
    //called from gameOver()
    document.getElementById(id).classList.add("glyphicon");
    document.getElementById(id).classList.add("glyphicon-asterisk");
    document.getElementById(id).classList.add("over__asterick--color");
}

function removeAsterick(id) {
    //called from gameOver()
    document.getElementById(id).classList.remove("glyphicon-asterisk");
}

function buildStars(child,parent,stars) {
    //builds the star ranking div's
    //called from gameOver()
    if ( document.getElementById(child)!==null) {
        //remove if previously created
        document.getElementById(child).remove();
    }
    newStarUl=document.createElement('ul');
    newStarDiv=document.createElement('div');

    for (let x=1; x<=stars; x++) {
        let newStarli=document.createElement('li');
        let newStarSpan=document.createElement('span');
        newStarSpan.classList.add("glyphicon");
        newStarSpan.classList.add("glyphicon-star");
        newStarli.appendChild(newStarSpan);
        newStarUl.appendChild(newStarli);
    }
    newStarDiv.appendChild(newStarUl);
    newStarDiv.classList.add("stars");
    newStarDiv.classList.add("over__stars--color");
    newStarDiv.id=child;
    document.getElementById(parent).appendChild(newStarDiv);
}

function resetGame() {
    //launches resetGame modal
    //call from onClick
    clearInterval(myTime); //pause game time

    //catch esc key to close modal
    document.addEventListener('keydown', escClose);

    let modal=document.getElementById('resetModal');
    let noButton=document.querySelectorAll('#resetModal #reset-no')[0];
    let yesButton=document.querySelectorAll('#resetModal #reset-yes')[0];

    modal.style.display="block";

    noButton.onclick = function() {
        modal.style.display="none";
        if (gameSeconds>0) {
               myTime=setInterval(gameTimer, 1000);
        }
    }
    yesButton.onclick=function() {
        modal.style.display="none";
        buildGrid();
    }
    window.onclick=function(event) {
        if (event.target===modal) {
            modal.style.display="none";
            if (gameSeconds>0) {
               myTime=setInterval(gameTimer, 1000); //start game timer
            }
        }
    }

    function escClose(event) {
        const key=event.key;
        if (key==="Escape") {
            modal.style.display = "none";
            if (gameSeconds>0) {
               myTime=setInterval(gameTimer, 1000);  //start game timer
            }
            document.removeEventListener('keydown', escClose);
        }
    }
}

function updateTurns() {
    //updates game turns and adjust stars earned based on turn number
    //called by buildGrid(), cardClicked()
    turns+=1;
    document.getElementById('turns').innerHTML="Turns: "+turns;
    switch (turns) {
        case 18:
            starCount=2;
            updateStars('star3');
            break;

        case 24:
            starCount=1;
            updateStars('star2');
            break;
    }

    function updateStars(id) {
        document.getElementById(id).classList.remove("glyphicon-star");
        document.getElementById(id).classList.add("glyphicon-star-empty");
    }
}

function gameTimer() {
    //updates game timer and displays in stats bar
    //called by buildGrid(), resetGame(), and cardClicked()
    gameSeconds+=1;
    document.getElementById('time').innerHTML="Time: "+formatTime(gameSeconds);
}

function resetTopMarks() {
    //resets locally stored top scores
    //called by onClick in menu
    if (typeof(Storage)!=="undefined") {
        localStorage.bestScore=0;
        localStorage.bestTime=0;
        localStorage.bestStars=1;
    }
    closeMenu();
}

function openMenu() {
    //called from onclick
    document.getElementById("side-menu").style.width="225px";
}

function closeMenu() {
    //called from onclick and from resetGame()
    document.getElementById("side-menu").style.width="0";
    let radios=document.getElementsByName('radios');
    for (let i=0, length=radios.length; i<length; i++) {
        if (radios[i].checked){
            designChoice=radios[i].value;
            buildGrid();
            break;
        }
    }
}

document.body.onload=buildGrid();  //get started!
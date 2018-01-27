
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


function setFaceDesign() {
    faceDesign=[];
    switch (designChoice) {
        case "dogs":
         faceDesign = [
            "./img/dog1.jpg","./img/dog2.jpg","./img/dog3.jpg",
            "./img/dog4.jpg","./img/dog5.jpg","./img/dog6.jpg","./img/dog7.jpg",
            "./img/dog8.jpg","./img/dog9.jpg","./img/dog10.jpg","./img/dog11.jpg"
        ];
        break;

        case "flowers":
            faceDesign = [
                "./img/flower1.jpg", "./img/flower2.jpg","./img/flower4.jpg",
                "./img/flower5.jpg","./img/flower6.jpg","./img/flower7.jpg","./img/flower8.jpg",
                "./img/flower9.jpg","./img/flower10.jpg","./img/flower11.jpg","./img/flower12.jpg",
                "./img/flower13.jpg","./img/flower14.jpg","./img/flower15.jpg"
            ];
            break;

        default:
            faceDesign = [
                "glyphicon-plus","glyphicon-eur","glyphicon-envelope","glyphicon-cloud",
                "glyphicon-music","glyphicon-search","glyphicon-heart","glyphicon-film",
                "glyphicon-star","glyphicon-home","glyphicon-flag","glyphicon-camera",
                "glyphicon-leaf","glyphicon-fire","glyphicon-eye-open","glyphicon-shopping-cart",
                "glyphicon-paperclip","glyphicon-phone","glyphicon-usd","glyphicon-phone-alt",
                "glyphicon-tree-conifer","glyphicon-tree-deciduous","glyphicon-apple",
                "glyphicon-hourglass","glyphicon-sunglasses"
            ];
    }
}

function openMenu() {
    document.getElementById("mySidemenu").style.width = "225px";
}

function closeMenu() {
    document.getElementById("mySidemenu").style.width = "0";
    let radios= document.getElementsByName('radios');
    for (let i=0, length=radios.length; i<length;i++) {
        if (radios[i].checked){
            designChoice=radios[i].value;
            buildGrid();
            break;
        }
    }
}

function saveTopMarks() {

    if (bestTurns==0) {
        console.log("bestTurns=0");
        bestTurns=turns;
        newBestTurns=true;
        bestSeconds=gameSeconds;
        newBestTime=true;
        console.log("2. bs:"+bestStars+" sc: "+starCount);
        bestStars=starCount;
        console.log("2. bs:"+bestStars+" sc: "+starCount);
        newBestStars=true;

        if (typeof(Storage) !== "undefined") {
            localStorage.setItem('bestTime',bestSeconds);
            localStorage.setItem('bestScore',bestTurns);
            localStorage.setItem('bestStars',bestStars);

        }
    } else {


        if (turns <= bestTurns) {
            console.log("turns lower than bestTurns");
            bestTurns=turns;
            newBestTurns=true;

        }

        if (gameSeconds<=bestSeconds) {

            bestSeconds=gameSeconds;
            newBestTime=true;
        }

        if (starCount>=bestStars) {
            console.log("1. bs:"+bestStars+" sc: "+starCount);
            bestStars=starCount;
            console.log("1. bs:"+bestStars+" sc: "+starCount);
            newBestStars=true;

        }

        if (typeof(Storage) !== "undefined") {
            localStorage.setItem('bestTime',bestSeconds);
            localStorage.setItem('bestScore',bestTurns);
            localStorage.setItem('bestStars',bestStars);

        }
    }
}

function resetTopMarks() {
    if (typeof(Storage) !== "undefined") {
        localStorage.bestScore=0;
        localStorage.bestTime=0;
        localStorage.bestStars=1;
    }
    closeMenu();
}

function displayTopMarks() {
     if (typeof(Storage) !== "undefined") {
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
    console.log("display best stars: "+bestStars);
    document.getElementById('best-score').innerHTML="Fewest Turns: "+bestTurns;
    document.getElementById('best-time').innerHTML="Fasted Game: "+ formatTime2(bestSeconds);
}

function formatTime2(s) {
    let hStr, mStr, sStr;
    let hours=Math.floor(s/3600);
    let minutes=Math.floor((s-(hours*3600))/60);
    let seconds=s-((hours*3600)+(minutes*60));

    if (hours==0) {
        hStr="";
    } else {
        hStr=hours;
    }

    if (hours>0 && minutes<10) {
        mStr="0"+minutes;
    } else {
        mStr=minutes;
    }

    if (seconds<10) {
        sStr="0"+seconds;
    } else {
        sStr=seconds;
    }

    if (hours==0) {
        return(mStr+"m "+sStr+"s");
    } else {
        return(hStr+"h "+mStr+"m "+sStr+"s");
    }
}

function buildGrid() { //on load and on reset

    // reset all the variables
    cards=[];
    faceUp=[];
    turns=-1;  //  should be set at -1
    matches=0;
    gameSeconds=-1;
    gameMinutes=0;
    gamehours=0;
    newBestTurns=false;
    newBestStars=false;
    newBestTime=false;
    gameStarted=false;
    starCount=3;

    console.log("new game");
    clearInterval(myTime);
    buildIconArray();

    //resetTopMarks();  //only when needed  [TODO]: Add menu option to clear
    gameTimer();  //once to set/reset timer to zero
    displayTopMarks();

    for (let x=1; x<=3; x++) {  //set/reset stars
        document.getElementById('star'+x).classList.remove("glyphicon-star-empty");
        document.getElementById('star'+x).classList.add("glyphicon-star");
    }

    updateTurns();

    document.getElementById("card-grid").remove();

    let newCardGrid=document.createElement('div');
    let z=1;  //used for laying out grid
    for (let x=0; x<=3; x++) {
        let newRowDiv = document.createElement('div');
        for (let i=(x*4); i <=(x*4)+3; i++) {
            z+=1;
            let newWrapDiv = document.createElement('div');
            let newFrontDiv = document.createElement('div');
            let newBackDiv = document.createElement('div');
            let newBackP = document.createElement('p');

            //build back
            switch(designChoice) {
                case "dogs":
                case "flowers":
                    newBackDiv.style.backgroundImage="url("+cards[i].iconString+")";
                    newBackDiv.style.backgroundSize="cover";
                    break;

                default:
                    newBackP.classList.add("glyph--card");
                    newBackP.classList.add("glyphicon");
                    newBackP.classList.add(cards[i].iconString);
                    newBackDiv.appendChild(newBackP);
            }
            newBackDiv.classList.add("card");
            newBackDiv.classList.add("card__back");

            //build front
            newFrontDiv.classList.add("card");
            newFrontDiv.classList.add("card__front");
            newFrontDiv.classList.add("card__front--shadow");

            //build wrapper
            newWrapDiv.classList.add("card");
            newWrapDiv.classList.add("card-wrap-new");
            newWrapDiv.id=i;
            newWrapDiv.addEventListener('click', function(){ cardClicked(this);});
            newWrapDiv.appendChild(newFrontDiv);
            newWrapDiv.appendChild(newBackDiv);

            //add wrapper to row
            newRowDiv.appendChild(newWrapDiv);
        }
        //add row to card grid
        newRowDiv.classList.add("row-new");
        newCardGrid.appendChild(newRowDiv);
    }
    //append new card grid
    newCardGrid.id = "card-grid";
    document.getElementById("field").appendChild(newCardGrid);
}

//Get the design choice then randomly sort the face elements and
//select the first 8 - duplicate those so there are two of each
//then randomly sort again.
function buildIconArray() {
    setFaceDesign();
    let numArray=[];
    let card={};
    let designCount=Object.keys(faceDesign).length;

    for(let i=0; i<= designCount-1; i++) {
        numArray.push(i);
    }

    //randomly sort all face options
    numArray.sort(function(a, b){return 0.5 - Math.random()});
    //grab the first eight face options and duplicate so there are 16
    let iconArray = numArray.slice(0,8);
    iconArray = iconArray.concat(iconArray);
    //randomly sort the 16 faces
    iconArray.sort(function(a, b){return 0.5 - Math.random()});

    for (let i=0; i<=15; i++) {
        card = {
            flipped: "False",
            iconString: faceDesign[iconArray[i]]
        }
        cards.push(card);
    }
}

function gameOver() {
    clearInterval(myTime);
    let modal=document.getElementById('overModal');
    let okButton=document.querySelectorAll('#overModal #over-ok')[0];

    //clear astericks from previous games

      if (newBestTurns) {

        document.getElementById('turns-record').classList.add("glyphicon");
        document.getElementById('turns-record').classList.add("glyphicon-asterisk");
        document.getElementById('turns-record').classList.add("glyph--color");
    } else {
        document.getElementById('turns-record').classList.remove("glyphicon-asterisk");
    }
    if (newBestTime) {
        document.getElementById('time-record').classList.add("glyphicon");
        document.getElementById('time-record').classList.add("glyphicon-asterisk");
        document.getElementById('time-record').classList.add("glyph--color");
    } else {
        document.getElementById('time-record').classList.remove("glyphicon-asterisk");
    }
    if (newBestStars) {
        document.getElementById('stars-record').classList.add("glyphicon");
        document.getElementById('stars-record').classList.add("glyphicon-asterisk");
        document.getElementById('stars-record').classList.add("glyph--color");
    } else {
        document.getElementById('stars-record').classList.remove("glyphicon-asterisk");
    }

    modal.style.display="block";

    // create your stars div
    if ( document.getElementById('star-list') !== null) {
            document.getElementById('star-list').remove();
      }

    let newStarUl = document.createElement('ul');
    let newStarDiv = document.createElement('div');
    for (let x=1; x<=starCount;x++) {
        let newStarli = document.createElement('li');
        let newStarSpan = document.createElement('span');
        newStarSpan.classList.add("glyphicon");
        newStarSpan.classList.add("glyphicon-star");
        newStarli.appendChild(newStarSpan);
        newStarUl.appendChild(newStarli);
    }
    newStarDiv.appendChild(newStarUl);
    newStarDiv.classList.add("stars");
    newStarDiv.id="star-list";
    document.getElementById('your-stars').appendChild(newStarDiv);

    // Create Best Stars div
    if ( document.getElementById('best-star-list') !== null) {
            document.getElementById('best-star-list').remove();
       }

    newStarUl = document.createElement('ul');
    newStarDiv = document.createElement('div');
    for (let x=1; x<=bestStars;x++) {
        let newStarli = document.createElement('li');
        let newStarSpan = document.createElement('span');
        newStarSpan.classList.add("glyphicon");
        newStarSpan.classList.add("glyphicon-star");
        newStarli.appendChild(newStarSpan);
        newStarUl.appendChild(newStarli);
    }
    newStarDiv.appendChild(newStarUl);
    newStarDiv.classList.add("stars");
    newStarDiv.id="best-star-list";
    document.getElementById('best-stars').appendChild(newStarDiv);

    document.getElementById('your-turns').innerHTML=turns;
    document.getElementById('best-turns').innerHTML=bestTurns;
    document.getElementById('your-time').innerHTML=formatTime2(gameSeconds);
    document.getElementById('best-time2').innerHTML=formatTime2(bestSeconds);

    okButton.onclick = function() {
        modal.style.display = "none";
        buildGrid();
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            buildGrid();
        }
    }
}

function resetGame() {
    clearInterval(myTime);

    let modal=document.getElementById('resetModal');
    let noButton=document.querySelectorAll('#resetModal #reset-no')[0];
    let yesButton=document.querySelectorAll('#resetModal #reset-yes')[0];

    modal.style.display="block";

    noButton.onclick = function() {
        modal.style.display = "none";
        if (gameSeconds>0) {
               myTime=setInterval(gameTimer, 1000);
        }
    }

    yesButton.onclick=function() {
        modal.style.display = "none";
        buildGrid();
    }

   window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            if (gameSeconds>0) {
               myTime=setInterval(gameTimer, 1000);
            }
        }
    }
}


// function close(){
//     this.style.display="none";
// }


function cardClicked(e) {
    let eIndex=e.getAttribute("id");

    if (!gameStarted) {
        gameStarted=true;
        myTime=setInterval(gameTimer, 1000);
    }
    if (!(faceUp.length==2)) {  //only 2 clicks at a time please
        if (cards[eIndex].flipped=="False") {
            //e.querySelector('.card__front').classList.remove('card__front--shadow');
            e.classList.add("bounce-up");
            cards[e.getAttribute("id")].flipped="True";
            faceUp.push(e.getAttribute("id"));

            setTimeout(flipUp.bind(null,e), 850);  //delayed for bounce up
            setTimeout(removeFrontShadow.bind(null,e),1000);  //delated for bounce and flip
            if (faceUp.length==2) {
                if (cards[faceUp[0]].iconString==cards[faceUp[1]].iconString) {
                    setTimeout(isMatchTrue, 1500);
                } else {  //no match
                    setTimeout(isMatchFalse, 1500);
                }
            }
        } //else card is face up -- do nothing
    }
}

function flipUp(e) {
    e.classList.add("flip-back");
}

function removeFrontShadow(e) {
    e.querySelector('.card__front').classList.remove('card__front--shadow');
}

function updateTurns() {
    turns+=1;
    document.getElementById('turns').innerHTML="Turns: "+turns;
    if (turns==17) {
        document.getElementById('star3').classList.remove("glyphicon-star");
        document.getElementById('star3').classList.add("glyphicon-star-empty");
        starCount=2;
    }

    if (turns==24) {
        document.getElementById('star2').classList.remove("glyphicon-star");
        document.getElementById('star2').classList.add("glyphicon-star-empty");
        starCount=1;
    }

    if (turns==33) {
        document.getElementById('star1').classList.remove("glyphicon-star");
        document.getElementById('star1').classList.add("glyphicon-star-empty");
        starCount=0;
    }

}

function isMatchTrue() {
    document.getElementById(faceUp[0]).classList.add("aniMatch");
    document.getElementById(faceUp[1]).classList.add("aniMatch");
    updateTurns();
    matches+=1;
    faceUp=[];

    if (matches==8){

        clearInterval(myTime);
        saveTopMarks();

        setTimeout(gameOver, 800);
    } //back to listening for click
}

function isMatchFalse() {
    updateTurns();
    for (let i=0; i<=1; i++) {
        document.getElementById(faceUp[i]).classList.add("aniNoMatch");
        document.getElementById(faceUp[i]).classList.add("aniNoMatch");
        document.getElementById(faceUp[i]).classList.remove("bounce-up");
        document.getElementById(faceUp[i]).classList.remove("bump");
        setTimeout(flipDown.bind(null, i), 700);
        document.getElementById(faceUp[i]).querySelector('.card__front').classList.add('card__front--shadow');
        cards[faceUp[i]].flipped="False";
    }
    setTimeout(clearFaceUp, 750);
    //back to listening let delayed=
}

function clearFaceUp(){
    faceUp=[];
}

function flipDown(i) {
    document.getElementById(faceUp[i]).classList.remove("flip-back");
    document.getElementById(faceUp[i]).classList.remove("aniNoMatch");
}

function gameTimer() {
    gameSeconds += 1;
    document.getElementById('time').innerHTML="Time: "+formatTime2(gameSeconds);
}

document.body.onload=buildGrid();
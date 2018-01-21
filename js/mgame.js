
var cards=[];
var faceUp=[];
var turns=-1;
var matches=0;
var designChoice="glyphs";
var faceDesign=[];

function setFaceDesign() {
    faceDesign=[];
    switch (designChoice) {
        case "dogs":
         faceDesign = [
            "./img/dog1.jpg","./img/dog2.jpg","./img/dog2.jpg","./img/dog3.jpg",
            "./img/dog4.jpg","./img/dog5.jpg","./img/dog6.jpg","./img/dog7.jpg",
            "./img/dog8.jpg","./img/dog8.jpg","./img/dog10.jpg","./img/dog11.jpg"
        ]
        break;

        case "flowers":
            faceDesign = [
                "./img/flower1.jpg", "./img/flower2.jpg","./img/flower4.jpg",
                "./img/flower5.jpg","./img/flower6.jpg","./img/flower7.jpg","./img/flower8.jpg",
                "./img/flower9.jpg","./img/flower10.jpg","./img/flower11.jpg","./img/flower12.jpg",
                "./img/flower13.jpg","./img/flower14.jpg","./img/flower15.jpg"
            ]
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
            ]
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

function buildGrid() { //on load and on reset

    // reset all the variables
    cards=[];
    faceUp=[];
    turns=-1;
    matches=0;

    updateTurns();
    buildIconArray();

    document.getElementById("card-grid").remove();

    let newCardGrid=document.createElement('div');

    for (let i = 0; i <= 15; i++) {
        let newWrapDiv = document.createElement('div');
        let newFrontDiv = document.createElement('div');
        let newBackDiv = document.createElement('div');
        let newBackP = document.createElement('p');

        //build back
            switch(designChoice) {
                case "dogs":
                case "flowers":
                    newBackDiv.style.backgroundImage="url("+cards[i].iconString+")";
                    break;

                default:
                    newBackP.classList.add("glyph--center");
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
            newWrapDiv.classList.add("card__wrapper");
            newWrapDiv.id=i;
            newWrapDiv.addEventListener('click', function(){ cardClicked(this);});
            newWrapDiv.appendChild(newFrontDiv);
            newWrapDiv.appendChild(newBackDiv);

        //build card grid
            newCardGrid.appendChild(newWrapDiv);
    }

    //append new card grid
        newCardGrid.classList.add("card-grid");
        newCardGrid.id = "card-grid";
        document.getElementById("field").appendChild(newCardGrid);
}

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

function onWin() {
    let modal=document.getElementById('modal');
    let x = document.getElementsByClassName("close")[0];

    document.getElementById('congrats').innerHTML="Congratulations! You completed this game in "+turns+" turns!";

    modal.style.display="block";

    x.onclick = function() {
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

function cardClicked(e) {
    let eIndex=e.getAttribute("id");
    if (!(faceUp.length==2)) {  //only 2 clicks at a time please
        if (cards[eIndex].flipped=="False") {
            e.querySelector('.card__front').classList.remove('card__front--shadow');
            e.classList.add("bounce-up");
            cards[e.getAttribute("id")].flipped="True";
            faceUp.push(e.getAttribute("id"));

            setTimeout(flipUp.bind(null,e), 850);  //delayed for bounce up

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

function updateTurns() {
    turns+=1;
    document.getElementById('score').innerHTML=turns;
    return(turns);
}

function flipUp(e) {
    e.classList.add("flip-back");
}

function isMatchTrue() {
    document.getElementById(faceUp[0]).classList.add("aniMatch");
    document.getElementById(faceUp[1]).classList.add("aniMatch");
    updateTurns();
    matches+=1;
    faceUp=[];

    if (matches==8){
        setTimeout(onWin, 800);
    }
    //back to listening for click
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

document.body.onload=buildGrid();
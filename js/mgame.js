

var cards=[];
var faceUp=[];
var turns=-1;
var matches=0;
var t0, t1, t2, t3;  //timers
var designChoice="flowers";


switch (designChoice) {
    case "dogs":
     var faceDesign = [
        "./img/dog1.jpg","./img/dog2.jpg","./img/dog2.jpg","./img/dog3.jpg",
        "./img/dog4.jpg","./img/dog5.jpg","./img/dog6.jpg","./img/dog7.jpg",
        "./img/dog8.jpg","./img/dog8.jpg","./img/dog10.jpg","./img/dog11.jpg"
    ]
    break;

    case "flowers":
        var faceDesign = [
            "./img/flower1.jpg", "./img/flower2.jpg","./img/flower4.jpg",
            "./img/flower5.jpg","./img/flower6.jpg","./img/flower7.jpg","./img/flower8.jpg",
            "./img/flower9.jpg","./img/flower10.jpg","./img/flower11.jpg","./img/flower12.jpg",
            "./img/flower13.jpg","./img/flower14.jpg","./img/flower15.jpg"
            ]
        break;

    default:
     var faceDesign = [
        "glyphicon-plus","glyphicon-eur","glyphicon-envelope","glyphicon-cloud",
        "glyphicon-music","glyphicon-search","glyphicon-heart","glyphicon-film",
        "glyphicon-star","glyphicon-home","glyphicon-flag","glyphicon-camera",
        "glyphicon-leaf","glyphicon-fire","glyphicon-eye-open","glyphicon-shopping-cart",
        "glyphicon-paperclip","glyphicon-phone","glyphicon-usd","glyphicon-phone-alt",
        "glyphicon-tree-conifer","glyphicon-tree-deciduous","glyphicon-apple",
        "glyphicon-hourglass","glyphicon-sunglasses"
    ]
}


function openMenu() {
    document.getElementById("mySidemenu").style.width = "250px";
}

function closeMenu() {
    document.getElementById("mySidemenu").style.width = "0";
}




function buildGrid() { //on load and on reset

    // clear all the variables
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
                   newBackP.classList.add("memImage");
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
        //newCardGrid.classList.add("row");
        newCardGrid.classList.add("card-grid");
        newCardGrid.id = "card-grid";

        document.getElementById("field").appendChild(newCardGrid);
}

function buildIconArray() {
    let numArray=[];
    let card={};
    let designCount=Object.keys(faceDesign).length;

    for(let i=0; i<= designCount-1; i++) {
        numArray.push(i);
    }

    numArray.sort(function(a, b){return 0.5 - Math.random()});
    let iconArray = numArray.slice(0,8);
    iconArray = iconArray.concat(iconArray);
    iconArray.sort(function(a, b){return 0.5 - Math.random()});

    for (let i=0; i<=15; i++) {
        card = {
            flipped: "False",
            iconString: faceDesign[iconArray[i]]
        }
        //console.log(card);
        cards.push(card);
    }
}

function onWin() {
    console.log("onWin fired");
    let modal=document.getElementById('modal');
    let x = document.getElementsByClassName("close")[0];


    document.getElementById('congrats').innerHTML="Congratulations! You completed this game in "+turns+" turns!";

    modal.style.display="block";

    document.getElementsByClassName('close')[0].focus();

    x.onclick = function() {
        modal.style.display = "none";
        buildGrid;
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            buildGrid;
        }
    }
}

function cardClicked(e) {
    let eIndex=e.getAttribute("id");
    let x=0;

    if (!(faceUp.length==2)) {  //only 2 clicks at a time please

    if (cards[eIndex].flipped=="True") {
        console.log("already flipped");

    }   else {
            e.querySelector('.card__front').classList.remove('card__front--shadow');
            e.classList.add("bounce-up");
            cards[e.getAttribute("id")].flipped="True";
            faceUp.push(e.getAttribute("id"));

            let delayed=setTimeout(flipUp.bind(null,e), 850);  //delayed for bounce up

            if (faceUp.length ==2) {

                if (cards[faceUp[0]].iconString==cards[faceUp[1]].iconString) {
                    setTimeout(isMatchTrue, 1500);
                } else {  //no match
                    x=setTimeout(isMatchFalse, 1500);
                }
            }
        }
    }

}


function updateTurns() {
    turns+=1;
    document.getElementById('score').innerHTML=turns;
    return(turns);
}

function flipUp(e) {
    e.classList.add("flip-back");

    return(e);
}


function isMatchTrue() {
        let x=0;
        document.getElementById(faceUp[0]).classList.remove("aniNoMatch");
        document.getElementById(faceUp[0]).classList.add("aniMatch");
        document.getElementById(faceUp[1]).classList.add("aniMatch");
        console.log(faceUp);

        updateTurns();

        matches+=1;
        console.log("1. faceUp = "+faceUp.length);
        if (matches==8){
            onWin();
            buildGrid();
        }

        faceUp=[];
        console.log("isMatchTrue says faceUp = "+faceUp.length)

        return(x);
}



function isMatchFalse() {
    let i=0;
    updateTurns();

    for (i=0; i<=1; i++) {
            document.getElementById(faceUp[i]).classList.add("aniNoMatch");
            document.getElementById(faceUp[i]).classList.add("aniNoMatch");
            //let eIndex=faceUp.pop();
            document.getElementById(faceUp[i]).classList.remove("bounce-up");
            document.getElementById(faceUp[i]).classList.remove("bump");
            //document.getElementById(faceUp[i]).classList.remove("flip-back");
            let delayed=setTimeout(flipDown.bind(null, i), 700);
            document.getElementById(faceUp[i]).querySelector('.card__front').classList.add('card__front--shadow');
            cards[faceUp[i]].flipped="False";
        }

        let delayed=setTimeout(clearFaceUp, 750);
        console.log("isMatchFalse says faceUp = "+faceUp.length);
        return(i);

    }



function clearFaceUp(){
    faceUp=[];
    return(faceUp);
}

function flipDown(i) {
    console.log("ismatchfalse--fliDown i = "+i);
    document.getElementById(faceUp[i]).classList.remove("flip-back");
    return(i);
}





document.body.onload=buildGrid();

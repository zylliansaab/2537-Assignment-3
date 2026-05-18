

// Card
let firstCard = undefined
let secondCard = undefined
let firstCardID = undefined
let secondCardID = undefined

// Scores
let score = 0;
let winningScore = 3;

// Timers
let secondsLeft = undefined;

function setup() {
  $(".card").on(("click"), function () {    
    if ($(this).hasClass("flip")) {
      console.log("Already flipped!");
      return;
    } else {
      $(this).toggleClass("flip");
      if (!firstCard) {
      firstCard = $(this).find(".front_face")[0]
      firstCardID = $(firstCard).attr("id");
      } else {  
      secondCard = $(this).find(".front_face")[0]
      secondCardID = $(secondCard).attr("id");
        matchCards();
      }
    } 
  });
}

function matchCards() {
  if (
    firstCard.src
    ==
    secondCard.src
  ) {
    console.log("match")
    $(`#${firstCard.id}`).parent().off("click")
    $(`#${secondCard.id}`).parent().off("click")
    firstCard = undefined;
    secondCard = undefined;
    score++;
    checkScore(score);
  } else {
    console.log("no match")
    let firstUnmatchedCard = firstCard.id;
    let secondUnmatchedCard = secondCard.id;

    setTimeout(() => {
      $(`#${firstUnmatchedCard}`).parent().toggleClass("flip")
      $(`#${secondUnmatchedCard}`).parent().toggleClass("flip")
    }, 1000)
    firstCard = undefined;
    secondCard = undefined;
    firstCardID = undefined;
    secondCardID = undefined;
  }
}

// Game Timer
let gameTimer = setInterval(function(e) {
    e--;

    $("#timer").text(e);

    if (e <= 0) {
        clearInterval(gameTimer);
        alert("Time's up!");
    }
}, 1000);

function powerUp(e) {
  // Power up timer
let powUpTimer = setInterval(function(e) {
    e--;

    if (secondsLeft <= 0) {
        clearInterval(powUpTimer);
    }

    alert("Power Up!")
  }, 1000);
}

function checkScore(e) {
  const container = document.getElementById("result");
  const result = document.createElement("p");
  if (e == winningScore) {
    result.textContent = "Big W!";
    container.appendChild(result);
  } else {
    return;
  }
}


$(document).ready(setup)
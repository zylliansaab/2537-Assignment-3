

// Card
let firstCard = undefined
let secondCard = undefined
let firstCardID = undefined
let secondCardID = undefined

// Scores
let score = 0;
let winningScore = 8;

// Timers
let gameTimerSeconds = undefined;
let diffTimer = 80;
let gameTimer = null;

// Power Up
let powUpStreak = 0;
let powUpTimeLeft = 0;
let powUpInit = false;
let powUpWait = 5;

// RandNum
let n = 0;

// Theme
let theme = undefined;

let gameStarted = false;

// Game Timer
function startTimer() {
  clearInterval(gameTimer);

  gameTimer = setInterval(function () {
    if (gameStarted) {
      gameTimerSeconds--;

      $("#timer").text(gameTimerSeconds);

      if (gameTimerSeconds <= 0) {
        clearInterval(gameTimer);
        $(`#result`).text("Better Luck Next Time!");
        $(".card").addClass("flip");
        setTimeout(() => {
          reset();
        }, 3000);
      }
    } else {
      return;
    }
  }, 1000);
}

function start() {
  $("#start").on("click", function () {
    if (!gameStarted) {
      $(`#result`).text("");
      gameTimerSeconds = diffTimer;
      gameStarted = true;
      setup();
      startTimer();
      console.log("Game start!")
    } else {
      return;
    }
  });
}

function difficulty() {
  $(".diff").on("click", function () {
    if (!gameStarted) {
      if ($(this).attr("id") == "easy") {
        diffTimer = 100;
        $("#timer").text(diffTimer);
      } else if ($(this).attr("id") == "normal") {
        diffTimer = 80;
        $("#timer").text(diffTimer);
      } else if ($(this).attr("id") == "hard") {
        diffTimer = 45;
        $("#timer").text(diffTimer);
      } else if ($(this).attr("id") == "impossible") {
        diffTimer = 5;
        $("#timer").text(diffTimer);
      }
    } else {
      return;
    }

    $("#time-preview").text("Based on difficulty, your time limit is: " + diffTimer);
  });
}

function bgMode() {
  $(".bgmode").on("click", function () {
    if ($(this).attr("id") == "lightmode") {
      document.body.style.backgroundColor = "white";
      document.body.style.color = "black";
      theme = "white";
      $(".card").css("background-color", "white");
    } else if ($(this).attr("id") == "darkmode") {
      document.body.style.backgroundColor = "#121212";
      document.body.style.color = "white";
      theme = "#121212";
      $(".card").css("background-color", "#121212");
    } else if ($(this).attr("id") == "contrastmode") {
      document.body.style.backgroundColor = "black";
      document.body.style.color = "white";
      theme = "black";
      $(".card").css("background-color", "black");
    }
  });
}

function reset() {

  if (gameStarted) {
    cardGeneration();
    clearInterval(gameTimer);
    secondsLeft = undefined;
    gameStarted = false;
    powUpInit = false;
    $("#matches").text("Correct matches: 0");

    gameTimerSeconds = diffTimer;
    $("#timer").text(gameTimerSeconds);
    $(".card").removeClass("flip").removeClass("match");
    score = 0;
    return;
  } else {
    return;
  }

}

function setup() {
  $(".card").on(("click"), function () {
    if (gameStarted) {
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
    } else {
      return;
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
    powerUpInitialize();
    $(`#${firstCard.id}`).parent().off("click")
    $(`#${secondCard.id}`).parent().off("click")
    $(`#${firstCard.id}`).parent().addClass("match")
    $(`#${secondCard.id}`).parent().addClass("match")
    score++;
    $("#matches").text("Correct matches: " + score);
    setTimeout(() => {
      firstCard = undefined;
      secondCard = undefined;
    }, 3000);

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

function powerUpInitialize() {
  if (!powUpInit) {
    powUpInit = true;

    let powUpInterval = setInterval(function () {
      powUpWait--;

      if (powUpWait <= 0) {
        powUpInit = false;
        powUpWait = 5;
        powUpStreak = 0;
        clearInterval(powUpInterval)
        return;
      } else if (powUpStreak >= 2) {
        powUpWait = 5;
        powUpStreak = 0;
        clearInterval(powUpInterval)
        powerUp()
      }
    }, 1000);

    powUpStreak++;
  } else {
    powUpStreak++;
  }
}

function powerUp() {
  $("#powup").text("Power Up!!!");
  const hiddenCards = $(".card").not(".match").not(".flip");
  hiddenCards.toggleClass("flip");

  setTimeout(() => {
    $("#powup").text("");
    hiddenCards.toggleClass("flip");
  }, 3000)

}

async function cardGeneration() {
  n = 0;
  const IdArray = new Set();
  while (IdArray.size < 8) {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    IdArray.add(randomId);
  }

  const fetchPokemon = Array.from(IdArray).map(async (id) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      image: data.sprites.other['official-artwork'].front_default
    };
  });

  const pokeCardsJson = await Promise.all(fetchPokemon);

  let deck = [...pokeCardsJson, ...pokeCardsJson]

  console.log(deck.length)

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  const gameGrid = document.getElementById("game_grid");
  gameGrid.innerHTML = "";

  deck.forEach((index) => {
    n++;
    let gameCard = document.createElement("div");
    gameCard.className = "card";
    gameCard.style.backgroundColor = theme;

    gameCard.innerHTML = ` 
                  <img id="${n}" class="front_face" src="${index.image}" alt="">
                  <img class="back_face" src="back.webp" alt="">
            `;
    gameGrid.appendChild(gameCard);
  });

}

function checkScore(e) {
  if (e == winningScore) {
    $(`#result`).text("Big W");
    setTimeout(() => {
      reset();
    }, 1000);
  } else {
    return;
  }
}

$(document).ready(function () {
  $("#reset").on("click", function () {
    reset();
  });
});

$(document).ready(bgMode);
$(document).ready(difficulty);
$(document).ready(start);
cardGeneration();

function setup () {
  let firstCard = undefined
  let secondCard = undefined
  $(".card").on(("click"), function () {
    $(this).toggleClass("flip");

    if (!firstCard)
      firstCard = $(this).find(".front_face")[0]
    else {
      secondCard = $(this).find(".front_face")[0]
      console.log(firstCard, secondCard);
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
      } else {
        console.log("no match")
        let firstUnmatchedCard = firstCard.id;
        let secondUnmatchedCard = secondCard.id;
        setTimeout(() => {
          $(`#${firstUnmatchedCard}`).parent().toggleClass("flip")
          $(`#${secondUnmatchedCard}`).parent().toggleClass("flip")
        }, 1000)
        console.log("flipped")
        firstCard = undefined;
        secondCard = undefined;
      }
    }
  });
}

$(document).ready(setup)
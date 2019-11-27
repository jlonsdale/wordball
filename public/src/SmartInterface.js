import Letter from './letter.js'
import { DEFAULT_TIMER, letterGroups } from './config.js'
import { newLevel } from '../main.js'


export function playSmartGame (game) {
  const playerLetters = ["A", "R", "E", "Y", "J", "M"]
  const skillPoints = game.skillPoints
  const letterGetReq = playerLetters.join('').toLowerCase()
  const letters = new Letter()
  const timeInterval = setInterval(countdown, 1000)
  let timeLeft = DEFAULT_TIMER
  $('#score').text('Current Score: ' + game.smartPoints)

  function countdown() {
  if (timeLeft === 0) {
    $("#smartapp").hide()
    $("#gameover").show()
    $("#skillpoints").text(game.skillPoints)
    $("#smartpoints").text(game.smartPoints)
    $("#total").text(game.smartPoints + game.skillPoints)
    clearInterval(timeInterval)
    } else {
      $('#timer').text(timeLeft + ' seconds remaining')
      timeLeft--
    }
  }

  countdown()

  $.get(`https://jsonp.afeld.me/?url=http://anagramica.com/all/:${letterGetReq}`, function(data) {
      game.possibleWords = data.all.filter((w) => { if (w.length > 2) { return true } }).map((w) => {
        return w.toUpperCase()
      })
  });

  generateLetterButtons ()
  let wordInput = ''

  $('#clearbutton').click(() => {
    clearTextInput()
  })

  $('[class*="letterbutton-on"]').click(() => {
    if (event.target.className === "letterbutton-off") { return }
    wordInput += event.target.innerHTML
    event.target.className = "letterbutton-off"
    $('#typearea').text(wordInput)
    if (!game.validWords.includes(wordInput) && game.possibleWords.includes(wordInput)) {
      game.validWords.push(wordInput)
      savePoints()
      clearTextInput()
    }
    $('#validwordslist').html(game.validWords.join(' - '))
  })

  function generateLetterButtons () {
    const buttonHTML = game.playerLetters.map((letter) => {
      const score = letters.getScore(letter)
      return `<button class="letterbutton-on${score}" value="${score}">${letter}</button>`
    })
    $('#letterkeys').html(buttonHTML.join('\n'))
  }

  function clearTextInput () {
    wordInput = ''
    $('#typearea').text(wordInput)

    $('.letterbutton-off').each((_index, button) => {
      $(button).attr('class', `letterbutton-on${button.value}`)
    })
  }

  function savePoints () {
    wordInput.split('').forEach((char) => {
      game.smartPoints += letters.getScore(char)
    })
    $('#score').text('Current Score: ' + game.smartPoints)
  }
}

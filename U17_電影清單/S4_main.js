//***********設定遊戲狀態***********
const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardsMatchFailed",
  CardsMatched: "CardsMatched",
  GameFinished: "GameFinished",
}

//***********宣告***********
const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 34, 35, 36, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52]
//cards數字說明 0 - 12：黑桃 1 - 13
//             13 - 25：愛心 1 - 13
//             26 - 38：方塊 1 - 13
//             39 - 51：梅花 1 - 13

//宣告花色
const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

let revealedCards = [,]
let score = 0

//***********和流程有關的程式碼***********
const controller = {
  //定義初始狀態
  currentState: GAME_STATE.FirstCardAwaits
  ,
  //產生52張亂數卡片
  generateCards() {
    view.displayCards(utility.getRanderNumberArray(52))
  }
  ,
  //依照不同的遊戲狀態，做不同的動作
  dispatchCardAction(card) {
    if (!card.classList.contains('back')) {
      return
    }

    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        console.log('debug 1')
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break

      case GAME_STATE.SecondCardAwaits:
        view.flipCards(card)
        model.revealedCards.push(card)
        view.renderTriedTimes(++model.triedTimes)

        //判斷配對是否成功
        if (model.isRevealedCardsMatched()) {
          //配對成功
          this.currentState = GAME_STATE.CardsMatched
          view.pairCards(...model.revealedCards)
          view.renderScore(model.score += 10)
          view.showCompletePage(model.score)
          view.rederFinishedTriedTimes(model.triedTimes)
          model.revealedCards = []
          this.currentState = GAME_STATE.FirstCardAwaits

        } else {
          //配對失敗
          GAME_STATE.CardsMatchFailed
          view.appendWrongAnimation(...model.revealedCards)
          setTimeout(this.resetCards, 1000)
        }

        break
    }

    console.log('this.currentState', this.currentState)
    console.log('revealedCards', model.revealedCards.map(card => card.dataset.index))
  }
  ,
  resetCards() {
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    controller.currentState = GAME_STATE.FirstCardAwaits
  }
}

//***********和資料庫有關的程式碼***********
const model = {
  revealedCards: []
  ,

  //確認發開的兩個值是否相等，是回傳true，不是回傳false
  isRevealedCardsMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  }
  ,

  score: 0
  ,

  triedTimes: 0

}

//***********和介面有關的程式碼***********
const view = {
  //亂數產生52張卡片
  displayCards(indexes) {
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = indexes.map(index => this.getCardElement(index)).join('');
  }
  ,
  //渲染卡片背面的花色
  getCardElement(index) {
    return `
   <div class = "card back" data-index = "${index}">
   </div>
   `
  }
  ,
  //卡片翻成正面時，顯示數字跟圖案
  getCardContent(index) {
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]

    return `
    <p>${number}</p>
    <img src=${symbol} alt=#>
    <p>${number}</p>
    `
  }
  ,
  //將數字1, 11, 12, 13換成英文字母A, J, Q, K
  transformNumber(number) {
    switch (number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      default:
        return number
    }
  }

  ,
  //翻卡片
  flipCards(...cards) {
    cards.map(card => {
      if (card.classList.contains('back')) {
        //回傳正面
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
      } else {
        //回傳反面
        card.classList.add('back')
        card.innerHTML = null
      }
    })
  }
  ,
  //更換卡片正面的background顏色
  pairCards(...cards) {
    cards.map(card => {
      card.classList.add('pair')
    })
  }
  ,
  //計算分數
  renderScore(score) {
    document.querySelector('.score').innerText = `Score = ${score}`
  }
  ,
  //計算次數
  renderTriedTimes(times) {
    document.querySelector('.tried').innerText = `You've tried: ${times} times`
  }
  ,
  rederFinishedTriedTimes(times) {
    document.querySelector('.finished .tried').innerText = `You've tried: ${times} times`
  }
  ,
  //閃爍動畫
  appendWrongAnimation(...cards) {
    cards.map(card => {
      card.classList.add('wrong')
      card.addEventListener('animationend', event =>
        event.target.classList.remove('wrong'), { once: true })
    })
  }
  ,
  //顯示結束畫面
  showCompletePage(score) {
    if (score === 260) {
      document.querySelector('.finished').style.display = 'block'
      this.renderScore(model.score)
    } else {
      return
    }
  }
}





//***********外來模組管理區***********
const utility = { //洗牌函式
  getRanderNumberArray(count) {
    const number = Array.from(Array(count).keys(0))

    for (let index = (number.length - 1); index > 0; index--) {
      let randenIndex = Math.floor(Math.random() * (index + 1));
      [number[index], number[randenIndex]] = [number[randenIndex], number[index]]
    }

    return number
  }
}


//***********呼叫***********
controller.generateCards()


//***********監聽器們***********
//監聽器 for 卡片翻面
document.querySelectorAll('.card').forEach(card =>
  card.addEventListener('click', event =>
    controller.dispatchCardAction(event.target)
  )
)
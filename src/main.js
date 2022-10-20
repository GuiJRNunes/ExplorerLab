import "./css/index.css"
import IMask from "imask"

const card = {
  bgColor01: document.querySelector(".cc-bg svg > g g:nth-child(1) path"),
  bgColor02: document.querySelector(".cc-bg svg > g g:nth-child(2) path"),
  logoImg: document.querySelector(".cc-logo span:nth-child(2) img"),
  info: {
    number: document.querySelector(".cc-info > .cc-number"),
    titular: document.querySelector(".cc-info > .cc-holder > .value"),
  },
  extra: {
    expirationDate: document.querySelector(
      ".cc-extra > .cc-expiration > .value"
    ),
    securityCode: document.querySelector(".cc-extra > .cc-security > .value"),
  },
}

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    elo: ["#00A4E0", "#DF6F29"],
    default: ["black", "gray"],
  }

  console.log(type)

  card.bgColor01.setAttribute("fill", colors[type][0])
  card.bgColor02.setAttribute("fill", colors[type][1])
  card.logoImg.setAttribute("src", `cc-${type}.svg`)
}

window.setCardType = setCardType

const securityCode = {
  element: document.querySelector("#security-code"),
  pattern: {
    mask: "0000",
  },
  mask: null,
}
securityCode.mask = IMask(securityCode.element, securityCode.pattern)

const expirationDate = {
  element: document.querySelector("#expiration-date"),
  pattern: {
    mask: "MM{/}YY",
    blocks: {
      YY: {
        mask: IMask.MaskedRange,
        from: String(new Date().getFullYear()).slice(2),
        to: String(new Date().getFullYear() + 10).slice(2),
      },
      MM: {
        mask: IMask.MaskedRange,
        from: 1,
        to: 12,
      },
    },
  },
  mask: null,
}
expirationDate.mask = IMask(expirationDate.element, expirationDate.pattern)

let foundNumberMask
const cardNumber = {
  element: document.querySelector("#card-number"),
  pattern: {
    mask: [
      {
        mask: "0000 0000 0000 0000",
        regex: /^4\d{0,15}/,
        cardtype: "visa",
      },
      {
        mask: "0000 0000 0000 0000",
        regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
        cardtype: "mastercard",
      },
      {
        mask: "0000 0000 0000 0000",
        regex: /^1/,
        cardtype: "elo",
      },
      {
        mask: "0000 0000 0000 0000",
        cardtype: "default",
      },
    ],
    dispatch: function (appended, dynamicMasked) {
      const number = (dynamicMasked.value + appended).replace(/\D/g, "")
      const foundMask = dynamicMasked.compiledMasks.find(function (item) {
        return number.match(item.regex)
      })
      foundNumberMask = foundMask

      return foundMask
    },
  },
  mask: null,
}
cardNumber.mask = IMask(cardNumber.element, cardNumber.pattern)

const titular = {
  element: document.querySelector("#card-holder"),
}

function applyChangeCardInfo(input, destElem, defaultValue) {
  input.addEventListener("change", function () {
    destElem.innerHTML = this.value || defaultValue
  })
}

applyChangeCardInfo(securityCode.element, card.extra.securityCode, "123")
applyChangeCardInfo(expirationDate.element, card.extra.expirationDate, "02/32")
applyChangeCardInfo(cardNumber.element, card.info.number, "1234 5678 9012 3456")
applyChangeCardInfo(titular.element, card.info.titular, "FULANO DA SILVA")

cardNumber.element.addEventListener("change", function () {
  setCardType(foundNumberMask.cardtype || "default")
})

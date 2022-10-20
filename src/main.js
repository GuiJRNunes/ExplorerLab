import "./css/index.css"
import IMask from "imask"

// Elementos do cartão
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

const form = {
  element: document.querySelector("form"),
  cardNumber: {
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

        return foundMask
      },
    },
    mask: null,
  },
  titular: {
    element: document.querySelector("#card-holder"),
  },
  expirationDate: {
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
  },
  securityCode: {
    element: document.querySelector("#security-code"),
    pattern: {
      mask: "0000",
    },
    mask: null,
  },
  addButton: {
    element: document.querySelector("#add-card"),
  },
}

// Aplicar máscaras
form.cardNumber.mask = IMask(form.cardNumber.element, form.cardNumber.pattern)
form.expirationDate.mask = IMask(
  form.expirationDate.element,
  form.expirationDate.pattern
)
form.securityCode.mask = IMask(
  form.securityCode.element,
  form.securityCode.pattern
)

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    elo: ["#00A4E0", "#DF6F29"],
    default: ["black", "gray"],
  }

  card.bgColor01.setAttribute("fill", colors[type][0])
  card.bgColor02.setAttribute("fill", colors[type][1])
  card.logoImg.setAttribute("src", `cc-${type}.svg`)
}

window.setCardType = setCardType

form.titular.element.addEventListener("input", () => {
  card.info.titular.innerText = form.titular.element.value || "FULANO DA SILVA"
})

form.addButton.element.addEventListener("click", () => {
  alert("Cartão adicionado!")
})

form.element.addEventListener("submit", (event) => {
  event.preventDefault()
})

form.securityCode.mask.on("accept", () => {
  card.extra.securityCode.innerText = form.securityCode.element.value || "123"
})

form.expirationDate.mask.on("accept", () => {
  card.extra.expirationDate.innerText =
    form.expirationDate.element.value || "02/32"
})

form.cardNumber.mask.on("accept", () => {
  setCardType(form.cardNumber.mask.masked.currentMask.cardtype)
  card.info.number.innerText =
    form.cardNumber.element.value || "1234 5678 9012 3456"
})

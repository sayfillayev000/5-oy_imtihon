// loader
const loaderEl = document.querySelector('.loader')
const loaderToggler = (info) => {
  if (info) {
    loaderEl.classList.remove('hidden')
  } else {
    loaderEl.classList.add('hidden')
  }
}
loaderToggler
// request
const request = async (reource) => {
  loaderToggler(true)
  const req = await fetch(reource)
  if (!req.ok) {
    loaderToggler(false)
    throw new Error("Something went wrong :(")
  }
  const data = await req.json()
  loaderToggler(false)
  return data
}
const API = 'https://restcountries.com/v3.1/all';
request(API).then((data) => {
  createCountries(data)
}).catch((err) => {
  alert(err.message)
})
// about 
const querySting = window.location.search
const urlParams = new URLSearchParams(querySting)
const country = urlParams.get('country')
const countryAPI = `https://restcountries.com/v3.1/${country}`
request(countryAPI).then((data) => {
  createCounryInfo(data[0])
}).catch((err) => {
  alert(err.message)
});
// update
const cardsEl = document.querySelector('.cards')
// export
const createCountries = (countries) => {
  cardsEl.innerHTML = ''
  countries.forEach((country) => {
    const commonName = country.name.common
    const population = country.population
    const region = country.region
    const capital = country.capital ? country.capital[0] : "No Capital"
    const flag = country.flags.svg
    console.log(region);
    // li
    const li = document.createElement('li')
    li.classList.add('cards__item')
    li.innerHTML = `
            <a href="./about.html?country=/name/${commonName}">
                <img src=${flag} alt="germany-flag" width="267" height="160">
                <div class="cards__item-inner">
                    <h3 class="cards__title">${commonName}</h3>
                    <p class="population">Population: <span>${population}</span></p>
                    <p class="region">Region: <span>${region}</span></p>
                    <p class="capital">Capital: <span>${capital}</span></p>
                </div>
            </a>
        `
    // ul
    cardsEl.appendChild(li)
  })
}
// ABOUT UI
const cuntryInfoEl = document.querySelector('.country-info');
const createCounryInfo = (country) => {
  const { population, borders, capital, flags, name, region, tld, currencies, languages, subregion } = country
  console.log(borders)
  const nativeName = Object.values(name.nativeName)[0].official
  const currency = Object.values(currencies)[0].name
  const language = Object.values(languages)
  cuntryInfoEl.innerHTML = `
    <img
        class="country-info__img"
        src=${flags.svg}
        alt="germany-flag"
        width="560"
        height="400"
    />
  <div class="country-info__content">
    <h2>${name.common}</h2>
    <ul class="country-info__list">
      <li class="country-info__item">
        <p class="name">
          Native Name: 
          <span>${nativeName}</span>
        </p>
        <p class="population">
          Population:
          <span>${population}</span>
        </p>
        <p class="region">
          Region:
          <span>${region}</span>
        </p>
        <p class="sub-region">
          Sub Region:
          <span>${subregion}</span>
        </p>
        <p class="capital">
          Capital:
          <span>${capital}</span>
        </p>
      </li>
      <li class="country-info__item">
        <p class="name">
          Top Level Domain:
          <span>${tld}</span>
        </p>
        <p class="population">
          Currencies:
          <span>${currency}</span>
        </p>
        <p class="region">
          Languages:
          <span>${language}</span>
        </p>
      </li>
    </ul>
    <div class="country-info__borders">
      <h3>Border Countries:</h3>
        ${borders ? borders.map((border) => {
    return `
            <a href="./about.html?country=/alpha/${border}">${border}</a>
            `
  }) : "No Borders"}
    </div>
  </div>
    `
}
// mode
const modeBtn = document.querySelector('.header__dark-mode')
const body = document.querySelector("body")
const modeFromLocal = localStorage.getItem('mode') ? localStorage.getItem('mode') : null
if (modeFromLocal) {
  body.classList.add('dark-mode')
}
const img = document.querySelector('.luna__icon')
modeBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode')
  // img.setAttribute('src', './img/sonse.png')
  // img.toggle.setAttribute('src', './img/sonse.png')
  modeFromLocal ? localStorage.setItem('mode', './img/luna.png') : localStorage.setItem('mode', 'dark')
})
// filter
const searchFormEl = document.querySelector('.search')
searchFormEl.search.addEventListener("input", () => {
  const searchValue = searchFormEl.search.value.toLowerCase()
  const cardsItem = document.querySelectorAll('.cards__item')
  const cardsTitles = document.querySelectorAll('.cards__title')
  cardsTitles.forEach((title, i) => {
    if (title.textContent.toLowerCase().includes(searchValue)) {
      cardsItem[i].style.display = 'block'
    } else {
      cardsItem[i].style.display = 'none'
    }
  })
});
const searchSelect = document.querySelectorAll('.search__select-list li')
const searchSelectSpan = document.querySelector('.search__select span')
searchSelect.forEach((li) => {
  li.addEventListener('click', () => {
    searchSelectSpan.textContent = li.textContent
    let filterAPI
    if (li.textContent == 'All') {
      filterAPI = 'https://restcountries.com/v3.1/all'
    } else {
      filterAPI = `https://restcountries.com/v3.1/region/${li.textContent}`
    }
    request(filterAPI).then((data) => {
      createCountries(data)
    }).catch((err) => {
      alert(err.message)
    })
  })
})
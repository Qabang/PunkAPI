let baseUrl = 'https://api.punkapi.com/v2/beers?'

// Adding eventlisteners.
document
  .querySelector('#search-button')
  .addEventListener('click', (e) => searchbox(e))

document
  .querySelector('#search-form')
  .addEventListener('submit', (e) => searchbox(e))

document.querySelector('#back-to-top').addEventListener('click', () => {
  // Scroll to top.
  window.scroll({
    top: 100,
    left: 100,
    behavior: 'smooth',
  })
})

window.addEventListener('scroll', () => {
  handleScroll()
})

// The custom checkboxes needs special care to be accessible.
let checkboxes = document.querySelectorAll('.checkbox')
checkboxes.forEach((element) => {
  element.addEventListener('click', () => {
    handleAriaChecked()
    element.setAttribute('aria-checked', 'true')
  })

  element.addEventListener('keyup', (e) => {
    // If enter or spacebar is triggered while the custom checkbox is in focus.
    if (e.keyCode === 32 || e.keyCode === 13) {
      let input_checkbox = element.parentNode.querySelector('input')
      handleAriaChecked()
      element.setAttribute('aria-checked', 'true')
      input_checkbox.setAttribute('checked', '')
    }
  })
})

/**
 * Function that handles if the custom checkbox is checked or not.
 */
function handleAriaChecked() {
  checkboxes.forEach((element) => {
    if (element.getAttribute('aria-checked') === 'true') {
      element.setAttribute('aria-checked', 'false')
      element.parentNode.querySelector('input').removeAttribute('checked')
    }
  })
}

// Wait for window to load before running to prevent errors.
window.onload = () => {
  localStorage.setItem('beer-page', 1)

  // Populate abv selectlist
  let abv_selectlist_gt = document.querySelector('#abv-gt')
  let abv_selectlist_lt = document.querySelector('#abv-lt')
  for (let i = 0; i < 68; i++) {
    let opt = document.createElement('option')
    let opt_lt = document.createElement('option')
    opt.value = opt_lt.value = i
    opt.innerHTML = opt_lt.innerHTML = i + ' %'

    abv_selectlist_gt.appendChild(opt)
    abv_selectlist_lt.appendChild(opt_lt)
  }

  let abv_gt = document.createElement('option')
  let abv_lt = document.createElement('option')
  abv_gt.value = abv_lt.value = 'null'
  abv_gt.innerHTML = abv_lt.innerHTML = '-'
  abv_lt.setAttribute('selected', '')
  abv_gt.setAttribute('selected', '')
  abv_selectlist_gt.prepend(abv_gt)
  abv_selectlist_lt.prepend(abv_lt)

  //Load all beers
  getAllBeers('page=' + localStorage.getItem('beer-page'))

  // Add eventlisteners to buttons.
  document.querySelector('.next-button').addEventListener('click', () => {
    localStorage.setItem(
      'beer-page',
      Number(localStorage.getItem('beer-page')) + 1
    )
    let page = 'page=' + localStorage.getItem('beer-page')
    getAllBeers(page)

    if (Number(localStorage.getItem('beer-page')) === 5) {
      document.querySelector('.next-button').setAttribute('disabled', '')
    } else {
      document.querySelector('.next-button').removeAttribute('disabled', '')
    }

    if (Number(localStorage.getItem('beer-page')) === 1) {
      document.querySelector('.prev-button').setAttribute('disabled', '')
    } else {
      document.querySelector('.prev-button').removeAttribute('disabled', '')
    }
  })

  document.querySelector('.prev-button').addEventListener('click', () => {
    localStorage.setItem(
      'beer-page',
      Number(localStorage.getItem('beer-page')) - 1
    )
    let page = 'page=' + localStorage.getItem('beer-page')
    getAllBeers(page)

    // If we are on the first page disable previous button since there is no previous page.
    if (Number(localStorage.getItem('beer-page')) === 1) {
      document.querySelector('.prev-button').setAttribute('disabled', '')
    } else {
      document.querySelector('.prev-button').removeAttribute('disabled', '')
    }
  })
}

/**
 * Function that handles visibility of back to top button depending on scroll level.
 */
function handleScroll() {
  let back_to_top = document.querySelector('#back-to-top')

  // If scroll is 500px down show back to top button else hide it.
  if (window.pageYOffset > 500) {
    back_to_top.style.height = '80px'
    back_to_top.style.bottom = '0'
  } else {
    back_to_top.style.height = '0'
    back_to_top.style.bottom = '-20px'
  }
}

/**
 * Functions that creates the querystring for the api from the search-form values
 * @param {event} e
 */
function searchbox(e) {
  document.querySelector('.loader').style.display = 'block'
  e.preventDefault()
  let query = ''
  let radios = document.querySelectorAll('input[type=radio]')
  let abv_gt = document.querySelector('#abv-gt').value
  let abv_lt = document.querySelector('#abv-lt').value
  if (abv_gt != 'null') {
    query += 'abv_gt=' + abv_gt + '&'
  }

  if (abv_lt != 'null') {
    query += 'abv_lt=' + abv_lt + '&'
  }

  radios.forEach((element) => {
    if (element.checked === true) {
      let value = element.id
      value = value.replace('-', '_')
      let input = document.querySelector('#search-input').value

      if (input) {
        query += value + '=' + input
      }
    }
  })

  getAllBeers(localStorage.getItem('beer-page'), query)
}

/**
 * Function that makes a GET request based on the search query string.
 * @param {string} page
 * @param {string} search_query
 */
function getAllBeers(page, search_query = '') {
  fetch(baseUrl + page + '&per_page=80&' + search_query, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((result) => {
      // Hide spinner.
      document.querySelector('.loader').style.display = 'none'

      //Clear existing cards before adding new.
      let cards_array = document.querySelectorAll('.card-wrapper')
      if (cards_array) {
        cards_array.forEach((element) => {
          element.parentNode.removeChild(element)
        })
      }

      // If result length is less than 80 there is the end of the list and no more pages are available.
      if (result.length < 80) {
        document.querySelector('.next-button').setAttribute('disabled', '')
      } else {
        document.querySelector('.next-button').removeAttribute('disabled', '')
      }

      const entries = Object.entries(result)
      for (const [key, value] of entries) {
        let wrapper = document.querySelector('.beer-card-wrapper')

        // Create the card elements
        let card_wrapper = document.createElement('article')
        card_wrapper.setAttribute('class', 'card-wrapper')
        card_wrapper.setAttribute('beer-id', value.id)
        wrapper.appendChild(card_wrapper)

        let name = document.createElement('h2')
        card_wrapper.appendChild(name)
        name.innerHTML = value.name

        let tagline = document.createElement('p')
        tagline.setAttribute('class', 'tagline')
        card_wrapper.appendChild(tagline)
        tagline.innerHTML = value.tagline

        let image = document.createElement('div')
        image.setAttribute('class', 'image-card')
        card_wrapper.appendChild(image)
        image.style.backgroundImage = 'url(' + value.image_url + ')'

        let description = document.createElement('p')
        description.setAttribute('class', 'description')
        card_wrapper.appendChild(description)
        description.innerHTML = value.description

        let brew_date = document.createElement('p')
        brew_date.setAttribute('class', 'brew-date')
        card_wrapper.appendChild(brew_date)
        brew_date.innerHTML = '<div>First brewed: </div>' + value.first_brewed

        let ul = document.createElement('ul')
        card_wrapper.appendChild(ul)

        let abv = document.createElement('li')
        abv.setAttribute('class', 'abv')
        ul.appendChild(abv)
        abv.innerHTML = 'ABV: ' + value.abv

        let ibu = document.createElement('li')
        ibu.setAttribute('class', 'ibu')
        ul.appendChild(ibu)
        ibu.innerHTML = 'IBU: ' + value.ibu

        let food_pairing = document.createElement('p')
        food_pairing.setAttribute('class', 'food-pairing')
        card_wrapper.appendChild(food_pairing)
        food_pairing.innerHTML =
          'Goes well with:<br><span>' + value.food_pairing + '</span>'

        let download_icon = document.createElement('i')
        let download_btn = document.createElement('button')
        download_icon.setAttribute('class', 'fa fa-download')
        download_btn.innerHTML = 'Download Recipe'
        download_btn.appendChild(download_icon)
        card_wrapper.appendChild(download_btn)

        // Create recipie
        let recipe = document.createElement('article')
        recipe.setAttribute('class', 'recipe')
        recipe.setAttribute('beer-id', value.id)
        recipe.setAttribute('id', 'recipe-' + value.id)
        card_wrapper.appendChild(recipe)

        let title = document.createElement('h2')
        title.innerHTML = name.innerHTML
        recipe.appendChild(title)

        let ingredients_wrapper = document.createElement('section')
        ingredients_wrapper.setAttribute('class', 'recipe-ingredients')
        recipe.appendChild(ingredients_wrapper)

        let ingredient_title = document.createElement('h3')
        ingredient_title.innerHTML = 'Ingredients'
        ingredients_wrapper.appendChild(ingredient_title)

        let malt_icon = document.createElement('div')
        malt_icon.setAttribute('class', 'recipe-icon')
        ingredients_wrapper.appendChild(malt_icon)
        malt_icon.style.backgroundImage = 'url(/assets/images/icons/malt.svg)'

        let malt_wrapper = document.createElement('ul')
        malt_wrapper.setAttribute('class', 'malt')
        ingredients_wrapper.appendChild(malt_wrapper)

        let hops_icon = document.createElement('div')
        hops_icon.setAttribute('class', 'recipe-icon')
        ingredients_wrapper.appendChild(hops_icon)
        hops_icon.style.backgroundImage = 'url(/assets/images/icons/hops.svg)'

        let hops_wrapper = document.createElement('ul')
        hops_wrapper.setAttribute('class', 'hops')
        ingredients_wrapper.appendChild(hops_wrapper)

        let yeast_icon = document.createElement('div')
        yeast_icon.setAttribute('class', 'recipe-icon')
        ingredients_wrapper.appendChild(yeast_icon)
        yeast_icon.style.backgroundImage = 'url(/assets/images/icons/yeast.svg)'

        let yeast_wrapper = document.createElement('p')
        yeast_wrapper.setAttribute('class', 'yeast')
        ingredients_wrapper.appendChild(yeast_wrapper)

        let hops = value.ingredients.hops
        let malt = value.ingredients.malt
        let yeast = value.ingredients.yeast

        ingredients(malt, malt_wrapper)
        ingredients(hops, hops_wrapper)

        if (typeof yeast != 'string') {
          ingredients(yeast, yeast_wrapper)
        } else {
          yeast_wrapper.innerHTML = yeast
        }

        let basics_wrapper = document.createElement('ul')
        basics_wrapper.setAttribute('class', 'recipe-basics')
        recipe.appendChild(basics_wrapper)

        let basics_title = document.createElement('h3')
        basics_title.innerHTML = 'Basics'
        basics_wrapper.appendChild(basics_title)

        let basics_icon = document.createElement('div')
        basics_icon.setAttribute('class', 'recipe-icon')
        basics_wrapper.appendChild(basics_icon)
        basics_icon.style.backgroundImage =
          'url(/assets/images/icons/paper.svg)'

        let volume = document.createElement('li')
        volume.innerHTML =
          'Volume: <span>' +
          value.volume.value +
          ' ' +
          value.volume.unit +
          '</span>'
        basics_wrapper.appendChild(volume)

        let boil_volume = document.createElement('li')
        boil_volume.innerHTML =
          'Boil volume: <span>' +
          value.boil_volume.value +
          ' ' +
          value.boil_volume.unit +
          '</span>'
        basics_wrapper.appendChild(boil_volume)

        let abv_basics = document.createElement('li')
        abv_basics.innerHTML = 'ABV: <span>' + value.abv + '%</span>'
        basics_wrapper.appendChild(abv_basics)

        let target_fg = document.createElement('li')
        let fg_value = (value.target_fg / 1000).toFixed(3)
        target_fg.innerHTML = 'Target FG: <span>' + fg_value + '</span>'
        basics_wrapper.appendChild(target_fg)

        let target_og = document.createElement('li')
        let og_value = (value.target_og / 1000).toFixed(3)
        target_og.innerHTML = 'Target OG: <span>' + og_value + '</span>'
        basics_wrapper.appendChild(target_og)

        let ibu_basics = document.createElement('li')
        ibu_basics.innerHTML = 'IBU: <span>' + value.ibu + '</span>'
        basics_wrapper.appendChild(ibu_basics)

        let ebc = document.createElement('li')
        ebc.innerHTML = 'EBC: <span>' + value.ebc + '</span>'
        basics_wrapper.appendChild(ebc)

        let srm = document.createElement('li')
        srm.innerHTML = 'SRM: <span>' + value.srm + '</span>'
        basics_wrapper.appendChild(srm)

        let ph = document.createElement('li')
        ph.innerHTML = 'pH: <span>' + value.ph + '</span>'
        basics_wrapper.appendChild(ph)

        let attenuation_level = document.createElement('li')
        attenuation_level.innerHTML =
          'attenuation level: <span>' +
          Number(value.attenuation_level / 100).toFixed(2) +
          '</span>'
        basics_wrapper.appendChild(attenuation_level)

        let method_wrapper = document.createElement('section')
        method_wrapper.setAttribute('class', 'recipe-method')
        recipe.appendChild(method_wrapper)

        let method_title = document.createElement('h3')
        method_title.innerHTML = 'Method / Timings'
        method_wrapper.appendChild(method_title)

        let method_icon = document.createElement('div')
        method_icon.setAttribute('class', 'recipe-icon')
        method_wrapper.appendChild(method_icon)
        method_icon.style.backgroundImage =
          'url(/assets/images/icons/clock.svg)'

        let time_temp_title = document.createElement('div')
        time_temp_title.innerHTML = '<span>Temp</span><span>Time</span>'
        method_wrapper.appendChild(time_temp_title)

        let mash = document.createElement('ul')
        method_wrapper.appendChild(mash)
        value.method.mash_temp.forEach((element) => {
          let li = document.createElement('li')
          li.innerHTML =
            element.temp.value +
            ' &deg;' +
            element.temp.unit.charAt(0) +
            ' ' +
            '<span>' +
            element.duration +
            ' Mins</span>'
          mash.appendChild(li)
        })

        let mash_heading = document.createElement('h4')
        mash_heading.innerHTML = 'Mash temp'
        mash.prepend(mash_heading)

        let fermentation = document.createElement('ul')
        method_wrapper.appendChild(fermentation)
        let ferm_info = document.createElement('li')
        ferm_info.innerHTML =
          value.method.fermentation.temp.value +
          ' &deg;' +
          value.method.fermentation.temp.unit.charAt(0)
        fermentation.appendChild(ferm_info)

        let fermentation_heading = document.createElement('h4')
        fermentation_heading.innerHTML = 'Fermentation'
        fermentation.prepend(fermentation_heading)

        let twist = document.createElement('p')
        method_wrapper.appendChild(twist)

        if (value.method.twist != null) {
          twist.innerHTML = 'Twist: ' + value.method.twist
        }

        let tip_wrapper = document.createElement('section')
        tip_wrapper.setAttribute('class', 'recipe-tip')
        recipe.appendChild(tip_wrapper)

        let tip_title = document.createElement('h3')
        tip_title.innerHTML = 'Brewers Tip'
        tip_wrapper.appendChild(tip_title)

        let tip_icon = document.createElement('div')
        tip_icon.setAttribute('class', 'recipe-icon')
        tip_wrapper.appendChild(tip_icon)
        tip_icon.style.backgroundImage =
          'url(/assets/images/icons/lightbulb.svg)'

        let tip = document.createElement('p')
        tip.innerHTML = value.brewers_tips
        tip_wrapper.appendChild(tip)

        let notes = document.createElement('div')
        notes.setAttribute('class', 'recipe-notes')
        notes.innerHTML = '<span class="underlined"> Brew date:</span>'
        recipe.appendChild(notes)

        // Add eventlistener.
        card_wrapper.addEventListener('click', () => {
          let recipe_id = card_wrapper.getAttribute('beer-id')
          html2pdfCreation(title.innerHTML, '#recipe-' + recipe_id)
        })
      }
    })
}

function ingredients(type, wrapper) {
  // If no type something went wrong. Abort!
  if (type === null) {
    return
  }

  type.forEach((element) => {
    const items = Object.entries(element)
    let li = document.createElement('li')
    let span
    for (const [key, value] of items) {
      span = document.createElement('span')

      if (typeof value == 'object') {
        span.innerHTML += ' ' + value.value + ' ' + value.unit
      } else {
        if (key === 'add' || key === 'attribute') {
          span.innerHTML = key + ': ' + value
        } else {
          span.innerHTML = value
        }
      }
      wrapper.appendChild(li)
      li.appendChild(span)
    }
  })
}

/**
 * HTML2PDF library for generating pdf.
 * @param {string} title
 * @param {string} target
 */
function html2pdfCreation(title, target) {
  // Choose the element that our recipe is rendered in.
  const element = document.querySelector(target)
  title = title.replace('.', '-')

  const opt = {
    margin: 0.75,
    pagebreak: {
      mode: ['css', 'legacy'],
    },
    filename: title + '.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 1 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  }

  // Choose the element and save the PDF for our user.
  html2pdf().set(opt).from(element).save()
}

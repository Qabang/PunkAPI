let baseUrl = 'https://api.punkapi.com/v2/beers?'
window.onload = () => {
  localStorage.setItem('beer-page', 1)
  console.log('laddat')

  getAllBeers('page=' + localStorage.getItem('beer-page'))

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
}

function getAllBeers(page) {
  console.log(page)

  fetch(baseUrl + page + '&per_page=80 ', {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result)

      const entries = Object.entries(result)
      for (const [key, value] of entries) {
        console.log(value)

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
        abv_basics.innerHTML = 'ABV: <span>' + value.abv + '</span>'
        basics_wrapper.appendChild(abv_basics)

        let target_fg = document.createElement('li')
        target_fg.innerHTML = 'Target FG: <span>' + value.target_fg + '</span>'
        basics_wrapper.appendChild(target_fg)

        let target_og = document.createElement('li')
        target_og.innerHTML = 'Target OG: <span>' + value.target_og + '</span>'
        basics_wrapper.appendChild(target_og)

        let ebc = document.createElement('li')
        ebc.innerHTML = 'EBC: <span>' + value.ebc + '</span>'
        basics_wrapper.appendChild(ebc)

        let srm = document.createElement('li')
        srm.innerHTML = 'SRM: <span>' + value.srm + '</span>'
        basics_wrapper.appendChild(srm)

        let ph = document.createElement('li')
        ph.innerHTML = 'PH: <span>' + value.ph + '</span>'
        basics_wrapper.appendChild(ph)

        let attenuation_level = document.createElement('li')
        attenuation_level.innerHTML =
          'attenuation level: <span>' + value.attenuation_level + '</span>'
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

        let fermentation = document.createElement('ul')
        method_wrapper.appendChild(fermentation)
        let ferm_info = document.createElement('li')
        ferm_info.innerHTML =
          value.method.fermentation.temp.value +
          ' ' +
          value.method.fermentation.temp.unit
        fermentation.appendChild(ferm_info)

        let fermentation_heading = document.createElement('h4')
        fermentation_heading.innerHTML = 'Fermentation'
        fermentation.prepend(fermentation_heading)

        let mash = document.createElement('ul')
        method_wrapper.appendChild(mash)
        value.method.mash_temp.forEach((element) => {
          let li = document.createElement('li')
          li.innerHTML =
            element.temp.value +
            ' ' +
            element.temp.unit +
            ' ' +
            '<span>' +
            element.duration +
            ' Mins</span>'
          mash.appendChild(li)
        })

        let mash_heading = document.createElement('h4')
        mash_heading.innerHTML = 'Mash temp'
        mash.prepend(mash_heading)

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

        // Add eventlistener
        card_wrapper.addEventListener('click', () => {
          let recipe_id = card_wrapper.getAttribute('beer-id')
          generatePDF(title.innerHTML, '#recipe-' + recipe_id)
        })
      }
    })
}

function ingredients(type, wrapper) {
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

function saveFavorite() {}

/**
 * Display your favorites (maybe print to document pdf)
 */
function manageFavorites() {}

function generatePDF(title, target) {
  // Choose the element that our recipe is rendered in.
  const element = document.querySelector(target)

  // Choose the element and save the PDF for our user.
  html2pdf()
    .from(element)
    .save('Recipe for ' + title)
}
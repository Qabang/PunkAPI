let url = 'https://avancera.app/cities/'

document
  .querySelector('#add-city-form')
  .addEventListener('submit', (e) => createCities(e))

window.onload = () => {
  getCities()
}

/**
 * Get all the cities
 */
function getCities() {
  let cities_wrapper = document.querySelector('#cities-wrapper')

  // If there are cities in the wrapper remove them!
  if (cities_wrapper.children.length > 0) {
    cities_wrapper.textContent = ''

    for (let i = 0; i < cities_wrapper.children.length; i++) {
      cities_wrapper.removeChild(cities_wrapper.lastElementChild)
    }
  }

  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      result.forEach((element) => {
        let div = document.createElement('div')
        div.setAttribute('id', 'city-' + element.id)
        cities_wrapper.appendChild(div)

        let h2 = document.createElement('h2')
        h2.innerText = element.name
        h2.setAttribute('class', 'name')
        div.appendChild(h2)

        let id = document.createElement('span')
        id.setAttribute('class', 'id')
        id.innerHTML = element.id
        div.appendChild(id)

        let p_population = document.createElement('p')
        p_population.innerHTML =
          'Population: <span class="population">' +
          element.population +
          '</span>'
        div.appendChild(p_population)

        let change_btn = document.createElement('button')
        change_btn.setAttribute('class', 'change')
        change_btn.innerText = 'Ändra'
        change_btn.addEventListener('click', (e) => changeCities(element.id))
        div.appendChild(change_btn)

        let delete_btn = document.createElement('button')
        delete_btn.setAttribute('class', 'delete')
        delete_btn.innerText = 'Tabort'
        delete_btn.addEventListener('click', (e) =>
          deleteCities(element.id, element.name)
        )
        div.appendChild(delete_btn)
      })
    })
}

/**
 * Create new cities.
 * @param {event} e
 */
function createCities(e) {
  e.preventDefault()
  let inputs = document.querySelector('#add-city-form').elements
  let errors = false

  // Clear old messages.
  document.querySelector('#msg').innerHTML = ''

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i]

    // If empty we inform the user of the error
    if (input.value === '') {
      document.querySelector(
        '#msg'
      ).innerHTML += `<p>Fältet <span>${input.name}</span> får inte vara tomt</p>`

      errors = true

      input.classList.add('error')
    } else {
      input.classList.remove('error')
    }
  }

  // If errors exist we bail.
  if (errors) {
    return
  }

  // Generate unique-ish id.
  let id = Date.now() + Math.floor(Math.random() * Math.floor(100))

  let city = {
    id: id.toString(),
    name: inputs[0].value,
    population: inputs[1].value,
  }

  city = JSON.stringify(city)

  fetch(url, {
    body: city,
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
    .then((response) => response.json())
    .then((result) => {
      document.querySelector('#msg').innerHTML = 'Staden har blivit tillagd!'
      setTimeout(function () {
        document.querySelector('#msg').innerHTML = ''
      }, 2500)

      // Clear form values
      inputs[1].value = ''
      inputs[0].value = ''

      // Generate the cities.
      getCities()
    })
}

/**
 * Change existing city based on id.
 * @param {string} city_id
 */
function changeCities(city_id) {
  let wrapper = document.querySelector('#city-' + city_id)
  let name = wrapper.querySelector('.name').innerHTML
  let population = wrapper.querySelector('.population').innerHTML

  let wrapper_content = wrapper.children

  // First we clear text content
  wrapper.textContent = ''

  // Then we remove the html elements and get a clean slate.
  for (let i = 0; i < wrapper_content.length; i++) {
    wrapper.removeChild(wrapper.lastElementChild)
  }

  wrapper.setAttribute('class', 'in-change')

  // And then we create new content!
  let h2 = document.createElement('h2')
  h2.innerText = 'Ändra: ' + name
  wrapper.appendChild(h2)

  let label_name = document.createElement('label')
  label_name.setAttribute('for', 'change-name')
  label_name.innerText = 'Namn'
  wrapper.appendChild(label_name)

  let input_name = document.createElement('input')
  input_name.setAttribute('id', 'change-name')
  input_name.setAttribute('type', 'text')
  input_name.value = name
  wrapper.appendChild(input_name)

  let label_population = document.createElement('label')
  label_population.setAttribute('for', 'change-population')
  label_population.innerText = 'Population'
  wrapper.appendChild(label_population)

  let input_population = document.createElement('input')
  input_population.setAttribute('id', 'change-population')
  input_population.setAttribute('type', 'text')
  input_population.value = population
  wrapper.appendChild(input_population)

  let submit = document.createElement('button')
  submit.innerHTML = 'Spara'
  submit.setAttribute('class', 'save')
  wrapper.appendChild(submit)

  submit.addEventListener('click', () => {
    let body = {
      name: input_name.value,
      population: input_population.value,
    }

    fetch(url + city_id, {
      body: JSON.stringify(body),
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        alert('Staden ' + name + 'Har blivit uppdaterad!')
        wrapper.removeAttribute('class', 'in-change')
        // Load the list again.
        getCities()
      })
  })
}

/**
 * Delete the city based on id.
 * @param {string} city_id
 * @param {string} name
 */
function deleteCities(city_id, name) {
  let sure = confirm('Är du säker på att du vill tabort ' + name)

  // If no user confirmation then we abort!
  if (!sure) {
    return
  }

  fetch(url + city_id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    alert(name + ' Har blivit raderad')
    getCities()
  })
}

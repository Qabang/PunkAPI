window.onload = () => {
  storeData()
}

/**
 * Get Beer data from API.
 * @param {string} page
 * @param {object} data
 */
async function getBeers(page, data = []) {
  return fetch(
    'https://api.punkapi.com/v2/beers?page=' + page + '&per_page=80',
    {
      method: 'GET',
    }
  )
    .then((response) => response.json())
    .then((result) => {
      data.push(result)
      return { amount: result.length, data: data }
    })
}

/**
 * function that handles and stores the data in session storage.
 */
async function storeData() {
  // Only get new data if new session
  if (!sessionStorage.getItem('beer-data')) {
    let data = []
    let i = 1

    // We get the data based on 80 results per page,
    // and if there is less than 80 we have reached the last page of data.
    do {
      data = await getBeers(i++, data.data)
    } while (data.amount === 80)

    sessionStorage.setItem('beer-data', JSON.stringify(data.data))
  }

  let beers = JSON.parse(sessionStorage.getItem('beer-data'))

  let abv = []
  let abv_labels = []

  beers.forEach((element) => {
    let entries = Object.entries(element)
    for (const [key, value] of entries) {
      abv.push(value.abv.toFixed(1))
    }
  })

  // Filter out unique values.
  abv_labels = abv.filter(onlyUnique)

  // Sort result in numerical ascending order.
  abv_labels = abv_labels.sort((a, b) => a - b)
  abv = abv.sort((a, b) => a - b)
  let result = []

  // Count how many times a value in an array occurs.
  let count = (input, arr) => arr.filter((x) => x === input).length
  abv_labels.forEach((element) => {
    result.push(count(element, abv))
  })

  // Display data by chart JS library.
  chartData(abv_labels, result)
}

/**
 * Function that uses chartjs library to fill diagram with data
 */
function chartData(labels, data) {
  let element = document.getElementById('myChart')

  var ctx = element.getContext('2d')

  ctx.canvas.height = labels.length * 21

  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'horizontalBar',

    // The data for our dataset
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Brewdog Beers',
          backgroundColor: 'rgb(252, 191, 73)',
          borderColor: '#eae2b7',
          borderWidth: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 5,
          },
          data: data,
          barThickness: 20,
          padding: 20,
          defaultFontSize: 20,
        },
      ],
    },

    // Configuration options go here
    options: {
      maintainAspectRatio: false,
      responsive: true,
      scaleShowValues: true,
      scales: {
        xAxes: [
          {
            ticks: {
              autoSkip: false,
              stepSize: 2,
              fontSize: 16,
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Amount',
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              fontSize: 16,
              callback: function (value, index, values) {
                return value + '%'
              },
            },
            barThickness: 16,
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Strength',
            },
          },
        ],
      },
    },
  })
}

/**
 * Returns only the unique values of an array.
 */
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

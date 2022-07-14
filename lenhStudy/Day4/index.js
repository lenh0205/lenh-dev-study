const input = document.querySelector('.search')
const city = document.querySelector('.location')
const time = document.querySelector('.time')
const temp = document.querySelector('.temp span')
const state = document.querySelector('.state')
const vision = document.querySelector('.info .vision span')
const wind = document.querySelector('.info .wind span')
const sun = document.querySelector('.info .sun span')

input.addEventListener('keydown', (e) => {
    if (e.keyCode == 13) {
        getWeather(e.target.value)
    }
})

async function getWeather (input = 'tokyo') {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&appid=d78fd1588e1b7c0c2813576ba183a667`
    const response = await fetch(url)
    const data = await response.json()
    console.log(data)

    city.textContent = data.name
    time.textContent = new Date().toLocaleString()
    temp.textContent = Math.floor(data.main.temp)
    state.textContent = data.weather[0].main
    vision.textContent = data.visibility + 'm'
    wind.textContent = data.wind.speed + '(m/s)'
    sun.textContent = data.cod + '%'

    if (Math.floor(data.main.temp) >= 18) {
        document.body.classList.remove('cold')
        document.body.classList.add('hot')
    } else {
        document.body.classList.remove('hot')
        document.body.classList.add('cold')
    }
}
getWeather()



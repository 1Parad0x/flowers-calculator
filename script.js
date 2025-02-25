function copyPrices() {
	const pinkElement = document.querySelector('.pink')
	const blueElement = document.querySelector('.blue')
	const redElement = document.querySelector('.red')

	const pinkMatch = pinkElement.textContent.match(/:\s*(\d+)\s*\(/)
	const blueMatch = blueElement.textContent.match(/:\s*(\d+)\s*\(/)
	const redMatch = redElement.textContent.match(/:\s*(\d+)\s*\(/)

	const pinkPrice = parseInt(pinkMatch ? pinkMatch[1] : 1000) || 1000
	const bluePrice = parseInt(blueMatch ? blueMatch[1] : 1000) || 1000
	const redPrice = parseInt(redMatch ? redMatch[1] : 1000) || 1000
	const currentDate = '25.02.2025'
	const text = `Актуальные цены за цветы на ${currentDate}:\nРозовые - ${pinkPrice} р. за 1 штуку\nСиние - ${bluePrice} р. за 1 штуку\nКрасные - ${redPrice} р. за 1 штуку`
	navigator.clipboard
		.writeText(text)
		.then(() => {
			alert('Цены скопированы в буфер обмена!')
		})
		.catch(err => {
			console.error('Ошибка копирования: ', err)
		})
}

function calculatePrice() {
	document.getElementById('result').style.display = 'block'
	document.getElementById('history').style.display = 'block'
	document.getElementById('resetBtn').style.display = 'block'

	let pink = parseInt(document.getElementById('pink').value) || 0
	let blue = parseInt(document.getElementById('blue').value) || 0
	let red = parseInt(document.getElementById('red').value) || 0

	let totalFlowers = pink + blue + red
	const minPrice = 1050
	const maxPrice = 1400
	const priceRange = maxPrice - minPrice

	if (totalFlowers === 0) {
		document.getElementById('result').innerHTML = `
            <p class="pink">Розовые: ${maxPrice} (100% от максимума)</p>
            <p class="blue">Синие: ${maxPrice} (100% от максимума)</p>
            <p class="red">Красные: ${maxPrice} (100% от максимума)</p>
        `
		updateIncome(maxPrice, maxPrice, maxPrice)
		saveHistory(pink, blue, red, 0)
		return
	}

	let maxCount = Math.max(pink, blue, red)

	function getPrice(count) {
		if (count === 0) return maxPrice
		let price = maxPrice - priceRange * (count / maxCount)
		return Math.round(Math.max(minPrice, price))
	}

	let pinkPrice = getPrice(pink)
	let bluePrice = getPrice(blue)
	let redPrice = getPrice(red)

	let pinkPercent = ((pinkPrice - minPrice) / priceRange) * 100
	let bluePercent = ((bluePrice - minPrice) / priceRange) * 100
	let redPercent = ((redPrice - minPrice) / priceRange) * 100

	document.getElementById('result').innerHTML = `
        <p class="pink">Розовые (${pink} шт): ${pinkPrice} (${pinkPercent.toFixed(
		2
	)}% от максимума)</p>
        <p class="blue">Синие (${blue} шт): ${bluePrice} (${bluePercent.toFixed(
		2
	)}% от максимума)</p>
        <p class="red">Красные (${red} шт): ${redPrice} (${redPercent.toFixed(
		2
	)}% от максимума)</p>
        <button onclick="copyPrices()">Копировать</button>
    `
	updateIncome(pinkPrice, bluePrice, redPrice)
	saveHistory(pink, blue, red, 0)
}

function resetForm() {
	document.getElementById('pink').value = 0
	document.getElementById('blue').value = 0
	document.getElementById('red').value = 0
	document.getElementById('result').style.display = 'none'
	document.getElementById('result').innerHTML = ''
	document.getElementById('history').style.display = 'none'
	document.getElementById('history').innerHTML = ''
	document.getElementById('resetBtn').style.display = 'none'
	updateIncome(1000, 1000, 1000)
}

function saveHistory(pink, blue, red, totalPrice) {
	const historyDiv = document.getElementById('history')
	const entry = document.createElement('p')
	entry.textContent = `Розовые: ${pink}, Синие: ${blue}, Красные: ${red}`
	historyDiv.insertBefore(entry, historyDiv.firstChild)
	if (historyDiv.children.length > 5) {
		historyDiv.removeChild(historyDiv.lastChild)
	}
	localStorage.setItem('flowerHistory', historyDiv.innerHTML)
}

function updateIncome(pinkPrice, bluePrice, redPrice) {
	const pinkIncome = pinkPrice * 800
	const blueIncome = bluePrice * 800
	const redIncome = redPrice * 800
	const costs = pinkIncome + blueIncome + redIncome
	const initialIncome = 3500000
	const profit = initialIncome - costs

	document.getElementById('pinkIncome').textContent =
		pinkIncome.toLocaleString()
	document.getElementById('blueIncome').textContent =
		blueIncome.toLocaleString()
	document.getElementById('redIncome').textContent = redIncome.toLocaleString()
	document.getElementById('costs').textContent = costs.toLocaleString()
	document.getElementById('profit').textContent = profit.toLocaleString()
}

const canvas = document.getElementById('starCanvas')
const ctx = canvas.getContext('2d')

function resizeCanvas() {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
}
resizeCanvas()
window.addEventListener('resize', resizeCanvas)

let mouse = { x: 0, y: 0 }
document.addEventListener('mousemove', e => {
	mouse.x = e.clientX
	mouse.y = e.clientY
})

const stars = []
const starCount = 200

class Star {
	constructor() {
		this.x = Math.random() * canvas.width
		this.y = Math.random() * canvas.height
		this.baseX = this.x
		this.baseY = this.y
		this.size = Math.random() * 2 + 1
		this.brightness = Math.random() * 0.5 + 0.5
	}

	update() {
		let dx = mouse.x - this.x
		let dy = mouse.y - this.y
		let distance = Math.sqrt(dx * dx + dy * dy)
		let maxDistance = 100
		let force =
			distance < maxDistance ? (maxDistance - distance) / maxDistance : 0

		if (distance < maxDistance) {
			this.x -= (dx / distance) * force * 2
			this.y -= (dy / distance) * force * 2
		} else {
			this.x += (this.baseX - this.x) * 0.05
			this.y += (this.baseY - this.y) * 0.05
			this.x += (Math.random() - 0.5) * 0.1
			this.y += (Math.random() - 0.5) * 0.1
		}

		this.brightness = Math.max(
			0.5,
			this.brightness + (Math.random() - 0.5) * 0.02
		)
	}

	draw() {
		ctx.fillStyle = `rgba(255, 255, 255, ${this.brightness})`
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
		ctx.fill()
	}

	connect(otherStar) {
		let dx = this.x - otherStar.x
		let dy = this.y - otherStar.y
		let distance = Math.sqrt(dx * dx + dy * dy)

		if (distance < 50) {
			ctx.beginPath()
			ctx.strokeStyle = `rgba(200, 160, 255, ${1 - distance / 50})`
			ctx.lineWidth = 0.5
			ctx.moveTo(this.x, this.y)
			ctx.lineTo(otherStar.x, otherStar.y)
			ctx.stroke()
		}
	}
}

for (let i = 0; i < starCount; i++) {
	stars.push(new Star())
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	for (let i = 0; i < stars.length; i++) {
		stars[i].update()
		stars[i].draw()

		for (let j = i + 1; j < stars.length; j++) {
			stars[i].connect(stars[j])
		}
	}

	requestAnimationFrame(animate)
}
animate()

document.addEventListener('DOMContentLoaded', () => {
	const history = localStorage.getItem('flowerHistory')
	if (history) {
		document.getElementById('history').innerHTML = history
	}
	updateIncome(1000, 1000, 1000)
	setTimeout(() => {
		document.querySelector('.splash-screen').style.display = 'none'
	}, 1500)
})

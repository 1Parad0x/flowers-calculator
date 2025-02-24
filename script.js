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
            <p class="total">Общая базовая цена: ${maxPrice}</p>
        `
		saveHistory(pink, blue, red, maxPrice)
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

	let totalPrice =
		(pinkPrice * pink + bluePrice * blue + redPrice * red) / totalFlowers
	totalPrice = Math.round(totalPrice)

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
        <p class="total">Общая базовая цена: ${totalPrice}</p>
    `
	saveHistory(pink, blue, red, totalPrice)
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
}

function saveHistory(pink, blue, red, totalPrice) {
	const historyDiv = document.getElementById('history')
	const entry = document.createElement('p')
	entry.textContent = `Розовые: ${pink}, Синие: ${blue}, Красные: ${red} — Общая цена: ${totalPrice}`
	historyDiv.insertBefore(entry, historyDiv.firstChild)
	if (historyDiv.children.length > 5) {
		historyDiv.removeChild(historyDiv.lastChild)
	}
	localStorage.setItem('flowerHistory', historyDiv.innerHTML)
}

const canvas = document.getElementById('webCanvas')
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

const particles = []
const particleCount = 50

class Particle {
	constructor() {
		this.x = Math.random() * canvas.width
		this.y = Math.random() * canvas.height
		this.baseX = this.x
		this.baseY = this.y
		this.size = Math.random() * 3 + 1
		this.color = `hsl(${Math.random() * 270}, 70%, 50%)`
	}

	update() {
		let dx = mouse.x - this.x
		let dy = mouse.y - this.y
		let distance = Math.sqrt(dx * dx + dy * dy)
		let maxDistance = 150
		let force =
			distance < maxDistance ? (maxDistance - distance) / maxDistance : 0

		if (distance < maxDistance) {
			this.x -= (dx / distance) * force * 2
			this.y -= (dy / distance) * force * 2
		} else {
			this.x += (this.baseX - this.x) * 0.05
			this.y += (this.baseY - this.y) * 0.05
		}
	}

	draw() {
		ctx.fillStyle = this.color
		ctx.beginPath()
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
		ctx.fill()
	}
}

for (let i = 0; i < particleCount; i++) {
	particles.push(new Particle())
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	for (let i = 0; i < particles.length; i++) {
		particles[i].update()
		particles[i].draw()

		for (let j = i + 1; j < particles.length; j++) {
			let dx = particles[i].x - particles[j].x
			let dy = particles[i].y - particles[j].y
			let distance = Math.sqrt(dx * dx + dy * dy)

			if (distance < 100) {
				ctx.beginPath()
				ctx.strokeStyle = `rgba(200, 160, 255, ${1 - distance / 100})`
				ctx.lineWidth = 1
				ctx.moveTo(particles[i].x, particles[i].y)
				ctx.lineTo(particles[j].x, particles[j].y)
				ctx.stroke()
			}
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
	setTimeout(() => {
		document.querySelector('.splash-screen').style.display = 'none'
	}, 1500)
})

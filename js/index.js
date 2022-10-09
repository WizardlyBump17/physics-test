const CANVAS = 'main'
const OBJECTS = []
const PIXEL_SIZE = 5
const CENTER = {
    x: 250,
    y: 100
}

window.onload = init

function init() {
    initCanvas()

    setInterval(tick, 10)
}

function initCanvas() {
    const canvas = document.getElementById(CANVAS)
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    initObjects()

    canvas.addEventListener('click', event => {
        const x = event.clientX / PIXEL_SIZE - CENTER.x
        const y = event.clientY / PIXEL_SIZE - CENTER.y
        createCirlce(1, new Vector(x, y), new Vector(0.1, 0), 5)
    })
}

function initObjects() {
    for (let i = 0; i < 10; i++) {
        OBJECTS.push(
            new Circle(
                1,
                new Vector(random(-canvas().width / PIXEL_SIZE / 2, canvas().width / PIXEL_SIZE / 2), random(-canvas().height / PIXEL_SIZE / 2, canvas().height / PIXEL_SIZE / 2)),
                new Vector(0.1, 0),
                5
            )
        )
    }
    OBJECTS.push(new Circle(5000000000, new Vector(0, 0), new Vector(0, 0), 50))
}

function createCirlce(mass, location, velocity, radius) {
    const circle = new Circle(mass, location, velocity, radius)
    console.log(`CREATED CIRCLE ${circle}`)
    OBJECTS.push(circle)
}

function canvas() {
    return document.getElementById(CANVAS)
}

function context() {
    return canvas().getContext('2d')
}

function tick() {
    clearCanvas()
    updateCanvas()

    for (let i in OBJECTS) {
        const object = OBJECTS[i]
        object.tick()
        object.render('red')
    }
}

function updateCanvas() {
    canvas().width = window.innerWidth
    canvas().height = window.innerHeight
}

function drawCircle(location, radius, color) {
    location = fixLocation(location)

    const ctx = context()
    ctx.beginPath()
    ctx.arc(location.x * PIXEL_SIZE, location.y * PIXEL_SIZE, radius * PIXEL_SIZE, 0, 2 * Math.PI)
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
}

function clearCanvas() {
    const ctx = context()
    ctx.clearRect(0, 0, canvas().width, canvas().height)
}

function random(min, max) {
    return Math.random() * (max - min) + min
}

function writeText(location, text) {
    location = fixLocation(location)

    const ctx = context()
    ctx.font = '20px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText(text, location.x * PIXEL_SIZE, location.y * PIXEL_SIZE)
}

function fixLocation(location) {
    return location.addExact(CENTER.x, CENTER.y)
}
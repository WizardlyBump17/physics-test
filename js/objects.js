class Object {

    constructor(mass, location, velocity) {
        this.mass = mass
        this.location = location
        this.acceleration = Vector.ZERO
        this.velocity = velocity
    }

    tick() {
        this.velocity = this.velocity.add(this.acceleration)
        this.teleport(this.location.add(this.velocity))

        for (let i in OBJECTS) {
            const other = OBJECTS[i]
            if (other == this)
                continue

            if (Physics.ENABLED) {
                const gravitacionalForce = Physics.getFoce(this, other)

                const cos = (other.location.x - this.location.x) / this.location.distance(other.location)
                const sin = (other.location.y - this.location.y) / this.location.distance(other.location)
                
                const force = new Vector(gravitacionalForce * cos, gravitacionalForce * sin)
                this.acceleration = force.divide(this.mass)
            }

            if (this.collides(other)) 
                this.onCollision(other)
        }
    }

    render(color) {
    }

    teleport(location) {
        this.location = location
    }

    collides(other) {
        return false
    }

    onCollision(other) {
    }
}

class Circle extends Object {
    constructor(mass, location, velocity, radius) {
        super(mass, location, velocity)
        this.radius = radius
    }

    render(color) {
        drawCircle(this.location, this.radius, color)

        /*writeText(this.location.subtractExact(this.radius / 2, this.radius / 2 + 1 * PIXEL_SIZE), `Mass: ${this.mass}`)
        writeText(this.location.subtractExact(this.radius / 2, this.radius / 2), `Location: ${this.location.x.toFixed(2)} ${this.location.y.toFixed(2)}`)
        writeText(this.location.subtractExact(this.radius / 2, this.radius / 2 - 1 * PIXEL_SIZE), `Velocity: ${this.velocity.x.toFixed(2)} ${this.velocity.y.toFixed(2)}`)
        writeText(this.location.subtractExact(this.radius / 2, this.radius / 2 - 2 * PIXEL_SIZE), `Acceleration: ${this.acceleration.x.toFixed(5)} ${this.acceleration.y.toFixed(5)}`)*/
    }

    collides(other) {
        if (other instanceof Circle) 
            return this.location.distance(other.location) < (this.radius + other.radius)

        return false
    }

    onCollision(other) {
        const angle = other.location.angle(this.location)
        const distance = this.location.distance(other.location)
        const distanceToMove = (this.radius + other.radius) - distance
        this.teleport(this.location.addExact(
            distanceToMove * Math.cos(angle), 
            distanceToMove * Math.sin(angle)
        ))
        this.velocity = Vector.ZERO
        this.acceleration = Vector.ZERO
    }
}

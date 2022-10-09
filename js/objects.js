class Object {

    constructor(mass, location, velocity) {
        this.mass = mass
        this.location = location
        this.acceleration = Vector.ZERO
        this.velocity = velocity
    }

    tick() {
        const heaviest = Object.getHeaviest()
        if (this != heaviest && Physics.ENABLED) {
            const gravitacionalForce = Physics.getFoce(this, heaviest)

            const cos = (heaviest.location.x - this.location.x) / this.location.distance(heaviest.location)
            const sin = (heaviest.location.y - this.location.y) / this.location.distance(heaviest.location)
            
            const force = new Vector(gravitacionalForce * cos, gravitacionalForce * sin)
            this.acceleration = force.divide(this.mass)
        }

        this.velocity = this.velocity.add(this.acceleration)
        this.teleport(this.location.add(this.velocity))

        for (let i in OBJECTS) {
            const other = OBJECTS[i]
            if (other == this)
                continue

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

    onCheckCollision() {
    }

    static getHeaviest() {
        let heaviest = OBJECTS[0]
        for (let i in OBJECTS) {
            const object = OBJECTS[i]
            if (object.mass > heaviest.mass)
                heaviest = object
        }
        return heaviest
    }
}

class Circle extends Object {

    constructor(mass, location, velocity, radius) {
        super(mass, location, velocity)
        this.radius = radius
    }

    render(color) {
        drawCircle(this.location, this.radius, color)

        if (this == Object.getHeaviest()) {
            writeText(this.location.subtractExact(this.radius / 2, this.radius / 2 + 1 * PIXEL_SIZE), `Mass: ${this.mass}`)
            writeText(this.location.subtractExact(this.radius / 2, this.radius / 2 - 0 * PIXEL_SIZE), `Location: ${this.location.x.toFixed(2)} ${this.location.y.toFixed(2)}`)
            writeText(this.location.subtractExact(this.radius / 2, this.radius / 2 - 1 * PIXEL_SIZE), `Velocity: ${this.velocity.x.toFixed(2)} ${this.velocity.y.toFixed(2)}`)
            writeText(this.location.subtractExact(this.radius / 2, this.radius / 2 - 2 * PIXEL_SIZE), `Acceleration: ${this.acceleration.x.toFixed(5)} ${this.acceleration.y.toFixed(5)}`)
        }
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
        
        if (Physics.ENABLED) 
            this.velocity = this.velocity.multiply(Physics.RESTITUTION)

        if (Physics.ZERO_ON_COLLISION)
            this.zeroCollision(other)
        else
            this.fancyCollision(other)
    }

    zeroCollision(other) {
        this.velocity = Vector.ZERO
        this.acceleration = Vector.ZERO
    }

    // https://github.com/JVictorDias/CanhaoDeNewton/blob/main/src/main.cpp#L148
    fancyCollision(other) {
        const m1 = this.mass
        const m2 = other.mass

        const u1x = this.velocity.x;
        const u1y = this.velocity.y;
        const u2x = other.velocity.x;
        const u2y = other.velocity.y;
                                            
        const x1 = this.location.x;
        const y1 = this.location.y;
        const x2 = other.location.x;
        const y2 = other.location.y;

        const u1 = Math.sqrt(u1x * u1x + u1y * u1y);
        const u2 = Math.sqrt(u2x * u2x + u2y * u2y);

        const a1 = Math.atan2(y2 - y1, x2 - x1);
        const b1 = Math.atan2(u1y, u1x);
        const c1 = b1 - a1;

        const a2 = Math.atan2(y1 - y2, x1 - x2);
        const b2 = Math.atan2(u2y, u2x);
        const c2 = b2 - a2;

        const u12 = u1 * Math.cos(c1);
        const u11 = u1 * Math.sin(c1);

        const u21 = u2 * Math.cos(c2);
        const u22 = u2 * Math.sin(c2);

        const v12 = (((m1 - m2) * u12) - (2 * m2 * u21)) / (m1 + m2);
        const v21 = (((m1 - m2) * u21) + (2 * m1 * u12)) / (m1 + m2);

        const v1x = u11 * (-Math.sin(a1)) + v12 * (Math.cos(a1));
        const v1y = u11 * (Math.cos(a1)) + v12 * (Math.sin(a1));

        const v2x = u22 * (-Math.sin(a2)) - v21 * (Math.cos(a2));
        const v2y = u22 * (Math.cos(a2)) - v21 * (Math.sin(a2));

        this.velocity = new Vector(v1x, v1y)
        other.velocity = new Vector(v2x, v2y)
    }
}

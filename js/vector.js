class Vector {

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    add(other) {
        return new Vector(this.x + other.x, this.y + other.y)
    }

    addExact(otherX, otherY) {
        return new Vector(this.x + otherX, this.y + otherY)
    }

    subtract(other) {
        return new Vector(this.x - other.x, this.y - other.y)
    }

    subtractExact(otherX, otherY) {
        return new Vector(this.x - otherX, this.y - otherY)
    }

    midpoint(other) {
        return new Vector((this.x + other.x) / 2, (this.y + other.y) / 2)
    }

    square() {
        return new Vector(this.x * this.x, this.y * this.y)
    }

    sqrt() {
        return new Vector(Math.sqrt(this.x), Math.sqrt(this.y))
    }

    distance(other) {
        return Math.sqrt(this.distanceSquared(other))
    }

    distanceSquared(other) {
        return (this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y)
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    angle(other) {
        return Math.atan2(other.y - this.y, other.x - this.x)
    }

    divide(number) {
        return new Vector(this.x / number, this.y / number)
    }

    multiply(number) {
        return new Vector(this.x * number, this.y * number)
    }

    static ZERO = new Vector(0, 0)
}
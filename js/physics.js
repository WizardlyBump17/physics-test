class Physics {

    static GRAVITY_CONSTANT = 6.67408e-11
    static ENABLED = true

    static getFoce(object1, object2) {
        let distance = object1.location.distance(object2.location)
        if (distance < 1)
            distance = 1
        return Physics.GRAVITY_CONSTANT * (object1.mass * object2.mass / distance)
    }
}
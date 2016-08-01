// Asteroidenklasse
// Hier nichts direkt aufrufen, Aufrufe werden ueber Bot.js geregelt
// (Ausnahme: Collision soll collide aufrufen)
<<<<<<< HEAD
var minShipSize = 10;
var maxShipSize = 20;
var maxAsteroidSize = 30;
var asteroidHP = 10;
=======
var minShipSize     = 10;
var maxShipSize     = 20;
var maxAsteroidSize = 30;
var asteroidHP      = 10;
var smallityBorder  = 20;
>>>>>>> 20d5fc617341e55265a16e171def1a787f750b6f

var geometryA, textureA;

var despawnDistance = 700; // aus core.js (Backplane der Camera) (changed)

<<<<<<< HEAD
function Asteroid(location, radius, direction, speed, level, small) {
    //console.log("Asteroid init");
=======
function Asteroid(location,radius, direction, speed, level) {
    console.log("Asteroid init");
>>>>>>> 20d5fc617341e55265a16e171def1a787f750b6f
    // Mesh setzen
    if (small) {
        geometryA = fileLoader.get("AsteroidV2");
        textureA = fileLoader.get("AsteroidTex");
    } else {
        geometryA = fileLoader.get("AsteroidV2");
        textureA = fileLoader.get("AsteroidTex");
    }

    THREE.Mesh.call(this, geometryA,
        new THREE.MeshPhongMaterial({ map: textureA }));

    // setze Groesse
    this.scale.set(radius, radius, radius);

    this.direction = direction;
    this.direction.normalize();
<<<<<<< HEAD
    this.speed = speed;
    this.radius = radius;
=======
    this.speed      = speed;
    this.radius     = radius;
>>>>>>> 20d5fc617341e55265a16e171def1a787f750b6f

    this.position.x = location.x;
    this.position.y = location.y;
    this.position.z = location.z;

<<<<<<< HEAD
    this.level = level;
    this.isAlive = true;
    this.isSmall = small;
    this.HP = asteroidHP;

    // setze Rotation
    this.rotation.set(0.05 * Math.random(), 0.05 * Math.random(), 0.05 * Math.random(), 'XYZ');

    this.rotateSpeed = new THREE.Vector3(0.05 * Math.random(), 0.05 * Math.random(), 0.05 * Math.random());

    // setze Hitbox
    this.hitBox = this.createHitBox();
=======
    this.level      = level;
    this.isAlive    = true;
    this.isSmall 	= (radius <= 20) ? true : false;
    this.HP         = asteroidHP;

    // setze Rotation
    this.rotation.set(0.05 * Math.random(),
                            0.05 * Math.random(),0.05 * Math.random(), 'XYZ');

    this.rotateSpeed = new THREE.Vector3(0.05 * Math.random(),
                                    0.05 * Math.random(),0.05 * Math.random());

    // setze Hitbox
    this.hitBox = this.getHitBox();
>>>>>>> 20d5fc617341e55265a16e171def1a787f750b6f
}

Asteroid.prototype.constructor = Asteroid;
Asteroid.prototype = new THREE.Mesh;

Asteroid.prototype.move = function (delta) {
    this.direction.multiplyScalar(this.speed * delta);
    this.position.x += this.direction.x;
    this.position.y += this.direction.y;
    this.position.z += this.direction.z;
    this.direction.normalize();

    if (this.position.distanceTo(ship.position) > despawnDistance) {
        this.isAlive = false;
    }

    // console.log("Position asteroid: ("+this.position.x+","+this.position.y+","+this.position.z+")");


    this.rotation.x += this.rotateSpeed.x;
    this.rotation.y += this.rotateSpeed.y;
    this.rotation.z += this.rotateSpeed.z;
    // console.log("Rotation asteroid: ("+this.rotation.x+","+this.rotation.y+","+this.rotation.z+")");

<<<<<<< HEAD
    // HitBox setzen
    this.hitBox.position.set(this.position);
=======
   // HitBox setzen
   this.hitBox.position.set(this.position);
>>>>>>> 20d5fc617341e55265a16e171def1a787f750b6f

}

Asteroid.prototype.collide = function(other, type) {
<<<<<<< HEAD
    var changeScore = false;
    switch (type) {
        case "ASTEROID": case "asteroid": case "Asteroid":
            if (this.isSmall) {
                this.isAlive = false;
                if (other.isSmall) {
                    other.isAlive = false;
                }
            } else {
                if (other.isSmall) {
=======
    switch(type) {
        case "ASTEROID": case "asteroid": case "Asteroid":
            if(this.isSmall) {
                this.isAlive = false;
                if(other.isSmall) {
                    other.isAlive = false;
                }
            } else {
                if(other.isSmall) {
>>>>>>> 20d5fc617341e55265a16e171def1a787f750b6f
                    other.isAlive = false;
                } else {
                    this.reflect(other);
                }
            }
            break;
        case "SHIP": case "ship": case "Ship":
            // TODO
            break;
        case "PLAYER": case "player": case "Player":
            this.isAlive = false;
<<<<<<< HEAD
            changeScore = true;
            break;
        case "LASER": case "laser": case "Laser":
            this.HP -= laserDamage;
            changeScore = true;
            console.log("hit");
            break;
        case "ROCKET": case "rocket": case "Rocket":
            this.HP -= rocketDamage;
            changeScore = true;
            break;
        case "EXPLOSION": case "explosion": case "Explosion":
            changeScore = true;
            this.HP -= rocketDamage;

            break;
        case "MACHINEGUN": case "machinegun": case "Machinegun":
            changeScore = true;
            break;
        default: console.log("Error: Collision with unknown");
    }
    if (this.HP <= 0) {
        this.isAlive = false;
    }
=======
            break;
        case "LASER": case "laser": case "Laser":
            this.HP -= laserDamage;
            break;
        case "ROCKET": case "rocket": case "Rocket":
            this.HP -= rocketDamage;
            break;
        case "EXPLOSION": case "explosion": case "Explosion":

            break;
        case "MACHINEGUN": case "machinegun": case "Machinegun":
            this.isAlive = false;
            break;
        default: console.log("Error: Collision with unknown");
    }

    if(this.HP <= 0) {
        this.isAlive = false;
    }
>>>>>>> 20d5fc617341e55265a16e171def1a787f750b6f
}

Asteroid.prototype.reflect = function (other) {
    // Reflektiert Asteroiden this und other
    var factor;

    // "Normale" der Reflektion (zeigt von this nach other -> "Normale fuer this")
    var axis = MATH.clone(other.position);
    axis.sub(this.position);
    axis.normalize();

    var negAxis = MATH.negated(axis);

    // Reflektion fuer Asteroid a
    var axisA = MATH.clone(axis);
    factor = 2 * Math.dot(axisA, this.direction);
    this.direction.negate();
    this.direction.add(axis.multiplyScalar(factor));

    // Reflektion fuer Asteroid b
    var axisB = MATH.clone(negAxis);
    factor = 2 * Math.dot(axisB, other.direction);
    other.direction.negate();
    other.direction.add(negAxis.multiplyScalar(factor));
}

<<<<<<< HEAD
Asteroid.prototype.createHitBox = function() {
    
    var mesh, geometry, material;

    // TODO: Kontrolliere: 4 initialer Radius
    geometry = new THREE.SphereGeometry(4 * this.radius, 32, 32);

    material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.5,
        color: 0xffffff
=======
Asteroid.prototype.getHitBox = function() {
    var mesh, geometry, material;

    // TODO: Kontrolliere: 4 initialer Radius
    geometry = new THREE.SphereGeometry(this.radius,32,32);

    material = new THREE.MeshBasicMaterial({
        transparent : true,
        opacity     : 0.5,
        color       : 0xffffff
>>>>>>> 20d5fc617341e55265a16e171def1a787f750b6f
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(this.position);

    return mesh;
}

<<<<<<< HEAD
Asteroid.prototype.getHitBox = function () {
    return this.hitBox;
}

Asteroid.prototype.getObstacleHitBox = function () {
    var mesh, geometry, material;

    geometry = new THREE.SphereGeometry(4 * 1.2 * this.radius, 32, 32);

    material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.5,
        color: 0xffffff
=======
Asteroid.prototype.getObstacleHitBox = function() {
    var mesh, geometry, material;

    geometry = new THREE.SphereGeometry(1.2 * this.radius,32,32);

    material = new THREE.MeshBasicMaterial({
        transparent : true,
        opacity     : 0.0,
        color       : 0xffffff
>>>>>>> 20d5fc617341e55265a16e171def1a787f750b6f
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(this.position);

    return mesh;
}

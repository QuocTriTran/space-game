
// Botklasse

// Fuer Kollision:
// asteroids und enemies sind nach Abstand zum Spieler sortiert
// -> break-Chance

// Hier aufzurufen:
// - init()
// - update(delta)
var asteroids = [], enemies = [], enemy, asteroid, asteroidHitBoxes = [],
    worldRadius, gameLevel, numOfAsteroids = 50;

function Bot() {

    var minShipSize = 10;
    var maxShipSize = 20;
    var maxAsteroidSize = 30;
    var guardingRadius = 50;

    var SHOT = 1;
    var ASTEROID = 2;
    var SHIP = 3;


    // Sortierfunktion fuer Bots (Enemies und Asteroids)
    // je naeher am Schiff, desto niedriger der Indize
    function compare(a, b) {
        var distanceA = a.position.distanceToSquared(ship.position);
        var distanceB = b.position.distanceToSquared(ship.position)

        if (distanceA < distanceB) {
            return -1;
        } else if (distanceA > distanceB) {
            return 1;
        } else {
            return 0;
        }
    }


    // Testet so, dass sich Gegenstaende beim Erzeugen nicht behindern
    // TODO: Falls es lagt, Spieler - 1/4 - Asteroiden - 5/6 - Enemies
    function farAway(position, size) {
        // ueberpruefe Kollision mit Asteroiden
        var asteroidsLength = asteroids.length;
        for (i = 1; i <= asteroidsLength; i++) {
            asteroid = asteroids[asteroidsLength - i];
            var distanceAsteroid = asteroid.position.distanceTo(position);

            if (distanceAsteroid - size - asteroid.radius < 0) {
                return false;
            }
        }

        // ueberpruefe Kollision mit Enemies
        var enemiesLength = enemies.length;
        for (i = 1; i <= enemiesLength; i++) {
            enemy = enemies[enemiesLength - i];
            var distanceEnemy = enemy.position.distanceTo(position);

            if (distanceEnemy - size - maxShipSize < 0) {
                return false;
            }
        }

        // nichts gefunden
        return true;
    }

    // Respawn der Asteroiden
    function respawnAsteroids() {
        var level, asteroid;
        // rueckwaerts, um beim Loeschen nicht ein Element zu ueberspringen
        for (var i = asteroids.length - 1; i >= 0; i--) {
            asteroid = asteroids[i];
            if (!asteroid.isAlive) {
                level = asteroid.level;
                if (level = gameLevel) {
                    // altes Loeschen
                    scene.remove(asteroid);
                    asteroids.splice(i, 1);

                    asteroid = createAsteroid(level);
                    asteroids.push(asteroid);
                    //console.log("Respawned: " + asteroids.length);
                    scene.add(asteroid);
                }
            }
        }
    }

    // Respawn der Enemies
    function respawnEnemies() {
        var level, enemy;
        // rueckwaerts, um beim Loeschen nicht ein Element zu ueberspringen
        for (var i = enemies.length - 1; i >= 0; i--) {
            enemy = enemies[i];
            if (!enemy.isAlive) {
                level = enemy.level;
                // altes Loeschen
                scene.remove(enemy);
                // und gegebenenfalls neu setzen
                enemies[i] = enemy;
                if (enemy.respawn) {
                    enemyHitBoxes[i] = enemy.hitBox;
                    enemy = createEnemy(level);
                    enemies[i] = enemy;
                    enemyHitBoxes[i] = enemy.hitBox;
                    scene.add(enemy);
                } else {
                    enemies.splice(i, 1);
                    enemyHitBoxes.splice(i, 1);
                }
                //console.log("Respawned: " + enemies.length);
            }
        }
    }


    // Erschaffe Asteroiden
    function createAsteroid(level) {
        var direction, alpha, beta, asteroidPosition, radius;
        //console.log("Enter Create Asteroid");
        // Welt als Kugel -> Setze an den aeusseren 3/4 Rand
        var positionRadius = worldRadius / 4 * (1 + 3 * Math.random());


        // zufaellig an den Rand positionieren
        do {
            alpha = 2 * Math.PI * Math.random();
            beta = 2 * Math.PI * Math.random();
            asteroidPosition = new THREE.Vector3(
                Math.sin(beta) * Math.sin(alpha),
                Math.sin(beta) * Math.cos(alpha),
                Math.cos(beta));
            asteroidPosition.multiplyScalar(positionRadius);
            asteroidPosition.add(ship.position);
            // Radius zufaellig, aber mindestens so gross wie Schiff
            radius = minShipSize + Math.random * (maxAsteroidSize - minShipSize);
        } while (!farAway(asteroidPosition, radius));

        // speed abhaengig von Level, ! asteroid.speed < 65 < min(enemy.speed)
        var speed = (level > 15) ? 15 : level;
        speed += 35 + 15 * Math.random();
        //speed = 50;


        // Richtung:
        direction = new THREE.Vector3(
            ship.position.x - asteroidPosition.x,
            ship.position.y - asteroidPosition.y,
            ship.position.z - asteroidPosition.z);
        // bilde orthogonalen Vektor
        var randomDir = new THREE.Vector3(direction.x, direction.y, direction.z);
        randomDir.cross(new THREE.Vector3(Math.random(), 1, Math.random()));
        randomDir.normalize();
        randomDir.multiplyScalar(5.67 * direction.length() * (2 * Math.random() - 1)); // tan(80°) 
        direction.add(randomDir);

        // direction = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() -0.5);

        console.log("Finally Create Asteroid");

        asteroid = new Asteroid(asteroidPosition, 20, direction, speed, level, false);
        console.log(asteroid.getHitBox());
        asteroidHitBoxes.push(asteroid.getHitBox());

        return asteroid;
    }

    // Erschaffe Enemy
    function createEnemy(level) {
        var direction, alpha, beta, enemyPosition, radius,
            typ;
        //console.log("Enter Create Enemy");
        // Welt als Kugel -> Setze an den aeusseren 1/2 Rand
        // TODO: spawnRadius setzen
        var spawnRadius = 700;
        radius = spawnRadius / 2 * (1 + Math.random());

        // zufaellig an den Rand positionieren
        do {
            alpha = 2 * Math.PI * Math.random();
            beta = 2 * Math.PI * Math.random();
            enemyPosition = new THREE.Vector3(
                Math.sin(beta) * Math.sin(alpha),
                Math.sin(beta) * Math.cos(alpha),
                Math.cos(beta));
            enemyPosition.multiplyScalar(radius);
            enemyPosition.add(ship.position);
        } while (!farAway(enemyPosition, maxShipSize));

        // TODO: speed abhaengig von Level
        var speed = 15;

        // TODO: weapon
        switch (Math.round(level * Math.random())) {
            case 0: typ = 0; break;
            case 1: typ = 1; break;
            case 2: typ = 2; break;
            case 3: typ = 3; break;
            default: typ = 4; // hardest weapon
        }

        //console.log("Finally Create Enemy");
        enemy = new Enemy(enemyPosition, speed, level, typ);

        return enemy;
    }


    // aktualisiere Position der Asteroiden und Gegner
    // Setze direction neu
    function updateLocation(delta) {

        // 1. Schritt: Gegner sortieren (siehe 2. Schritt)
        enemies.sort(compare);

        // 2. Schritt: Ausweichen
        // Asteroiden haben keine Intelligenz -> Bewegung behalten
        // Gegner sind intelligent -> allen vor sie liegenden Asteroiden ausweichen
        //                         -> allen vor sie liegenden Gegnern ausweichen
        // -> vordere updaten und Richtung des naechsten anhand der neuen Position
        //    ausrechnen

        // Asteroiden: Bewegung updaten
        for (asteroid of asteroids) {
            asteroid.move(delta);
            //console.log("Asteroid wird bewegt")
        }

        asteroids.sort(compare);

        // Enemies bewegen
        // erst ab bestimmter Distanz d_max ausweichen priorisieren
        // ab d_min auf jeden Fall ausweichen
        for (enemy of enemies) {
            enemy.move(delta, asteroid, enemies);
            //console.log("Enemy wird bewegt")
        }

    }

    return {
        // update-Methode, aufzurufen in jedem Durchlauf des Renderers
        updateAI: function (delta) {
            // Gegner und Asteroiden updaten
            updateLocation(delta);
            // Kollisionsueberpruefung -> zerstoerte Loeschen
            for (asteroid of asteroids) {
                if (!asteroid.isAlive) {

                }
            }
            // Asteroiden respawnen
            respawnAsteroids();
            //console.log("AI updated")
        },


        // Initialisierer der Bots je Level
        initAI: function (level) {
            //console.log("Start initAI");
            // setzen unserer externen Faktoren
            worldRadius = 5000;

            // erstelle Asteroiden
            // TODO: asteroiden wie loeschen
            if (level == 1) {
                asteroids = [];
            }

            // TODO: Levelabhaengigkeit klaeren
            for (var i = 0; i < numOfAsteroids; i++) {
                asteroid = createAsteroid(level);
                asteroids.push(asteroid);
                //console.log(asteroids.length);
                scene.add(asteroid);
            }

            //console.log(level);
            // erstelle Gegner
            if (level == 1) {
                enemies = [];
            }

            for (var i = 0; i < 15 * level; i++) {
                //console.log("Hello");
                enemy = createEnemy(level);
                enemies.push(enemy);
                //console.log(enemies.length);
                scene.add(enemy);
            }
        },

        getAsteroids: function () {
            return asteroids;
        },

        getEnemies: function () {
            return enemies;
        }
    }
}
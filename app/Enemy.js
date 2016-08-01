var minObstacleDistance = 100;
var maxAsteroidSize = 30;
var guardingRadius = 50;
var minDistanceToPlayer = 200;
var maxShipSize         = 20;
var maxShipAngle        = 70 * (Math.PI / 360);
var shootAccuracy       = 100;

var BOSS1 = 1;
var BOSS2 = 2;
var SMALL1 = 3;
var SMALL2 = 4;

var asteroids, enemies, enemy, asteroid,
    radius, i, bezierPoints, geometryB, textureB, MATH, bot;

// Enemyklasse
// Hier nichts direkt aufrufen, Aufrufe werden ueber Bot.js geregelt
// (Ausnahme: Collision soll auf collide zugreifen)
function Enemy(location, speed, level, typ) {
    // TODO: unterschiedliche Enemies

    // Waffe setzen und Groesse aendern
    // TODO: weaponguard
    switch(typ) {
        case "BOSS1":
            geometryB = fileLoader.get("EnemyShipOne");
            this.weapon = 1;
            this.scale.set(20,20,20);
            this.HP = 20;
            break;
        case "BOSS2":
            geometryB = fileLoader.get("EnemyShipOne");
            this.weapon = 1;
            this.scale.set(25,25,25);
            this.HP = 20;
            break;
        case "SMALL1":
            geometryB = fileLoader.get("EnemyShipOne");
            this.weapon = 1;
            this.scale.set(20,20,20);
            this.HP = 10;
            break;
        case "SMALL2":
            geometryB = fileLoader.get("EnemyShipOne");
            this.weapon = 1;
            this.scale.set(20,20,20);
            this.HP = 10;
            break;
        default:
            geometryB = fileLoader.get("EnemyShipOne");
            this.weapon = 1;
            this.scale.set(20,20,20);
            this.HP = 10;
    }


    var textureB = fileLoader.get("TextureEnemyShipOne");



    // Mesh setzen
    THREE.Mesh.call(this, geometryB,
                    new THREE.MeshPhongMaterial({map: textureB}));

    MATH = MATHX();

    this.speed      = speed;
    this.position.set(location.x,location.y,location.z);
    this.level      = level;
    this.isAlive    = true;
    this.onPlayerAttack  = false;
    this.delta      = 0;
    this.respawn    = false;

    // Initialen Ausrichtungsvektor
    this.lookAt(ship.position);
    // .. und direction
    this.direction = MATH.clone(ship.position);
    this.direction.sub(this.position);
    this.direction.normalize();

    this.oldDir = MATH.clone(this.direction);

    // Spieler-Richtung
    this.playerDirection = new THREE.Vector3(0, 0, 0);
    this.oldPlayerLocation = MATH.clone(ship.position);
    this.oldPlayerDir = MATH.clone(ship.position);

    // HitBox
    this.hitBox = this.getHitBox();

}

Enemy.prototype.constructor = Enemy;
Enemy.prototype = new THREE.Mesh;


// Bewegung des Schiffes
Enemy.prototype.move = function (delta, asteroids, enemies) {
    var distanceToShip, dir, optimalDir;
    var obstacles = [];

    // update delta
    this.delta = delta;

    this.updatePlayerDirection();

    // 0. Schritt: Checke ob auf Bezierkurve oder nicht
    if (this.onPlayerAttack) {
        // Achte darauf, dass sich der Spieler nicht um mehr als 90° zur
        // urspruenglichen Richtung gedreht hat
        var renew = false;
        // Falls Spieler umgedreht (im Vergleich zum initialisieren), neu machen
        if (MATH.dot(this.oldPlayerDir, this.playerDirection) < 0) {
            //console.log("please renew");
            renew = true;
        }

        optimalDir = this.moveCurve(renew, delta);
        optimalDir.normalize();

        //console.log("Points Curve: " + this.points.length);
        // Attacke beendet, wenn Kurve abgelaufen
        if (this.points.length == 0) {
            this.onPlayerAttack = false;
        }

    } else {

        // 1. Schritt: Gehe in Richtung Spieler (Idealrichtung)
        var directionToPlayer = MATH.clone(ship.position);
        directionToPlayer.sub(this.position);

        var distanceToNext = directionToPlayer.length();

        directionToPlayer.normalize();

        optimalDir = MATH.clone(directionToPlayer);

        // 2. Schritt: Ueberpruefe, ob dem Spieler zu nahe geraten
        if (distanceToNext < minDistanceToPlayer) {
            // Gelange hinter dem Spieler:
            // fliege in Bezierkurve hinter den Flieger
            // setze Idealrichtung als Richtung zu naechstem Punkt auf der Kurve
            // berechne Bezierkurve und setze flag onBezier = true
            this.onPlayerAttack = true;

            // TODO: Init Bezier-Kurve und gebe ersten Punkt vor
            optimalDir = this.moveCurve(true, delta);
            optimalDir.normalize();
        }
    }



    // 3. Schritt: Ueberpruefe auf Hindernisse
    obstacles = this.collectObstacles(optimalDir, delta);


    // 4. Schritt: ausweichen

    // Unterscheide nach Faellen, da der Algorithmus fuer mehrere
    // Hindernisse rechenintensiv ist
    if (obstacles.length > 1) {
        // geht optimale Richtung?
        var collision = this.checkDirection(optimalDir, obstacles);
        var directionFound = (collision == 0);

        if (directionFound) {
            dir = optimalDir;
        } else {
            dir = this.avoidObstacles(optimalDir, obstacles, delta);
        }


    } else if (obstacles.length == 1) {
        dir = this.avoidObstacle(optimalDir, obstacles, delta);
    } else {
        dir = optimalDir;
        this.shoot(ship.position);
    }



    // 5. Schritt: normalisiere, um Geschwindigkeit nur von speed
    //                              abhaengig zu machen
    dir.normalize();


    // 6. Schritt: update Position
    //console.log("Position enemy before: (" + this.position.x + "," + this.position.y + "," + this.position.z + ")");
    //console.log("Direction: (" + dir.x + "," + dir.y + "," + dir.z + ")");

    dir.multiplyScalar(delta * this.speed);


    this.position.x += dir.x;
    this.position.y += dir.y;
    this.position.z += dir.z;


    //console.log("Position enemy after: (" + this.position.x + "," + this.position.y + "," + this.position.z + ")");
    //console.log("Direction at init: (" + this.direction.x + "," + this.direction.y + "," + this.direction.z + ")");




    // 7. Schritt: rotieren mit lookAt
    dir.normalize();
    var viewDir = MATH.clone(this.position);
    viewDir.add(dir.multiplyScalar(5 * this.speed));
    this.lookAt(viewDir);

    // 8. Schritt: Speichern
    dir.normalize();
    this.oldDir = MATH.clone(dir);

    this.hitBox.position.set(this.position);

}


// @return optimale Richtung nach Bezierflugbahn
// TODO: In aufrufender Klasse Fallunterscheidung

// TODO: anpassen an neuer Geschwindigkeit (15 statt 70)
Enemy.prototype.moveCurve = function (renew, delta) {
    var p1, p2;
    var shipSize = 50;


    // Falls noch nicht erzeugt oder Spieler sich um mehr als 90° gedreht hat
    if (renew) {
        //console.log("renews");
        this.points = [];

        this.oldPlayerDir = ship.position;

        var distanceToPlayer = this.position.distanceTo(ship.position);
        // Vektor zum Spieler
        var N = MATH.clone(ship.position);
        N.sub(this.position);

        // orthogonale Vektoren, um Plane aufzuspannen
        var U = MATH.clone(N);
        U.cross(new THREE.Vector3(0, 1, 0));
        var V = MATH.clone(U);
        V.cross(N);

        U.normalize();
        V.normalize();

        // vor dem Spieler
        if (MATH.dot(this.direction, this.direction) <= 0) {// !! TODO: Nachfragen player.direction
            p1 = MATH.clone(ship.position);
            p1.add(U.multiplyScalar(shipSize + Math.random() * shipSize));
            p1.add(V.multiplyScalar(shipSize + Math.random() * shipSize));
            U.normalize();
            V.normalize();
            p2 = MATH.clone(ship.position);
            p2.add(N.multiplyScalar(0.5));
            p2.add(U.multiplyScalar(Math.random() * (shipSize + Math.random() * shipSize)));
            p2.add(V.multiplyScalar(Math.random() * (shipSize + Math.random() * shipSize)));
            U.normalize();
            V.normalize();
            N.multiplyScalar(2);
        } else { // hinter dem Spieler
            p1 = MATH.clone(this.position);
            p1.add(N.multiplyScalar(2 / 3));
            p1.add(U.multiplyScalar(shipSize + Math.random() * shipSize));
            p1.add(V.multiplyScalar(shipSize + Math.random() * shipSize));
            U.normalize();
            V.normalize();
            N.multiplyScalar(3 / 2);

            p2 = MATH.clone(this.position);
            p2.add(N.multiplyScalar(1 / 3));
            p2.add(U.multiplyScalar(shipSize + Math.random() * shipSize));
            p2.add(V.multiplyScalar(shipSize + Math.random() * shipSize));
            U.normalize();
            V.normalize();
            N.multiplyScalar(3);
        }

        var curve = new THREE.SplineCurve3([
            this.position,
            p1,
            p2,
            ship.position]);

        var curveLength = this.position.distanceTo(p1);
        curveLength += p1.distanceTo(p2);
        curveLength += p2.distanceTo(ship.position);

        this.points = curve.getPoints(Math.round(20 * this.speed / (delta * curveLength)));
        //console.log(this.points.length);
        this.points.shift();
    }

    // Punkte abarbeiten mit points.shift();
    var dir = this.points.shift();
    //console.log(dir.x, dir.y, dir.z);
    dir.sub(this.position);

    //console.log(dir.x,dir.y,dir.z);
    //console.log(this.points.length);

    return dir;
}

// Sammel Hindernisse auf
// TODO: ab gewissem Level (15) auch Projektilen ausweichen
Enemy.prototype.collectObstacles = function (optimalDir, delta) {
    var d;
    var possibleObstacle = false;
    var obstacles = [];

    var bot = Bot();
    var asteroids = bot.getAsteroids();
    //console.log("Asteroids:" + asteroids.length);
    var enemies = bot.getEnemies();
    //console.log("Enemies: " + enemies.length);

    // Setze, da Abstand nach vorne wichtiger, Schiff voruebergehend auf die
    // Position mit idealer Flugrichtung im naechsten Frame
    var shipPosition = MATH.clone(this.position);
    optimalDir.multiplyScalar(delta * this.speed);
    shipPosition.add(optimalDir);
    optimalDir.normalize();

    var directionToPlayer = MATH.clone(ship.position);
    directionToPlayer.sub(this.position);
    var distanceToNext = directionToPlayer.length();

    var shipDistance = distanceToNext + delta * this.speed;

    // Kontrolliere, ob sich im guardingRadius andere Gegenstaende befinden
    for (asteroid of asteroids) { // Asteroiden schon geupdatet
        d = Math.abs(shipDistance - asteroid.position.distanceTo(ship.position));

        // Teste, ob im richtigen Ring um den Spieler
        // possibleObstacle um die Sortierung zu nutzen -> Doppelter switch
        if (d <= minObstacleDistance) { // nahe (in Bezug auf Distanz zum Player)
            possibleObstacle = true;
            distanceToShip = asteroid.position.distanceTo(shipPosition);
            if(distanceToShip <= minObstacleDistance) { // nahe an this
                obstacles.push(asteroid.getObstacleHitBox());
            }
        } else if (possibleObstacle && d > minObstacleDistance) {
            possibleObstacle = false;
            break; // da sortiert nun nur noch weiterliegende Objekte
        }

    }

    for (enemy of enemies) {
        d = enemy.position.distanceTo(ship.position) - shipDistance;
        if (d <= 0 && d <= minObstacleDistance) { // nahe und vor einem
            distanceToShip = enemy.position.distanceTo(shipPosition);
            if(distanceToShip <= minObstacleDistance && enemy!=this) { // nahe an this
                obstacles.push(enemy.getObstacleHitBox());
            }
        } else if (possibleObstacle && d > minObstacleDistance) {
            // nach Sortierung wieder zu weit entfernt oder hinter enemy
            possibleObstacle = false;
            break;
        }
    }

    return obstacles;
}

// Ueberprueft die Richtung auf Hindernisse
// @return #Hindernisse
Enemy.prototype.checkDirection = function (direction, objects) {
    var raycaster =
        new THREE.Raycaster(this.position, direction, 0,
            minObstacleDistance - this.speed * this.delta);
    var rayObstacles = raycaster.intersectObjects(objects);

    return rayObstacles.length;
}


Enemy.prototype.shoot = function (aimPosition) {
    var projectileSpeed = 100;
    // Schießt von position mit weapon in direction
    // TODO: Je naeher desto haeufiger
    var distanceEnemyPlayer = this.position.distanceTo(ship.position);
    distanceEnemyPlayer = distanceEnemyPlayer / projectileSpeed;

    var futurePosition = MATH.clone(ship.position);
    this.playerDirection.multiplyScalar(distanceEnemyPlayer);
    futurePosition.add(this.playerDirection);
    this.playerDirection.normalize();

    var error = new THREE.Vector3(Math.random(), Math.random(), Math.random());
    error.multiplyScalar(shootAccuracy);

    futurePosition.add(error);

    // TODO: Shoot von Weapon aufrufen von this.position nach futurePosition

}


// Suche Richtung bei einem Hindernis
// TODO: aendern wie auf Zettel
Enemy.prototype.avoidObstacle = function (optimalDir, obstacles, delta) {
    var avoidDir, dir;
    var obstacle = obstacles[0];
    var flightAngle = MATH.dot(obstacle.direction, this.direction);
    // = cos , da direction immer normiert

    var UVN = this.getUVN(optimalDir);
    var U = UVN[0];
    var V = UVN[1];

    // Falls nicht auf einen zufliegend
    if (flightAngle >= -0.965) { // fliegt nicht scharf auf einen zu
        // Weiche aus: Gehe in die optimale Richtung, abgelenkt um
        //  Normale zum Schnittpunkt mit Hindernis

        // TODO: weiche aus in Richtung der Normalen des Schnittpunkts (neue berechnen, s. Zettel heute morgen)

        avoidDir = new THREE.Vector3(
            this.position.x - obstacles[0].position.x,
            this.position.y - obstacles[0].position.y,
            this.position.z - obstacles[0].position.z);
        avoidDir.normalize();




    } else {  // im >15° Winkel auf einen zufliegend
        // sonst, weiche aus bzw. zerschiesse Asteroid wie aufs Zettel 1
        // U,V nehmen -> orthogonal verschieben und schiesse zuvor
        this.shoot(ship.position);

        // weiche orthogonal aus
        if (this.checkDirection(U, obstacle) == 0) {
            avoidDir = MATH.clone(U);
        } else {
            avoidDir = MATH.negated(U);
            //console.log("this.checkDirection(U, obstacle) = " + this.checkDirection(U, obstacle));
        }
    }

    // Gewichte die Laengen, um Kollision zu vermeiden
    var bestImpact = this.position.distanceTo(obstacles[0].position);
    var avoidImpact = 1.5 * maxAsteroidSize;

    avoidDir.multiplyScalar(avoidImpact);

    dir = MATH.clone(optimalDir);
    dir.multiplyScalar(bestImpact);
    dir.add(avoidDir);

    //console.log(dir.x, dir.y, dir.z);

    return dir;
}

// Suche Richtung bei mehreren Hindernissen
Enemy.prototype.avoidObstacles = function (optimalDir, obstacles, delta) {
    var avoidDir, dir, translate;

    var directionFound = false;
    var avoidDirs = [];
    var UVN = [];
    var scalar = this.speed * delta * Math.tan(maxShipAngle); // Hoehe der Plane
    var checkingDistance = 0.2 * scalar; // da 6 Iterationen
    var tmp = obstacles.length;
    var collisions = [tmp, tmp, tmp, tmp];

    // setze die Laengen von U und V neu, auf maximale Distanz
    // (je nach Winkel des Raumschiffs)
    UVN = this.getUVN(optimalDir);
    var U = UVN[0];
    var V = UVN[1];
    U.multiplyScalar(checkingDistance);
    V.multiplyScalar(checkingDistance);

    for (i = 0; i < 4; i++) {
        avoidDir = MATH.clone(optimalDir);
        switch (i) {
            case 0: avoidDir = avoidDir.add(U).add(V); break;
            case 1: avoidDir = avoidDir.add(U).sub(V); break;
            case 2: avoidDir = avoidDir.sub(U).add(V); break;
            case 3: avoidDir = avoidDir.sub(U).sub(V); break;
            default: console.log("Error @avoidObstacles: i /€ {0..3}");
        }

        avoidDirs.push(avoidDir);
        collisions[i] = this.checkDirection(avoidDir, obstacles);
        directionFound = (collisions[i] == 0);

        if (directionFound) {
            return avoidDir;
        }
    }



    var iter = 0;

    do {
        // 4.1.4a Bestimme Richtung mit minimaler Kollisionsanzahl
        if (!directionFound) { // obsolet
            dir = avoidDirs[MATH.getMinIndex(collisions)];
        }

        // loesche alte Ausweichrichtungen
        avoidDirs = [];

        // setze die Laengen von U und V neu, auf maximale Distanz
        // (je nach Winkel des Raumschiffs)
        U.normalize();
        V.normalize();
        U.multiplyScalar(2 / 3 * checkingDistance * scalar);
        V.multiplyScalar(2 / 3 * checkingDistance * scalar);

        // verschiebe um ein kleines Stueck (V Hochachse)
        translate = MATH.clone(U);
        var Vt = MATH.clone(V);
        translate.multiplyScalar(0.5);
        Vt.multiplyScalar(0.5);

        switch (MATH.getMinIndex(collisions)) {
            case 0: // oben rechts
                translate = translate.add(Vt); break;
            case 1: // unten rechts
                translate.negate().add(Vt); break;
            case 2: // oben links
                translate.add(Vt.negate()); break;
            case 3: // unten links
                translate.negate().add(Vt.negate()); break;
            default: console.log("Error @avoidObstacles: Min Index of collisions is worng");
        }

        // 4.1.4b Betrachte die Eckpunkte in der Umgebung
        for (var i = 0; i < 4; i++) {
            avoidDir = MATH.clone(optimalDir);
            avoidDir.add(translate);

            switch (i) {
                case 0: avoidDir = avoidDir.add(U).add(V); break;
                case 1: avoidDir = avoidDir.add(U).sub(V); break;
                case 2: avoidDir = avoidDir.sub(U).add(V); break;
                case 3: avoidDir = avoidDir.sub(U).sub(V); break;
                default: avoidDir = optimalDir;
            }

            avoidDirs.push(avoidDir);
            collision = this.checkDirection(avoidDir, obstacles);
            directionFound = (collision == 0);

            if (directionFound) {
                dir = avoidDir;
                break;
            }
        }

        if (directionFound) {
            // 4.1.4c Mach eine weitere Iteration zum Pruefen

            // setze die Laengen von U & V neu, auf maximale Distanz
            U.normalize();
            V.normalize();
            U.multiplyScalar(2 / 3 * checkingDistance * scalar);
            V.multiplyScalar(2 / 3 * checkingDistance * scalar);

            // verschiebe um ein kleines Stueck (V Hochachse)
            translate = MATH.clone(U);
            Vt = MATH.clone(V);
            translate.multiplyScalar(0.5);
            Vt.multiplyScalar(0.5);

            switch (MATH.getMinIndex(collisions)) {
                case 0: // oben rechts
                    translate = translate.add(Vt);
                case 1: // unten rechts
                    translate.negate().add(Vt);
                case 2: // oben links
                    translate.add(Vt.negate());
                case 3: // unten links
                    translate.negate().add(Vt.negate());

                default:
            }

            for (var i = 0; i < 4; i++) {
                avoidDir = MATH.clone(dir);
                avoidDir.add(translate);
                switch (i) {
                    case 0: avoidDir = avoidDir.add(U).add(V); break;
                    case 1: avoidDir = avoidDir.add(U).sub(V); break;
                    case 2: avoidDir = avoidDir.sub(U).add(V); break;
                    case 3: avoidDir = avoidDir.sub(U).sub(V); break;
                    default: avoidDir = optimalDir;
                }

                collision = this.checkDirection(avoidDir, obstacles);
                if (collision != 0) {
                    // Falls Kollision -> weiter iterieren
                    directionFound = false;
                    break;
                }
            }
        }

        // Automatisch erfuellt:
        // Falls immer noch keine Kollision, nimm die vorherige

        // Falls doch und Iterationsanzahl erreicht
        //    -> nimm letzte gute und schiesse
        iter++;
    } while (!directionFound && iter <= 5);

    if (directionFound) {
        return dir;
    } else {
        return this.searchDirectionRandom(optimalDir, obstacles, delta);
    }

}

// raet bis zu fuenfmal Richtung
Enemy.prototype.searchDirectionRandom = function (optimalDir, obstacles, delta) {
    var avoidDir, dir, collision;
    var directionFound = false;
    var UVN = [];

    // oder gehe orthogonal
    UVN = this.getUVN(optimalDir);
    var U = UVN[0];
    var V = UVN[1];

    for (var i = 0; i < 9; i++) {
        // "rate" neue Richtung
        avoidDir = MATH.clone(U);
        // |U|,|V| € [-1,1]
        U.multiplyScalar(2 * Math.random() - 1);
        V.multiplyScalar(2 * Math.random() - 1);
        avoidDir.add(V);
        V.normalize();
        U.normalize();
        avoidDir.normalize();

        var directionToPlayer = MATH.clone(ship.position);
        directionToPlayer.sub(this.position);
        var distanceToNext = directionToPlayer.length();

        // Strecke, bleibe aber im Bereich
        avoidDir.multiplyScalar(Math.random() * distanceToNext);

        if (i < 5) {
            // suche in Plane
            dir = MATH.clone(optimalDir);
        } else {
            // suche orthogonal zur bevorzugten Richtung
            dir = new THREE.Vector3(0, 0, 0);
        }

        dir.add(avoidDir);

        //  teste, ob diese geht
        collision = this.checkDirection(dir, obstacles);
        directionFound = (collision == 0);

        if (directionFound) {
            break;
        }
    }

    if (directionFound) {
        // falls ja, nimm diese
        return dir;
    } else {
        return this.searchDirectionAtEdge(optimalDir, obstacles, delta);
    }
}

// Suche Richtung an den Ecken
Enemy.prototype.searchDirectionAtEdge = function (optimalDir, obstacles, delta) {
    var dir, collision;
    var directionFound = false;
    var UVN = [];

    // U,V-Berechnung einfuegen
    UVN = this.getUVN(optimalDir);
    var U = UVN[0];
    var V = UVN[1];

    // Setze die Laengen von U und V neu, auf maximale Distanz
    // (je nach Winkel des Raumschiffs)
    var scalar = this.speed * delta * Math.tan(maxShipAngle);
    U.multiplyScalar(scalar);
    V.multiplyScalar(scalar);

    var j = 0;
    while (!directionFound) {

        dir = MATH.clone(optimalDir);

        switch (j) {
            case 0:
                dir = direction.add(U).add(V);
                break;
            case 1:
                dir = direction.add(U).sub(V);
                break;
            case 2:
                dir = direction.sub(U).add(V);
                break;
            case 3:
                dir = direction.sub(U).sub(V);
                break;
            default: console.log("Error @searchDirectionAtEdge: j /€ {0..3}");
        }



        collision = this.checkDirection(dir, obstacles);
        directionFound = (collision == 0);

        if (j >= 3) {
            break;
        } else {
            j++;
        }
    }

    // Teste, womit rausgeflogen und gebe Richtung zurueck
    if (directionFound) {
        return dir;
    } else {
        return this.searchDirectionAtEdge(optimalDir, obstacles);
    }
}

// suche Richtung orthogonal zur bevorzugten Flugrichtung
Enemy.prototype.searchDirectionOrthogonal = function (optimalDir, obstacles) {
    var dir, collision;
    var directionFound = false;

    for (var i = 0; i < 6; i++) {
        dir = MATH.clone(optimalDir);
        switch (i) {
            case 0:
                dir.cross(new THREE.Vector3(1, 0, 0));
                break;
            case 1:
                dir.cross(new THREE.Vector3(0, 1, 0));
                break;
            case 2:
                dir.cross(new THREE.Vector3(0, 0, 1));
                break;
            case 3:
                dir.cross(new THREE.Vector3(-1, 0, 0));
                break;
            case 4:
                dir.cross(new THREE.Vector3(0, -1, 0));
                break;
            case 5:
                dir.cross(new THREE.Vector3(0, 0, -1));
                break;
            default: console.log("Error @searchDirectionOrthogonal: i /€ {0.5}");
        }
    }

    dir.normalize();
    collision = this.checkDirection(dir, obstacles);
    directionFound = (collision == 0);

    if (directionFound) {
        return dir;
    } else {
        return this.handleNoDirection();
    }
}

// Falls eingekesselt, mache dies
Enemy.prototype.handleNoDirection = function () {
    var aim = MATH.clone(this.position);
    var shootDir = MATH.clone(this.direction);
    shootDir.normalize();
    aim.add(shootDir.multiplyScalar(minObstacleDistance));
    this.shoot(aim);
    return new THREE.Vector3(0, 0, 0);
}

// gibt U,V,N zu einer Geraden zurueck
Enemy.prototype.getUVN = function (dir) {
    // Konstruiere Richtungsplane
    var upVector = new THREE.Vector3(0, 1, 0);
    //upVector.add(shipPosition);
    // TODO: Ueberpruefe, ob Up richtig
    var N = MATH.clone(dir);

    var U = MATH.clone(N);
    U.cross(N);
    U.cross(N);

    var V = MATH.clone(N);
    V.cross(U);

    N.normalize();
    U.normalize();
    V.normalize();

    return [U, V, N];
}

Enemy.prototype.updatePlayerDirection = function () {
    var dir = MATH.clone(ship.position);
    dir.sub(this.oldPlayerLocation);
    dir.normalize();

    this.playerDirection = dir;
    this.oldPlayerLocation = ship.position;
}


Enemy.prototype.getObstacleHitBox = function() {
    var mesh, geometry, material;

    var radius = maxShipSize; // <- aendern
    geometry = new THREE.SphereGeometry(radius,32,32);

    material = new THREE.MeshBasicMaterial({
        transparent : true,
        opacity     : 0.5,
        color       : 0xffffff
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(this.position);

    return mesh;
}

Enemy.prototype.getObstacleProjectilesHitBox = function() {
    var projectileSize = 10;

    var mesh, geometry, material;

    geometry = new THREE.SphereGeometry(projectileSize,32,32);

    material = new THREE.MeshBasicMaterial({
        transparent : true,
        opacity     : 0.5,
        color       : 0xffffff
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(this.position);

    return mesh;
}

// TODO : implement functions

Enemy.prototype.getHitBox = function() {
    var mesh, geometry, material;

    // TODO: (besser) spezifizieren
    geometry = new THREE.BoxGeometry(this.scale.x, this.scale.y, this.scale.z);

    material = new THREE.MeshBasicMaterial({
        transparent : true,
        opacity     : 0.2,
        color       : 0xffffff
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(this.position);

    return mesh;
}

// TODO: spezifizieren
Enemy.prototype.collide = function(other, type) {
    switch(type) {
        case "ASTEROID": case "asteroid": case "Asteroid":

            break;
        case "SHIP": case "ship": case "Ship":

            break;
        case "PLAYER": case "player": case "Player":

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

            break;
        default: console.log("Error: Collision with unknown");
    }

    if(this.HP <= 0) {
        this.isAlive = false;
    }
}

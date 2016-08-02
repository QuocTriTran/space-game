function Starfield() {

    var startVector = new THREE.Vector3(0, 0, 0);

    this.material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        map: fileLoader.get("particle"),
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    this.particleCount = 5000;
    this.fieldSize = 1000;
    this.particles = new THREE.Geometry();



    for (var p = 0; p < this.particleCount; p++) {
        var particle = new THREE.Vector3(
            startVector.x+(Math.random()-0.5)*this.fieldSize,
            startVector.y+(Math.random()-0.5)*this.fieldSize,
            startVector.z+(Math.random()-0.5)*this.fieldSize
        );
        this.particles.vertices.push(particle);
    }
    this.particleSystem = new THREE.Points(this.particles, this.material);
    scene.add(this.particleSystem);



    this.update = function() {

        var distance = startVector.distanceTo(ship.position);
        if (distance > this.fieldSize/3) {
            startVector = ship.position.clone();

            scene.remove(this.particleSystem);
            this.particles = new THREE.Geometry();
            for (var p = 0; p < this.particleCount; p++) {
                var particle = new THREE.Vector3(
                    startVector.x+(Math.random()-0.5)*this.fieldSize,
                    startVector.y+(Math.random()-0.5)*this.fieldSize,
                    startVector.z+(Math.random()-0.5)*this.fieldSize
                );
                this.particles.vertices.push(particle);
            }
            this.particleSystem = new THREE.Points(this.particles, this.material);
            scene.add(this.particleSystem);


        }

    }

}
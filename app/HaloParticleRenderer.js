function HaloParticleRenderer() {

    this.startVector = new THREE.Vector3(0, 0, 0);
    this.particleCount = 1000;


    this.running = true;
    this.clock = new THREE.Clock();
    this.clock.start();

    this.particles = new THREE.Geometry();

    this.material = new THREE.PointCloudMaterial(
        {
            color: 0xffffff,
            size: 1,
            map: fileLoader.get("particle_grey"),
            blending: THREE.AdditiveBlending,
            transparent: true
        }
    );

    for (var p = 0; p < this.particleCount; p++) {
        var particle = new THREE.Vector3(
            this.startVector.x,
            this.startVector.y,
            this.startVector.z
        );

        particle.x += Math.random()-0.5;
        particle.y += Math.random()-0.5;
        particle.z += Math.random()-0.5;

        particle.velocity = particle.sub(this.startVector);

        this.particles.vertices.push(particle);
    }

    this.particleSystem = new THREE.PointCloud(this.particles, this.material);

    this.currentMovement = 1;

    // zur Szene hinzufügen
    scene.add(this.particleSystem);



    this.update = function () {

    };




}
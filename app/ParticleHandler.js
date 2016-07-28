var ParticleHandler = function() {
  
    var currentExplosions = [];
    var currentImplosions = [];
    
    function addExplosion(position, lifetime, color, speed, size) {

        if (speed == undefined) speed = 1;
        if (size == undefined) size = 1;

        // explosion 15 bewegungsschritte laufen lassen
        var explosion = new ExplosionParticleRenderer(color, 10000, fileLoader.get("particle_grey"), lifetime+2, position, speed, size);
        for (var i = 0; i < 15; i++) {
            explosion.update();
        }
        currentExplosions.push(explosion);
    }

    function addImplosion (position) {
        var implosion = new ImplosionParticleRenderer();
        currentImplosions.push(implosion);

    }

    return {
        addExplosion: addExplosion,

        addImplosion: addImplosion,

        update: function() {
            for (var i = 0; i < currentExplosions.length; i++) {
                var explosion = currentExplosions[i];
                var successful = explosion.update();
                if (!successful) {
                    currentExplosions.splice(i,1);
                }
            }
            for (var i = 0; i < currentImplosions.length; i++) {
                var implosion = currentImplosions[i];
                var successful = implosion.update();
                if (!successful) {
                    // Implosion löschen
                    currentImplosions.splice(i, 1);
                    
                    // Explosion starten
                    addExplosion(implosion.startVector, 5, 0xffffff, 1, 1);
                }
            }
        }
    };
    
};

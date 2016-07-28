var ExplosionParticleHandler = function() {
  
    var currentExplosions = [];
    
    return {
    	//Erzeugt eine Explosion(position, Lebenszeit, Farbe, Geschwindigkeit, Groeße)
        addExplosion: function(position, lifetime, color, speed, size) {

            if (speed == undefined) speed = 1;
            if (size == undefined) size = 1;

            var explosion = new ExplosionParticleRenderer(color, 10000, fileLoader.get("particle_grey"), lifetime+2, position, speed, size);
            for (var i = 0; i < 15; i++) {
                explosion.update();
            }
            currentExplosions.push(explosion);
        },
        update: function() {
            for (var i = 0; i < currentExplosions.length; i++) {
                var explosion = currentExplosions[i];
                var successful = explosion.update();
                if (!successful) {
                    currentExplosions.splice(i,1);
                }
            }
        }
    };
    
};

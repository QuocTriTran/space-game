var ExplosionParticleHandler = function() {
  
    var currentExplosions = [];
    
    return {
        addExplosion: function(position, lifetime, color) {
            var explosion = new ExplosionParticleRenderer(color, 10000, fileLoader.get("particle_grey"), lifetime+2, position);
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

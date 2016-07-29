//Audio-Variables
var laserAudio;
var rocketAudio;
var explosionAudio;

var powerUpAudioSource;

var powerUpAudio;

//var MGAudio;



var FileLoader = function() {
    console.log("FileLoader running ...");

    // Pfad zu allen Dateien
    var files = [
        // Texturen
        "../res/textures/metall.jpg",
        "../res/textures/tex.jpg",
        "../res/textures/sky_sphere_map.jpg",
        "../res/textures/RocketV2Tex.png",
        "../res/textures/Crosshair1.png",
        "../res/textures/Crosshair2.png",
        "../res/textures/Crosshair3.png",
        "../res/textures/Crosshair4.png",
        "../res/textures/Crosshair5.png",
        "../res/textures/Crosshair6.png",
        "../res/textures/Crosshair7.png",
        "../res/textures/Crosshair8.png",
        "../res/textures/Crosshair9.png",
        "../res/textures/Crosshair10.png",
        "../res/textures/Crosshair11.png",
        "../res/textures/Crosshair12.png",
        "../res/textures/Crosshair13.png",
        "../res/textures/Crosshair14.png",
        "../res/textures/Crosshair15.png",
        "../res/textures/Crosshair16.png",

        "../res/textures/TextureHero.png",
        "../res/textures/particle.png",
        "../res/textures/particle_grey.png",
        "../res/textures/Planet.png",
        "../res/textures/lensflare1.png",
        "../res/textures/lensflare2.png",
        "../res/textures/lensflare3.png",
        "../res/textures/AsteroidTex.jpg",
        "../res/textures/PowerUpHealthTex.png",
        "../res/textures/PowerUpShieldTex.png",
        //"../res/textures/PowerUpRocketTex.png",
        "../res/textures/PowerUpRocketTex.png",
        "../res/textures/PowerUpRocket2Tex.png",
        "../res/textures/PowerUpRocket4Tex.png",
        "../res/textures/PowerUpRocket8Tex.png",
        "../res/textures/GeldsackTex.jpg",
        "../res/textures/GeldsackFacePalmTex.jpg",

        // Models
        //"../res/meshes/HeroShipV1.json",
        //"../res/meshes/HeroShipV2.json",
        //"../res/meshes/HeroShipV4.json",
        "../res/meshes/HeroShipV5.json",
        "../res/meshes/EnemyMiniShipV1.json",
        "../res/meshes/AsteroidPart1.json",
        "../res/meshes/AsteroidPart2.json",
        "../res/meshes/AsteroidPart3.json",
        "../res/meshes/AsteroidComplete.json",
        "../res/meshes/RocketV2.json",
        "../res/meshes/AsteroidV2.json",
        "../res/meshes/PowerUpHealth.json",
        "../res/meshes/PowerUpRocket.json",
        "../res/meshes/PowerUpRocket2.json",
        "../res/meshes/PowerUpRocket4.json",
        "../res/meshes/PowerUpRocket8.json",
        "../res/meshes/PowerUpShield.json",
        "../res/meshes/Geldsack.json"
    ];
    // Key-Value-Store für die geladenen Dateien (Key: Name => Value: Inhalt)
    var loadedFiles = {};

    // Status des FileLoaders
    var filesSuccessfullyLoaded = 0;

    function loadJson(file, name) {
        var jsonLoader = new THREE.JSONLoader();
        jsonLoader.load(file,
            function (geometry) {
                // on success:
                loadedFiles[name] = geometry;
                filesSuccessfullyLoaded += 1;
            },
            // on progress
            function() {},
            // on error
            function() {
                console.log("FileLoader couldn't find file "+file);
            }
        );
    }

    function loadImage(file, name) {
        var textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin('anonymous');
        // load texture
        textureLoader.load(file,
            // on load
            function (texture) {
                //console.log("got:"+name);
                loadedFiles[name] = texture;
                filesSuccessfullyLoaded += 1;
            },
            // on progress
            function() {},
            // on error
            function() {
                console.log("FileLoader couldn't find file "+file);
            }

        );
    }

    // alle gewünschten Files laden
    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        //console.log("looking for:"+file);

        var h = file.split("/");
        var name = h[h.length-1].split(".")[0];
        var type = h[h.length-1].split(".")[1];

        // abhängig vom Dateityp: korrekten Loader auswählen
        switch (type) {
            case "json":
                loadJson(file, name);
                break;
            case "png": // no break!
            case "jpg": // no break!
            case "jpeg":
                loadImage(file, name);
                break;
            default:
                console.log("Error: unknown file format: "+file);
        }
    }


    //initialize Audio-files

    //Main-laser audio
    laserAudio = document.createElement('audio');
    var laserAudioSource = document.createElement('source');
    laserAudioSource.src = '../res/sounds/gun.wav';
    laserAudio.appendChild(laserAudioSource)


    powerUpAudio = document.createElement('audio');
    powerUpAudioSource = document.createElement('source');

  
  
    powerUpAudioSource.src = '../res/sounds/powerup.wav';
    powerUpAudio.appendChild(powerUpAudioSource);

    //rocket audio
    rocketAudio = document.createElement('audio');
    var rocketAudioSource = document.createElement('source');
    rocketAudioSource.src = '../res/sounds/rocket.wav';
    rocketAudio.appendChild(rocketAudioSource);

    explosionAudio = document.createElement('audio');
    var explosionAudioSource = document.createElement('source');
    explosionAudioSource.src = '../res/sounds/explosion.wav';
    explosionAudio.appendChild(explosionAudioSource);

    // MGAudio = document.createElement('audio');
    // var MGAudioSource = document.createElement('source');
    // MGAudioSource.src = 'mg.wav';
    // MGAudio.appendChild(MGAudioSource);

    console.log("FileLoader done.");


    function isReady() {
        // gibt true zurück, wenn alle Files geladen wurden
        return (filesSuccessfullyLoaded == files.length);
    }

    // "public" Methoden:
    return {
        isReady: isReady,
        getAll: function() {
            // gibt alle geladenen Dateien zurück
            return isReady() ? loadedFiles : undefined;
        },
        get: function(name) {
            var result = isReady() ? loadedFiles[name] : undefined;
            if (result == undefined) {
                console.log("FileLoader could not find texture '"+name+"'");
            }
            return result;
        }
    }
};

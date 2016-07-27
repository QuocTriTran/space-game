//Audio-Variables
var laserAudio;


var FileLoader = function() {
    console.log("FileLoader running ...");

    // Pfad zu allen Dateien
    var files = [
        // Texturen
        "../res/textures/metall.jpg",
        "../res/textures/test.jpg",
        "../res/textures/tex.jpg",
        "../res/textures/sky_sphere_map.jpg",
        "../res/textures/Crosshair.png",
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
        "../res/img/Crosshair16.png",
        "../res/img/batman.png",

        "../res/textures/TextureHero.png",
        "../res/textures/particle.png",
        "../res/textures/particle_grey.png",
        "../res/textures/Planet.png",
        "../res/textures/lensflare1.png",
        "../res/textures/lensflare2.png",
        "../res/textures/lensflare3.png",



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
        "../res/meshes/RocketV1.json",
        "../res/meshes/AsteroidV2.json"
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
                console.log("got:"+name);
                loadedFiles[name] = geometry;
                filesSuccessfullyLoaded += 1;
            }
        );
    }

    function loadImage(file, name) {
        var textureLoader = new THREE.TextureLoader();
        textureLoader.setCrossOrigin('anonymous');
        // load texture
        textureLoader.load(file, function (texture) {
            loadedFiles[name] = texture;
            filesSuccessfullyLoaded += 1;
        });
    }
    
    // alle gewünschten Files laden
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
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
    laserAudio = document.createElement('audio');
    var laserAudioSource = document.createElement('source');
    laserAudioSource.src = '../res/sounds/gun.wav';
    laserAudio.appendChild(laserAudioSource);

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

var container;

var camera, scene, renderer, clock, delta;

var fileLoader;
var interface;
var crosshair;
var ship;
var player;
var movement;
var turret;

var frames = 0;
var collision;
//var projectileList = [];


$(function() {
    
    fileLoader = FileLoader();    
    interface = Interface();
    collision = Collision();
    setTimeout(function(){
        init();
        cameraAnimate();
    },1000)
});


function init() {

    /********** THREE.js initialisieren **********/

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    //while(!fileLoader.isReady()){};
    scene = new THREE.Scene();

    // Beispiel-Code ...
    player = Player();
    player.init();

    camera = new THREE.TargetCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );

    camera.addTarget({
        name:'Target',
        targetObject: ship,
        cameraPosition: new THREE.Vector3(0,15,30),
        fixed: false,
        stiffness: 0.15,
        matchRotation: false
    });

    camera.addTarget({
        name:'Cockpit',
        targetObject: ship,
        cameraPosition: new THREE.Vector3(0,0,-10),
        fixed: false,
        stiffness: 1,
        matchRotation: true
    });
    var cam = Camera();
    cam.init();


    camera.setTarget('Target');

    crosshair = new Crosshairs();
    crosshair.init();
    
    turret = new Turret();
    turret.init();

    /********** Szene füllen **********/


    var light, object;

    scene.add( new THREE.AmbientLight( 0x404040 ) );
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 0 );
    scene.add( light );

    object = new THREE.AxisHelper( 100 );
    object.position.set( 0, 0, 0 );

    scene.add( object );




    /********** Module laden **********/


    var world = World();
    world.init();
    createStars();

    createAsteroids();

    movement = Movement();
    movement.init();    
    interfaceInit();



    object = new THREE.AxisHelper( 100 );
    object.position.set( 0, 0, 0 );
    scene.add( object );


   /** object = new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ), 50 );
    object.position.set( 400, 0, -200 );
    scene.add( object ); */



    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    stats = new Stats();
    container.appendChild( stats.dom );


    /********** Input **********/

    // Szene in DOM einsetzen
    container.appendChild( renderer.domElement );
    // Event-Listener
    window.addEventListener( 'resize', onWindowResize, false );


    clock = new THREE.Clock();


    initializeWeapons();
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function cameraAnimate(){
    if(frames < 25) {
        frames++;
        requestAnimationFrame(cameraAnimate);
    }else {
        yAxis = -2;
        requestAnimationFrame(animate);
    }
    //
    delta = clock.getDelta();
    Movement().move(delta);
    camera.update();
    renderer.render(scene, camera);
}

var fps =  30;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;


function animate() {
    // dont touch!    
    requestAnimationFrame( animate );
    now = Date.now();
    delta = now - then;
    if(delta > interval){
        then = now - (delta % interval);
        render();
    }
   
}

function render() {

    // TODO: animation code goes here

    stats.update();
    delta = clock.getDelta();
    if (!Pause) {
        handleCollision();
        renderWeapons();
        movement.move(delta);
        updateStars();
        updateAsteroids();
    }
    
    player.updateParticleValues();
    camera.update();

    renderer.render(scene, camera);
}





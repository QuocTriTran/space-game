
var asteroids = [];

//Variables
var weaponsActive = false;
var rocketAmmo = 2;
var MaxRockedAmmo =10;

var MGAmmo = 0;
var MaxMGAmmo = 100;

//Rocket: 0, MG: 1
var activeSecWeapon = 0;


//var MGAudio;

//var explosionAudio;

//Variables for projectiles, the rocket and the explosion

var projectiles = [];

var rocket;

var explosion;

//Keyboard for Keyboard-Controls

//var keyboard = new THREEx.KeyboardState();

//Variables for Time-Control
var weaponClock;

var timeSinceShoot = 0;

var timeSinceRocket = 0;

var timeSinceMG = 0;

var rocketTime = 0;

var explosionTime = 0;

//Counter for limiting MG shootings
var mgCounter = 0;

//Geometries for bullets etc.
var shootGeometry = new THREE.CylinderGeometry(1,1,500);

//var jsonLoader = new THREE.JSONLoader();
var rocketGeometry = undefined;
var rocketMaterial = undefined;

//jsonLoader.load("RocketV1.json", function (geometry, texture) {
//	 rocketGeometry = geometry;
//	 rocketMaterial = new THREE.MultiMaterial(texture);
//});
var explosionGeometry = new THREE.SphereGeometry(7,32,32);
var MGGeometry = new THREE.SphereGeometry(0.1,16,16);
rocketMaterial = new THREE.MeshBasicMaterial({ color:0xA0A0AF });

//var collidableMeshList = [];

// Create Materials for Bullets etc.
var shootMaterial = new THREE.MeshBasicMaterial({ color:0xFF0000 });
var explosionMaterial = new THREE.MeshBasicMaterial({ color:0xFFFFFF });

//variable for holding reference to spaceship
//var spaceship;

//Initialize, sp: the controlled Spaceship; cms: the List of Objects checked for collisions (CollidableMeshLists)
function initializeWeapons(){

	//Target for testing

	// var testGeometry = new THREE.SphereGeometry(50,16,16);
	// var testMaterial = new THREE.MeshBasicMaterial({ color:0xFFFF00 });
	// var testTarget1 = new THREE.Mesh(testGeometry, testMaterial);
	// testTarget1.translateX(200);
	// scene.add(testTarget1);
	// //testTarget1.name = "Asteroid";

	// asteroids.push(testTarget1);

	// rocketAudio = document.createElement('audio');
	// var rocketAudioSource = document.createElement('source');
	// rocketAudioSource.src = 'rocket.wav';
	// rocketAudio.appendChild(rocketAudioSource);

	// explosionAudio = document.createElement('audio');
	// var explosionAudioSource = document.createElement('source');
	// explosionAudioSource.src = 'explosion.wav';
	// explosionAudio.appendChild(explosionAudioSource);

	// MGAudio = document.createElement('audio');
	// var MGAudioSource = document.createElement('source');
	// MGAudioSource.src = 'mg.wav';
	// MGAudio.appendChild(MGAudioSource);

	//initialize clock for time-control
	weaponClock = new THREE.Clock();

	//document.addEventListener('leftclick', shoot, false);

	document.body.addEventListener('mousedown', function (e){
        if(e.button === 0){
    	   shoot();
        }
        else if(e.button === 1){
        //MGShoot();
            console.log("right");
        }
    }, false);

}

//One MG-firering burst (5 Bullets). 12 Bursts in one mg shot
function MGShoot(){
	  //create bullet mesh
	  var bullet1 = new THREE.Mesh(MGGeometry, shootMaterial);
	  //rotation for traveling direction: laser needs to be turned; if bullet ist turned in the same angle they can be rendered together.
	  bullet1.rotateZ(1.57);
	  //translate bullet to Position of the spaceship. Then spread a little for MG-effect
	  bullet1.position.x = ship.position.x+4;
	  bullet1.position.y = ship.position.y+0.3;
	  bullet1.position.z = ship.position.z+0.3;
	  scene.add(bullet1);
	  projectiles.push(bullet1);

	  var bullet2= new THREE.Mesh(MGGeometry, shootMaterial);
	  bullet2.rotateZ(1.57);
	  bullet2.position.x = ship.position.x+2;
	  bullet2.position.y = ship.position.y-0.3;
	  bullet2.position.z = ship.position.z+0.3;
	  scene.add(bullet2);
	  projectiles.push(bullet2);

	  var bullet3= new THREE.Mesh(MGGeometry, shootMaterial);
	  bullet3.rotateZ(1.57);
	  bullet3.position.x = ship.position.x;
	  bullet3.position.y = ship.position.y-0.3;
	  bullet3.position.z = ship.position.z-0.3;
	  scene.add(bullet3);
	  projectiles.push(bullet3);


	  var bullet4= new THREE.Mesh(MGGeometry, shootMaterial);
	  bullet4.rotateZ(1.57);
	  bullet4.position.x = ship.position.x+2;
	  bullet4.position.y = ship.position.y+0.3;
	  bullet4.position.z = ship.position.z-0.3;
	  scene.add(bullet4);
	  projectiles.push(bullet4);

	  var bullet5= new THREE.Mesh(MGGeometry, shootMaterial);
	  bullet5.rotateZ(1.57);
	  bullet5.position.x = ship.position.x+3;
	  bullet5.position.y = ship.position.y;
	  bullet5.position.z = ship.position.z;
	  scene.add(bullet5);
	  projectiles.push(bullet5);
}


function shoot(){
	  if(timeSinceShoot > 0.4){
	  	timeSinceShoot = 0;
		//create mesh
     	bullet1 = new THREE.Mesh(shootGeometry, shootMaterial);

     	bullet1.name = "Laser";
      	//translate to ship position
      	bullet1.position.x = ship.position.x;
      	bullet1.position.y = ship.position.y;
      	bullet1.position.z = ship.position.z;
      	//set orientation of the bullet according to ship orientation
      	bullet1.lookAt(targetPosition);

      	//rotate: laser beam would be pointing up otherwise
      	bullet1.rotateX(1.57);

      	//add bullet to scene
      	scene.add(bullet1);

      	//add bullet to bullet list so it will be moved
      	projectiles.push(bullet1);

      	//console.log(bullet1.name);

      //collidableMeshList.push(bullet1);
      //play lazer-sound
      laserAudio.play();
    }
}



function shootRocket(){
  if(rocketGeometry !== undefined){
  	console.log(rocketMaterial);
  	rocket1 = new THREE.Mesh(rocketGeometry, rocketMaterial);
  	rocket1.rotateY(1.57);
  	//for an unknown reason rocket has to be turned differend than the laser-beam
  	rocket1.rotateZ(-1.57);
  	rocket1.position.x = ship.position.x;
  	rocket1.position.y = ship.position.y;
  	rocket1.position.z = ship.position.z;
  	scene.add(rocket1);
  	rocket = rocket1;
  	//rocketAudio.play();

  	//collidableMeshList.push(rocket);
  	//reset timer for rocket-explosion after specific time
  	rocketTime=0;
  }

}

//Explosion of the rocket after specific time
function rocketExplode(){
  //explosion is a big sphere
  explosion1 = new THREE.Mesh(explosionGeometry, explosionMaterial);
  //set position at position of rocket
  explosion1.position.x = rocket.position.x;
  explosion1.position.y = rocket.position.y;
  explosion1.position.z = rocket.position.z;
  //save explosion in explosion variable
  explosion = explosion1;
  //add explosion to scene
  scene.add(explosion);
  //reset explosion timer for ending explosion after specific time
  explosionTime = 0;
  //play explosion time
  //explosionAudio.play();

  //collidableMeshList.push(explosion);
}

function calculateDistanceToShip( obj)
{
    var dx = obj.position.x - ship.position.x;
    var dy = obj.position.y - ship.position.y;
    var dz = obj.position.z - ship.position.z;

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
}


//funtion for mooving weapons, keyboard weapon-control and destruction of rocket/explosion
function renderWeapons(){

	   //console.log("inside!")
	  //Variable for adding past time since last call to all Weapon-Time-Counters
	  var add = weaponClock.getDelta();

	  //Time counters for limiting shooting frequence
	  timeSinceShoot  += add;
	  timeSinceRocket += add;
	  timeSinceMG     += add;
	  //variable for limiting rocket lifespan
	  rocketTime +=add
	  //variable for limiting explosion time
	  explosionTime +=add;

	  // //Buttons for shooting
	  // if(keyboard.pressed("v") ){
	  //   if(timeSinceShoot > 0.4){
	  //     shoot();
	  //     timeSinceShoot = 0;
	  //   }
	  // }
	  // if(keyboard.pressed("b") ){
	  //   if(timeSinceRocket > 2){
	  //     shootRocket();
	  //     timeSinceRocket = 0;
	  //   }
	  // }

	  // if(keyboard.pressed("n") ){
	  //     if(timeSinceMG > 0.4){
	  //       mgCounter = 12;
	  //       MGAudio.play();
	  //     }
	  // }

	  if(mgCounter > 0){
	    if(timeSinceMG >0.05){
	      timeSinceMG = 0;
	      MGShoot();
	      mgCounter -= 1;
	    }
	  }
	  //Translate projectiles
	  for( var bul in projectiles){
	    projectiles[bul].translateY(-2000 * add);

	  //Translate projectiles
	  for( var bul in projectiles){
	    projectiles[bul].translateY(-2000 * add);

	    var dis = calculateDistanceToShip(projectiles[bul]);
	    if (dis > 3000){
	    	scene.remove(projectiles[bul]);
	    	//var index = collidableMeshList.indexOf(projectiles[bul]);
	    	//delete projectiles[bul];
	    	projectiles.splice(bul,1);
	    }

	  }

	  //If a Rocket exists, translate. After specific time explode.
	  if (rocket !== undefined){
	    rocket.translateZ(30*add);
	    //After specific time call explosion-function and remove Rocket
	    var dis = calculateDistanceToShip(rocket);
	    if (dis > 30){
	    	rocketExplode();
	    	scene.remove(rocket);
	    	//var index = collidableMeshList.indexOf(rocket);
	    	//collidableMeshList.splice(index, 1);
	   		delete rocket;
	    	rocket = undefined;
	    }
	  }

	  //console.log(explosion);
	  if (explosion !== undefined){
	  console.log(explosionTime);
	    //explosion.scale.set(new THREE.Vector3(200,200,200));
	    if (explosionTime > 0.15){
	        scene.remove(explosion);
	    	//var index = collidableMeshList.indexOf(rocket);
	    	//collidableMeshList.splice(index, 1);
	    	delete explosion;
	        explosion = undefined;
	    }
	  }
    }
}

function toggleWeapons(){
	if(weaponsActive == true){
		document.removeEventListener('mousedown', shoot, false);
		weaponsActive = false;
	}else{
		document.addEventListener('mousedown', shoot, false);
		weaponsActive = true;
	}
}

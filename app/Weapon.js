//Are the weapons active?
var weaponsActive = false;

//Available ammunition, maximal ammunition
var rocketAmmo = 2;
var MaxRockedAmmo =10;

var MGAmmo = 0;
var MaxMGAmmo = 100;


//Damage of the Weapons

var rocketDamage = 10;
var laserDamage = 2;
var explosionDamage = 10;
var MGDamage = 1;

// Which secundary Weapon is active? Rocket: 0, MG: 1
var activeSecWeapon = 0;

//List of rendered projectiles (rockets, laser, MG and explosion), also for Colision
var projectiles = [];

//Variables for Time-Control

//Clock
var weaponClock;

//time since last laser-shoot
var timeSinceShoot = 0;
//time since last Rocket
var timeSinceRocket = 0;
//time since last MG shooting
var timeSinceMG = 0;

// time Explosion is existing
var explosionTime = 0;

//Counter for limiting MG single shootings
var mgCounter = 0;

//Geometries for bullets etc.
var shootGeometry;
var rocketGeometry;
var explosionGeometry;
var MGGeometry;
var hitBoxGeometry;
var rocketTexture;

// Materials for Bullets etc.
var shootMaterial;
var explosionMaterial;
var rocketMaterial;
var hitBoxMaterial;

//Initialize, sp: the controlled Spaceship; cms: the List of Objects checked for collisions (CollidableMeshLists)
function initializeWeapons(){

	//initialize Geometrys
	shootGeometry = new THREE.CylinderGeometry(1,1,500);
	rocketGeometry = fileLoader.get("RocketV1");
	explosionGeometry = new THREE.SphereGeometry(600,32,32);
	MGGeometry = new THREE.SphereGeometry(0.1,16,16);
	hitBoxGeometry = new THREE.CylinderGeometry(1,1,1000);

	//initialize Materials
	rocketTexture = fileLoader.get("TextureHero");
	rocketMaterial= new THREE.MeshPhongMaterial({map: rocketTexture});



	shootMaterial = new THREE.MeshBasicMaterial({ color:0xFF0000 });
	//rocketMaterial = new THREE.MeshPhongMaterial( { /*map:rocketTexture*/ color: 0x0000FF});
	explosionMaterial = new THREE.MeshBasicMaterial({ color:0xFF2F05 });
	hitBoxMaterial = new THREE.MeshBasicMaterial({ color:0x00FF00 });

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


	//add Listener for left and rigth mouseclick
	//document.body.addEventListener('click', shoot, false);

	
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

	  //add bullet to scene
	  scene.add(bullet1);

	  //add to projectiles list for rendering
	  projectiles.push(bullet1);

	  //repeat 4 times with spread

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

//called by EventListener when mouse clicked: leftclick: e.button == 0; rightclick e.button = 2 (ZWEI)
function shoot(e){
	if(e.button == 0){
		shootLaser();
		shoott();
	}
	else{
		shootRocket();
	}
}

//Firering main-laser
function shootLaser(){
	//if for limiting shooting frequency
	if(timeSinceShoot > 0.4){

		//play lazer-sound
	  	laserAudio.play();

	  	//reset timer
	  	//timeSinceShoot = 0;

		//create mesh
	 	var laser 		= new THREE.Mesh(shootGeometry,  shootMaterial);
	 	var laserHitBox = new THREE.Mesh(hitBoxGeometry, hitBoxMaterial);

	 	laserHitBox.add(laser);

	 	//set name for recognition in render-function
	 	laser.name  = "Laser";
	 	laserHitBox.name = "LaserHitBox";

	  	//translate bullet to ship position
	  	laser.position.x = ship.position.x;
	  	laser.position.y = ship.position.y;
	  	laser.position.z = ship.position.z;

	  	//translate HitBox to ship position
	  	laserHitBox.position.x = ship.position.x;
	  	laserHitBox.position.y = ship.position.y;
	  	laserHitBox.position.z = ship.position.z;

	  	//set orientation of the bullet according to ship orientation
	  	laser.lookAt(targetPosition);

	  	laserHitBox.lookAt(targetPosition);

	  	//rotate: laser beam would be pointing up otherwise
	  	laser.rotateX(1.57);

	  	//rotate: HitBox would be pointing up otherwise
	  	laserHitBox.rotateX(1.57);

	  	laser.translateY(-85);
	  	laserHitBox.translateY(-85);

	  	//add bullet to scene
	  	scene.add(laser);

	    laserHitBox.visible = false;

	  	scene.add(laserHitBox);


	  	//add bullet to bullet list so it will be moved
	  	//projectiles.push(laser);

	  	projectiles.push(laserHitBox);
	}
}

function successLaser(bul){

	//scene.remove(projectiles[bul]);
	//scene.remove(projectiles[bul-1]);
	//remove Laser HitBox
	//projectiles.splice(bul,1);
	//remove Laser
	//projectiles.splice((bul-1),1);
}

function shoott(){
	if(timeSinceShoot > 0.4){
		timeSinceShoot = 0;
		//create mesh
		var tlaser = new THREE.Mesh(shootGeometry, shootMaterial);
		var tlaserHitBox = new THREE.Mesh(hitBoxGeometry, hitBoxMaterial);

		tlaser.name  = "Laser";
		tlaserHitBox.name = "LaserHitBox";
		//translate to ship position
		tlaser.position.x = ship.position.x;
		tlaser.position.y = ship.position.y;
		tlaser.position.z = ship.position.z;

		//translate HitBox to ship position
		tlaserHitBox.position.x = ship.position.x;
		tlaserHitBox.position.y = ship.position.y;
		tlaserHitBox.position.z = ship.position.z;
		//set orientation of the bullet according to ship orientation
		var tempvec = new THREE.Vector3(refPoint.matrixWorld.elements[12],refPoint.matrixWorld.elements[13],refPoint.matrixWorld.elements[14]);

		tlaser.lookAt(tempvec);

		tlaserHitBox.lookAt(tempvec);
		//rotate: laser beam would be pointing up otherwise
		tlaser.rotateX(1.57);
	    tlaser.rotateX(3.1415);

		tlaserHitBox.rotateX(1.57);
		tlaserHitBox.rotateX(3.1415);
		//add bullet to scene
		scene.add(tlaser);
		tlaserHitBox.visible = false;
		scene.add(tlaserHitBox);
		//add bullet to bullet list so it will be moved
		projectiles.push(tlaser);
		projectiles.push(tlaserHitBox);

		//console.log(bullet1.name);

		//collidableMeshList.push(bullet1);
		//play lazer-sound
		laserAudio.play();
	}
}


function successRocket(bul){
	rocketExplode(projectiles[bul-1]);
	scene.remove(projectiles[bul]);
	scene.remove(projectiles[bul-1]);
	//remove Laser HitBox
	projectiles.splice(bul,1);
	//remove Laser
	projectiles.splice((bul-1),1);


}

//Shooting Rocket
function shootRocket(){
	//if for limiting rocket-shooting frequence
    if(timeSinceRocket>1.2 && rocketAmmo>0){
    	rocketAmmo -= 1;

    	console.log("rocketAmmo:"+rocketAmmo);
   		
   		//play rocket-sound
   		rocketAudio.play();

   		// create rocket
	  	var rocket = new THREE.Mesh(rocketGeometry, rocketMaterial);

	  	var rocketHitBox = new THREE.Mesh(hitBoxGeometry, hitBoxMaterial);

	  	rocket.name = "Rocket";

	  	//set name for recocnition in render-function
  	 	rocketHitBox.name = "RocketHitBox";

  	 	//scaling the rocket
  	 	rocket.scale.x = rocket.scale.y = rocket.scale.z = 5;

  	 	//set position at position of the spaceship
  	 	rocket.position.x = ship.position.x;
  	 	rocket.position.y = ship.position.y;
  	 	rocket.position.z = ship.position.z;

  	 	rocketHitBox.position.x = ship.position.x;
  	 	rocketHitBox.position.y = ship.position.y;
  	 	rocketHitBox.position.z = ship.position.z;

  	 	//orientate rocket like spaceship
  	 	rocket.lookAt(targetPosition);

  	 	rocketHitBox.lookAt(targetPosition);

  	 	//rotate rocket; rocket would fly backwards otherwise
  	 	rocket.rotateY(3.1415);

  	 	//rotate: laser beam would be pointing up otherwise
	  	rocketHitBox.rotateX(1.57);

    	//add rocket to scene
    	scene.add(rocket);

    	rocketHitBox.visible = false;
    	scene.add(rocketHitBox);

    	//add rocket to list for rendering and collision
    	projectiles.push(rocket);
    	projectiles.push(rocketHitBox);

    	//reset timer
    	timeSinceRocket = 0;
    }

}

//Explosion of the rocket at specific distance
function rocketExplode(rocket){
  //play explosion time
  explosionAudio.play();

  //the explosion is a big sphere (dummy)
  var explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);

  //set position at position of the exploding rocket
  explosion.position.x = rocket.position.x;
  explosion.position.y = rocket.position.y;
  explosion.position.z = rocket.position.z;

  //name for identification in rendering
  explosion.name = "Explosion";
  explosion.visible = false;
  //add explosion to scene
  scene.add(explosion);

  //reset explosion timer for ending explosion after specific time
  explosionTime = 0;

  //add explision to projetiles list for rendering and collision
  projectiles.push(explosion);
  //Erzeugt eine Explosion(position, Lebenszeit, Farbe, Geschwindigkeit, Groeße)
  explosionParticleHandler.addExplosion(explosion.position, 1, 0xFF3F00, 1, 1);
  explosionParticleHandler.addExplosion(explosion.position, 2, 0xFFFF00, 1, 1);
  explosionParticleHandler.addExplosion(explosion.position, 6, 0xFF0000, 1, 1);
}

//calculates the distance between an Object and the spaceship
function calculateDistanceToShip( obj)
{
    var dx = obj.position.x - ship.position.x;
    var dy = obj.position.y - ship.position.y;
    var dz = obj.position.z - ship.position.z;

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
}


//funtion for mooving weapons and destruction of rocket/explosion
function renderWeapons(){

	//Variable for adding the past time since last call to all Weapon-Time-Counters
	var add = weaponClock.getDelta();

	//increment time counters for limiting shooting frequence
	timeSinceShoot  += add;
	timeSinceMG     += add;
	timeSinceRocket += add
	//variable for limiting explosion lifespan
	explosionTime +=add;

	//function for limiting single shootings while MG-shooting
	if(mgCounter > 0){
	    if(timeSinceMG >0.05){
	    	timeSinceMG = 0;
	    	MGShoot();
	    	mgCounter -= 1;
	    }
	}

	//Translate all projectiles and check for end of existance
	for( var bul in projectiles){

		//calculate distance between projectile and spaceship
		var dis = calculateDistanceToShip(projectiles[bul]);

		//check name and proceed accordingly

		//if projectile is a laser-beam:
		// if(projectiles[bul].name == "Laser"){
		// 	//translate in mooving direction
	 //    	projectiles[bul].translateY(-4000 * add);
	 //    	//if more then 3000 away from ship delete
	 //    	if (dis > biggerSphereRadius){
  //   			scene.remove(projectiles[bul]);
  //   			//delete projectiles[bul];
  //   			projectiles.splice(bul,1);
  //   		}
	 //    }

	   	//if projectile is a laser-beam:
		/*else*/ if(projectiles[bul].name == "LaserHitBox"){
			//translate in mooving direction
	    	projectiles[bul].translateY(-4000 * add);
	    	//projectiles[bul].children[0].translateY(-4000 * add);

	    	//if more then 3000 away from ship delete
	    	if (dis > biggerSphereRadius){
    			//scene.remove(projectiles[bul]);
    			//delete projectiles[bul];
    			projectiles.splice(bul,1);
    		}
	    }

	    //if projectile is a rocket:
	    else if(projectiles[bul].name == "Rocket"){
	    	//translate in mooving direction (translateZ becouse of different orientation to laser)
	    	projectiles[bul].translateZ(2000 * add);

	    	//if more then 1000 away explode
  			if (dis > 1500){
  		   		rocketExplode(projectiles[bul]);
  		   		scene.remove(projectiles[bul]);
  				projectiles.splice(bul, 1);
  		   	}
  		}


  		//if projectile is a rocket Hitbox:
	    else if(projectiles[bul].name == "RocketHitBox"){
	    	//translate in mooving direction (translate becouse of different orientation to laser)
	    	projectiles[bul].translateY(-2000 * add);

	    	//if more then 1000 away explode
  			if (dis > 1500){
  		   		//scene.remove(projectiles[bul]);
  				projectiles.splice(bul, 1);
  		   	}
	    }
	    //if projectile is an Explosion:
	    else if(projectiles[bul].name == "Explosion"){
	    	//Check if Explosion
	    	if (explosionTime > 0.15){
        		scene.remove(projectiles[bul]);
        		projectiles.splice(bul, 1);
    		}
	    }
    }
}

function toggleWeapons(){
	if(weaponsActive == true){
		document.removeEventListener('click', shoot, false);
		weaponsActive = false;
	}else{
		document.addEventListener('click', shoot, false);
		weaponsActive = true;
	}
}

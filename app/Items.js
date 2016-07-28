var powerUps = [];
var types  = [];
var itemHitBoxes = [];


function spawnPowerUp(x, y, z, type) {

	var healthTex, rocketTex, rocket2Tex, shieldTex, itemGeometry;
    var item;
    var itemHitBox;


	if(type == undefined){
		var rndCase;

		rndCase = Math.random();

		if(rndCase <= 0.25){

			itemGeometry  = fileLoader.get("PowerUpHealth");
			healthTex = fileLoader.get("PowerUpHealthTex");
            item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({map: healthTex}));
            types.push("HEALTH");
		}else if (rndCase > 0.25 && rndCase<= 0.5){

			itemGeometry  = fileLoader.get("PowerUpRocket");
			rocketTex = fileLoader.get("PowerUpShieldTex");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({map: rocketTex}));
			types.push("SINGLEROCKET");


		}else if (rndCase > 0.5 && rndCase <= 0.75){

			itemGeometry  = fileLoader.get("PowerUpRocket2");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({map: rocketTex}));
			types.push("DOUBLEROCKET");

		} else{

			itemGeometry  = fileLoader.get("PowerUpRocket4");
			item = new THREE.Mesh(itemGeometry, new THREE.MeshPhongMaterial({map: rocketTex}));
			types.push("QUATROROCKET");

		}

	}



	 collectGeometry =  new THREE.BoxGeometry(3.4 *10, 3.4 *10, 1*10);

      var colBoxMaterial = new THREE.MeshBasicMaterial({
                    transparent: true,
                    opacity: 0.5,
                    color: 0xffffff
                });

                itemHitBox = new THREE.Mesh(collectGeometry, colBoxMaterial);
                itemHitBox.position.set(x,y,z);

	item.position.set(x, y, z);

	item.scale.x = item.scale.y = item.scale.z = 10;

	powerUps.push(item);
	itemHitBoxes.push(itemHitBox);

	scene.add(item)

    itemHitBox.visible = false;
    scene.add(itemHitBox);

}


function updatePowerUps (){





}


function collected(itemNumber){

    console.log("itemCollected");
    changeScore(scoreValues["itemCollected"]);

	var tmpItem =  types[itemNumber];

	switch (tmpItem){

		case "HEALTH":
            explosionParticleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0x00FF00);
			powerUpAudio.play();
			changeHP(50);

		break;

        default:

            explosionParticleHandler.addExplosion(itemHitBoxes[itemNumber].position, 5, 0x6495ED);
        break;
	}



    scene.remove(powerUps[itemNumber]);
    scene.remove(itemHitBoxes[itemNumber]);

    itemHitBoxes.splice(itemNumber, 1);
    powerUps.splice(itemNumber, 1);
    types.splice(itemNumber, 1);





}

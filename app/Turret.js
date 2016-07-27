
var rotupdn = 0;
var leftrgt = 0;

var up = false;
var down = false;
var left = false;
var right = false;
var weaponTurret;


function Turret(){

    return{

        init:function(){
            var tur = new THREE.BoxGeometry(2,5,2);
            tur.translate(0,-5,0);
            var material = new THREE.MeshBasicMaterial({color: 0xffffff});
            weaponTurret = new THREE.Mesh(tur,material);
            weaponTurret.position.set(0,0,0);


            ship.add(weaponTurret);


            var tkdown = function(event) {

                switch (event.keyCode) {
                    case 73:
                        up = true;
                        break;
                    case 74:
                        left = true;
                        break;
                    case 75:
                        down = true;
                        break;
                    case 76:
                        right = true;
                }
            };

            var tkup = function(event) {

                switch (event.keyCode) {
                    case 73:
                        up = false;
                        break;
                    case 74:
                        left = false;
                        break;
                    case 75:
                        down = false;
                        break;
                    case 76:
                        right = false;
                }
            };

            window.addEventListener('keydown', tkdown);
            window.addEventListener('keyup', tkup);
        },
        move:function() {

            if (up == true && rotupdn > -5) {
                rotupdn--;

            }
            if (down == true && rotupdn < 5) {
                rotupdn++;

            }
            if (left == true && leftrgt < 5) {
                leftrgt++;
            }
            if (right == true && leftrgt > -5) {
                leftrgt--;
            }
            if (rotupdn > 0) {
                rotupdn -= 0.5;
            } else if (rotupdn < 0) {
                rotupdn += 0.5;
            }

            if (leftrgt > 0) {
                leftrgt -= 0.5;
            } else if (leftrgt < 0) {
                leftrgt += 0.5;
            }
            //console.log("HEllo");
            if (weaponTurret.rotation.x < 1.6 && weaponTurret.rotation.x > -1.6) {
                weaponTurret.rotateX(rotupdn / 30);
            }else if(weaponTurret.rotation.x <= -1.6 && rotupdn > 0){
                weaponTurret.rotateX(rotupdn / 30);
            }else if(weaponTurret.rotation.x >= 1.6 && rotupdn < 0){
                weaponTurret.rotateX(rotupdn / 30);
            }
            if (weaponTurret.rotation.z < 1.6 && weaponTurret.rotation.z > -1.6) {
                weaponTurret.rotateZ(leftrgt / 30);
                //console.log("Test1");
            }else if(weaponTurret.rotation.z <= -1.6 && leftrgt > 0){
                //console.log("Test2");
                weaponTurret.rotateZ(leftrgt / 30);
            }else if(weaponTurret.rotation.z >= 1.6 && leftrgt < 0){
              //  console.log("Test3");
                weaponTurret.rotateZ(leftrgt / 30);
            }
            //console.log("LeftRight: " + leftrgt + "  UpDown: " + rotupdn);
            console.log(weaponTurret.rotation);
            //weaponTurret.rotation.setY = 0;
            //if (weaponTurret.rotation.y <= 1){
               // weaponTurret.rotateZ(leftrgt / 30);
            //}else if(weaponTurret.rotation.y <= 1)
            //console.log(weaponTurret.rotation);
        }

    }
}



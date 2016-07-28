
var rotupdn = 0;
var leftrgt = 0;

var up = false;
var down = false;
var left = false;
var right = false;
var weaponTurret;
var refPoint;


function Turret(){

    return{

        init:function(){
            var tur = new THREE.BoxGeometry(2,5,2);
            tur.translate(0,-5,0);
            var material = new THREE.MeshBasicMaterial({color: 0xffffff});
            weaponTurret = new THREE.Mesh(tur,material);
            weaponTurret.position.set(0,0,0);
            ship.add(weaponTurret);

            var refe = new THREE.SphereGeometry(0.1,10,10);
            var smaterial = new THREE.MeshBasicMaterial({

                transparent: true,
                color: 0xffffff
            });
            refPoint = new THREE.Mesh(refe,smaterial);
            refPoint.position.set(0,-5,0);
            weaponTurret.add(refPoint);




            var tkdown = function(event) {

                switch (event.keyCode) {
                    case 73:
                        down = true;
                        break;
                    case 74:
                        right = true;
                        break;
                    case 75:
                        up = true;
                        break;
                    case 76:
                        left = true;
                }
            };

            var tkup = function(event) {

                switch (event.keyCode) {
                    case 73:
                        down = false;
                        break;
                    case 74:
                        right = false;
                        break;
                    case 75:
                        up = false;
                        break;
                    case 76:
                        left = false;
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
            
            if (weaponTurret.rotation.x < 1.4 && weaponTurret.rotation.x > -1.4) {
                weaponTurret.rotateX(rotupdn / 30);
            }else if(weaponTurret.rotation.x <= -1.4 && rotupdn > 0){
                weaponTurret.rotateX(rotupdn / 30);
            }else if(weaponTurret.rotation.x >= 1.4 && rotupdn < 0){
                weaponTurret.rotateX(rotupdn / 30);
            }
            
            if (weaponTurret.rotation.z < 1.4 && weaponTurret.rotation.z > -1.4) {
                weaponTurret.rotateZ(leftrgt / 30);
            }else if(weaponTurret.rotation.z <= -1.4 && leftrgt > 0){
                weaponTurret.rotateZ(leftrgt / 30);
            }else if(weaponTurret.rotation.z >= 1.4 && leftrgt < 0){
                weaponTurret.rotateZ(leftrgt / 30);
            }
            weaponTurret.rotation.set(weaponTurret.rotation.x,0,weaponTurret.rotation.z);
            
        }

    }
}



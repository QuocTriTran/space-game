
var targetPosition;
var moveForward;
var moveBackward;
var moveLeft;
var moveRight;
var moveUp;
var moveDown;
var zAxis = 0;
var xAxis = 0;
var yAxis = 0;

var directionVector = new THREE.Vector4(0,0,0,1);
var Pause = true;
var PauseScreen = false;
var isFirstPerson = false;

var Sensitivity = 0.2;
var maxVel = 14;
var maxDrift = 5;

var mouseX = 0;
var mouseY = 0;
var target = new THREE.Vector3(0,0,0);


var lat = 0;
var lon = 0;
var phi = 0;
var theta = 0;



function Movement() {

    return {

        init:function() {


            setMaxSpeed(14);
            var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
            var blocker = document.getElementById('block');
            var instructions = document.getElementById('splash');

            if (havePointerLock) {

                var element = document.body;

                var pointerlockchange = function (event) {
                    toggleWeapons();
                    if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {

                        blocker.style.display = 'none';
                        document.addEventListener('mousemove', moveCallback, false);
                       //
                        Pause = false;
                        Camera().endOrbit();

                    } else {
                        if(PauseScreen == true){
                            Camera().doOrbit();
                        }else{
                            blocker.style.display = '-webkit-box';
                            blocker.style.display = '-moz-box';
                            blocker.style.display = 'box';
                            instructions.style.display = '';
                            window.removeEventListener('keydown', kdown);
                            window.removeEventListener('keyup', kup);
                        }
                        Pause = true;
                        Camera().doOrbit();
                        document.removeEventListener('mousemove', moveCallback, false);



                    }

                };

                var pointerlockerror = function (event) {

                    instructions.style.display = '';

                };

                // Hook pointer lock state change events
                document.addEventListener('pointerlockchange', pointerlockchange, false);
                document.addEventListener('mozpointerlockchange', pointerlockchange, false);
                document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

                document.addEventListener('pointerlockerror', pointerlockerror, false);
                document.addEventListener('mozpointerlockerror', pointerlockerror, false);
                document.addEventListener('webkitpointerlockerror', pointerlockerror, false);

                instructions.addEventListener('click', function (event) {

                    instructions.style.display = 'none';
                    blocker.style.display = 'none';
                    Pause = false;

                    // Ask the browser to lock the pointer
                    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

                    if (/Firefox/i.test(navigator.userAgent)) {

                        var fullscreenchange = function (event) {

                            if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

                                document.removeEventListener('fullscreenchange', fullscreenchange);
                                document.removeEventListener('mozfullscreenchange', fullscreenchange);
                                document.removeEventListener('mousemove', moveCallback, false);
                                element.requestPointerLock();
                            }

                        };

                        document.addEventListener('fullscreenchange', fullscreenchange, false);
                        document.addEventListener('mozfullscreenchange', fullscreenchange, false);
                        document.addEventListener('mousemove', moveCallback, false);
                        window.addEventListener('keydown', kdown);
                        window.addEventListener('keyup', kup);
                        console.log("Added Event Listener");

                        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

                        element.requestFullscreen();

                    } else {

                        window.addEventListener('keydown', kdown);
                        window.addEventListener('keyup', kup);
                        element.requestPointerLock();

                    }

                }, false);

            } else {

                instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

            }
            var kdown = function(event){
                switch(event.keyCode){
                    case 38:
                    case 87:
                        moveForward = true;
                        break;
                    case 40:
                    case 83:
                        moveBackward = true;
                        break;
                    case 65:
                    case 37:
                        moveLeft = true;
                        break;
                    case 68:
                    case 39:
                        moveRight = true;
                        break;
                    case 82:
                        moveUp = true;
                        break;
                    case 70:
                        moveDown = true;

                }



            };

            var kup = function(event){
                switch(event.keyCode){
                    case 38:
                    case 87:
                        moveForward = false;
                        break;
                    case 40:
                    case 83:
                        moveBackward = false;
                        break;
                    case 65:
                    case 37:
                        moveLeft = false;
                        break;
                    case 68:
                    case 39:
                        moveRight = false;
                        break;
                    case 82:
                        moveUp = false;
                        break;
                    case 70:
                        moveDown = false;
                        break;
                    case 67:
                        changeCam();
                        break;
                    case 88:
                        stop();
                        break;
                    case 80:
                        if(Pause){
                            PauseScreen = false;
                            interface.toggleMenuOverlay();
                            Movement().lockPointer();

                        }else{

                            interface.toggleMenuOverlay();
                            Movement().unlockPointer();
                            PauseScreen = true;
                        }
                        break;
                    case 86:
                        crosshair.switch();


                }

            };

           window.addEventListener('keydown', kdown);
           window.addEventListener('keyup', kup);




        },



        move:function(delta) {
            //console.log(delta);

            if (moveForward == true && yAxis > -maxVel) {
                yAxis--;
                setSpeed(-yAxis);
            }
            if (moveBackward == true && yAxis < -2) {
                yAxis++;
                setSpeed(-yAxis);

            }
            if (moveLeft == true && zAxis < maxDrift) {
                zAxis++;
            }
            if (moveRight == true && zAxis > -maxDrift) {
                zAxis--;
            }
            if (zAxis > 0) {
                zAxis -= 0.5;
            } else if (zAxis < 0) {
                zAxis += 0.5;
            }
            ship.translateZ(yAxis);
            
            ship.translateX(-zAxis);

            sphere.position.set(ship.position.x,ship.position.y,ship.position.z);
            biggerSphere.position.set(ship.position.x,ship.position.y,ship.position.z);


            mouseX *= Sensitivity;
            mouseY *= Sensitivity;
            lon += mouseX;
            lat -= mouseY;

            lat = Math.max(-85, Math.min(70, lat));
            phi = THREE.Math.degToRad(90 - lat);
            theta = THREE.Math.degToRad(lon);

            targetPosition = target;
            var position = ship.position;

            targetPosition.x = position.x + 100 * Math.sin(phi) * Math.cos(theta);
            targetPosition.y = position.y + 100 * Math.cos(phi);
            targetPosition.z = position.z + 100 * Math.sin(phi) * Math.sin(theta);
            ship.lookAt(targetPosition);
            turret.move();
        },

        unlockPointer:function(){

            var element = document.body;
            if(document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
                document.exitPointerLock();
            }
        },

        lockPointer:function(){
            var element = document.body;

            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
            element.requestPointerLock();


        }
    }
}

function moveCallback(event){
    mouseX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    mouseY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

}

function changeCam(){
    console.log(camera.currentTargetName);
    if(camera.currentTargetName == 'Target' ){
        isFirstPerson = true;
        crosses[pos].position.set(0,0,-40);
        camera.setTarget('Cockpit');
    }else{
        isFirstPerson = false;
        crosses[pos].position.set(0,10,-40);
        camera.setTarget('Target');
    }
}

function stop(){
    xAxis = 0.0;
    yAxis = -2.0;
    zAxis = 0.0;
    setSpeed(0.0);
    mouseX = 0.0;
    mouseY = 0.0;
}

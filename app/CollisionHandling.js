function handleAsteroids() {

    for (var i = 0; i <= asteroids.length - 2; i++) {

        // Asteroidenkollision
        for (var j = i+1; j <= asteroids.length - 1; j++) {
            if (collision.intersectSphereOther(asteroidHitBoxes[i],
                    asteroidHitBoxes[j])) {
                asteroidCollision(i, j);
            }
        }
        // Kollision mit Player
        for (var j = 0; j <= playerHitBoxes.length - 1; j++) {

            // playerHitBoxes[j].applyMatrix(ship.matrix);

            if (collision.intersectSphereShipHitBox(asteroidHitBoxes[i],
                    playerHitBoxes[j])) {
                destroyAsteroid(i);
                // asteroidHitBySpaceship(i);
                player.playerHitByAsteroid();
            }
        }


        // Kollision mit Gegner
        // for (var j = 0; j < enemies.length - 1; j++) {
        //     var enemyHitboxes = getEnemyHitboxes(enemies[j]);
        //     for (var k = 0; i <= enemyHitboxes.length - 1; k++) {
        //         if (collision.intersectSphereBox(asteroids[i], enemyHitboxes[k])) {
        //             asteroidHitBySpaceship(asteroids[i]);
        //             enemyHitbyAsteroid(enemies[j]);
        //         }
        //
        // }

    }

}


function handleProjectiles() {
    // for every projectile
    for (var i = 0; i <= projectiles.length - 1; i++) {

        // Asteroidentreffer

        for (var j = 0; j <= asteroidHitBoxes.length - 1; j++) {

            if (projectiles[i].name === "LaserHitBox") {
                if (collision.intersectSphereCylinder(asteroidHitBoxes[j],
                        projectiles[i])) {
                    // successLaser(projectiles[i]);
                    hitAsteroid(j, "Laser");
                }
            }

            else if (projectiles[i].name === "RocketHitBox") {
                if (collision.intersectSphereCylinder(asteroidHitBoxes[j],
                        projectiles[i])) {
                    // successRocket(projectiles[i]);
                    hitAsteroid(j, "Rocket");
                }
            }

            else if (projectiles[i].name === "Explosion") {
                if (collision.intersectSphereOther(asteroidHitBoxes[j],
                        projectiles[i])) {
                    hitAsteroid(j, "Explosion");
                }
            }

            else if (projectiles[i].name === "MachineGun") {
                if (collision.intersectSphereOther(asteroidHitBoxes[j],
                        projectiles[i])) {
                    // successMachineGunBullet(projectiles[i]);
                    destroyAsteroid(j);
                }
            }

        }

        // // Collect items via projectiles
        // for (var j = 0; j <= itemHitBoxes.length - 1; j++) {

        //     if (projectiles[i].name === "LaserHitBox") {
        //         if (collision.intersectBoxCylinder(itemHitBoxes[j],
        //                 projectiles[i])) {
        //             // successLaser(projectiles[i]);
        //             console.log("Collision detected");
        //             collected(j);
        //         }
        //     }

        //     else if (projectiles[i].name === "RocketHitBox") {
        //         if (collision.intersectBoxCylinder(itemHitBoxes[j],
        //                 projectiles[i])) {
        //             // successRocket(projectiles[i]);
        //             console.log("Collision detected");
        //             collected(j);
        //         }
        //     }

        //     else if (projectiles[i].name === "Explosion") {
        //         if (collision.intersectSphereBox(itemHitBoxes[j],
        //                 projectiles[i])) {
        //             console.log("Collision detected");
        //             collected(j);
        //         }
        //     }

        //     else if (projectiles[i].name === "MachineGun") {
        //         if (collision.intersectSphereBox(itemHitBoxes[j],
        //                 projectiles[i])) {
        //             // successMachineGunBullet(projectiles[i]);
        //             console.log("Collision detected");
        //             collected(j);
        //         }
        //     }

        // }


        // Gegner wird getroffen
        // for (var j = 0; j < enemies.length - 1; j++) {

        //     var enemyHitboxes = getEnemyHitboxes(enemies[j]);
        //     for (var k = 0; i <= enemyHitboxes.length - 1; k++) {

        //         if (projectiles[i].name === "Laser") {
        //             if (intersectBoxCylinder(enemyHitboxes[k], projectiles[i])) {
        //                 successLaser(projectiles[i]);
        //                 enemyHitByLaser(enemies[j]);
        //             }
        //         }

        //         else if (projectiles[i].name === "EnemyLaser") {
        //             if (intersectBoxCylinder(enemyHitboxes[k], projectiles[i])) {
        //                 successLaser(projectiles[i]);
        //                 enemyHitByLaser(enemies[j]);
        //             }
        //         }

        //         else if (projectiles[i].name === "Rocket") {
        //             if (intersectBoxCylinder(enemyHitboxes[k], projectiles[i])) {
        //                 successRocket(projectiles[i]);
        //             }
        //         }

        //         else if (projectiles[i].name === "Explosion") {
        //             if (intersectSphereBox(projectiles[i], enemyHitboxes[k])) {
        //                 enemyHitByExplosion(enemyHitboxes[k]);

        //             }
        //         }

        //         else if (projectiles[i].name === "MachineGun") {
        //             if (intersectSphereBox(projectiles[i], enemyHitboxes[k])) {
        //                 successMachineGunBullet(projectiles[i]);
        //                 enemyHitByMachineGun(enemies[j]);
        //             }
        //         }
        //     }

        // }

        // Player wird getroffen
        // Player kann nicht von den eigenen Projektilen getroffen werden,
        // da diese schneller fliegen (sollen!!!) als der Player selbst
        // var playerHitboxes = getPlayerHitboxes();
        // for (var j = 0; j < getPlayerHitboxes.length - 1; j++) {

        //     if (projectiles[i].name === "Explosion") {
        //         if (intersectSphereOther(getAsteroidHitbox(asteroids[j]),
        //                 projectiles[i])) {
        //             playerHitByExplosion();

        //         }
        //     }

        //     else if (projectiles[i].name === "EnemyLaser") {
        //         if (intersectBoxCylinder(getPlayerHitboxes[j], projectiles[i])) {
        //             successLaser(projectiles[i]);
        //             playerHitByLaser();
        //         }
        //     }

        // }


    }
}


function handlePlayerEnemyCollision() {
    // var playerHitboxes = getPlayerHitboxes();
    // for (var i = 0; i <= playerHitboxes.length - 1; i++) {
    //     for (var j = 0; j <= enemies.length; j++) {
    //         var enemyHitboxes = getEnemyHitboxes(enemies[j]);
    //         for (var k = 0; i <= enemyHitboxes.length - 1; k++) {
    //             if (intersectBoxBox(playerHitboxes[i], enemyHitboxes[k])) {
    //                 playerEnemyCollision();
    //                 enemyPlayerCollision(enemies[j]);
    //             }
    //         }
    //     }
    // }
}


function handleEnemyEnemyCollision() {
    // for (var i = 0; i <= enemies.length - 2; i++) {
    //     var enemyHitboxes1 = getEnemyHitboxes(enemies[i]); {
    //         for (var j = 0; j < enemyHitboxes1.length; j++) {
    //             for (var k = i+1; k <= enemies.length - 1; k++) {
    //                 var enemyHitboxes2 = getEnemyHitboxes(enemies[k]);
    //                 for (var l = 0; l < enemyHitboxes2.length; l++) {
    //                     if (intersectBoxBox(enemyHitboxes1[j], enemyHitboxes2[l])) {
    //                         enemyEnemyCollision(enemies[i], enemies[k]);
    //                     }
    //                 }
    //             }
    //         }

    //     }
    // }
}


function handlePlayerPopupCollision() {
    for (var i = 0; i < playerHitBoxes.length; i++) {
        for (var j = 0; j < itemHitBoxes.length; j++) {
            if (collision.intersectShipHitBoxBox(playerHitBoxes[i],
                    itemHitBoxes[j])) {
                console.log("Collision detected");
                collected(j);
            }
        }
    }
}

function handleCollision() {

    handlePlayerPopupCollision();
    handleAsteroids();
    handleProjectiles();
    //handlePlayerEnemyCollision();
    //handleEnemyEnemyCollision();

}

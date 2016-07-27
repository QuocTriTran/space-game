var Collision = function() {

    // Calculates the min x value of the vertices of a box
    function minX(box) {
        // array for x values
        var globalXs = [];
        // get the position of each vertex
        for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
            {
                // get the local position of the vertex
                var localVertex = box.geometry.vertices[vertexIndex].clone();
                // transform it into the global position
                var globalVertex = localVertex.applyMatrix4( box.matrix );
                // save x value
                globalXs.push(globalVertex.x);
            }
        // return the min
        return Math.min.apply(Math, globalXs);
    }

    // Calculates the max X value of the vertices of a box
    function maxX(box) {
        var globalXs = [];
        for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
            {
                var localVertex = box.geometry.vertices[vertexIndex].clone();
                var globalVertex = localVertex.applyMatrix4( box.matrix );
                globalXs.push(globalVertex.x);
            }
        return Math.max.apply(Math, globalXs);
    }

    // Calculates the min Y value of the vertices of a box
    function minY(box) {
        var globalYs = [];
        for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
            {
                var localVertex = box.geometry.vertices[vertexIndex].clone();
                var globalVertex = localVertex.applyMatrix4( box.matrix );
                globalYs.push(globalVertex.y);
            }
        return Math.min.apply(Math, globalYs);
    }

    // Calculates the max Y value of the vertices of a box
    function maxY(box) {
        var globalYs = [];
        for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
            {
                var localVertex = box.geometry.vertices[vertexIndex].clone();
                var globalVertex = localVertex.applyMatrix4( box.matrix );
                globalYs.push(globalVertex.y);
            }
        return Math.max.apply(Math, globalYs);
    }

    // Calculates the min Z value of the vertices of a box
    function minZ(box) {
        var globalZs = [];
        for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
            {
                var localVertex = box.geometry.vertices[vertexIndex].clone();
                var globalVertex = localVertex.applyMatrix4( box.matrix );
                globalZs.push(globalVertex.z);
            }
        return Math.min.apply(Math, globalZs);
    }

    // Calculates the max Z value of the vertices of a box
    function maxZ(box) {
        var globalZs = [];
        for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
            {
                var localVertex = box.geometry.vertices[vertexIndex].clone();
                var globalVertex = localVertex.applyMatrix4( box.matrix );
                globalZs.push(globalVertex.z);
            }
        return Math.max.apply(Math, globalZs);
    }













    // Calculates the min x value of the vertices of a box
    function minXship(box) {
        // array for x values
        var globalXs = [];
        // get the position of each vertex
        for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
            {
                globalXs.push(box.geometry.vertices[vertexIndex].x + ship.position.x);
            }
        // return the min
        return Math.min.apply(Math, globalXs);
    }

    // Calculates the max X value of the vertices of a box
    function maxXship(box) {
        var globalXs = [];
        for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
            {
                globalXs.push(box.geometry.vertices[vertexIndex].x + ship.position.x);
            }
        return Math.max.apply(Math, globalXs);
    }

    // Calculates the min Y value of the vertices of a box
    function minYship(box) {
        var globalYs = [];
        for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
            {
                globalYs.push(box.geometry.vertices[vertexIndex].y + ship.position.y);
            }
        return Math.min.apply(Math, globalYs);
    }

    // Calculates the max Y value of the vertices of a box
    function maxYship(box) {
        var globalYs = [];
        for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
            {
                globalYs.push(box.geometry.vertices[vertexIndex].y + ship.position.y);
            }
        return Math.max.apply(Math, globalYs);
    }

    // Calculates the min Z value of the vertices of a box
    function minZship(box) {
        var globalZs = [];
        for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
            {
                globalZs.push(box.geometry.vertices[vertexIndex].z + ship.position.z);
            }
        return Math.min.apply(Math, globalZs);
    }

    // Calculates the max Z value of the vertices of a box
    function maxZship(box) {
        var globalZs = [];
        for (var vertexIndex = 0; vertexIndex < box.geometry.vertices.length; vertexIndex++)
            {
                globalZs.push(box.geometry.vertices[vertexIndex].z + ship.position.z);
            }
        return Math.max.apply(Math, globalZs);
    }















    // Checks if there is an intersection between two boxes
    function intersectBoxBox(a,b) {
        // if there is an intersection in every dimension the two boxes intersect
        return (minX(a) <= maxX(b) && maxX(a) >= minX(b) &&
            (minY(a) <= maxY(b) && maxY(a) >= minY(b)) &&
            (minZ(a) <= maxZ(b) && maxZ(a) >= minZ(b)))
    }

    // Checks if there is an intersection between two spheres
    function intersectSphereOther(sphere, other) {
        // distance between the center of the spheres
        var distance = Math.sqrt((sphere.position.x - other.position.x) *
                (sphere.position.x - other.position.x) +
                (sphere.position.y - other.position.y) * (sphere.position.y - other.position.y) +
                (sphere.position.z - other.position.z) * (sphere.position.z - other.position.z));
        // if the distance between the centers is smaller the the sum of the
        // radii the spheres intersect

    //console.log(sphere.parameters.radius);
    // console.log(sphere.geometry.parameters.radius);
        return distance < (sphere.geometry.parameters.radius + other.geometry.parameters.radius);
    }

    // Checks if there is an intersection between  a sphere and a box
    function intersectSphereBox(sphere, box) {
        // get box closest point to sphere center by clamping
        var x = Math.max(minX(box), Math.min(sphere.position.x, maxX(box)));
        var y = Math.max(minY(box), Math.min(sphere.position.y, maxY(box)));
        var z = Math.max(minZ(box), Math.min(sphere.position.z, maxZ(box)));

        // distance between the sphere and the closest box-point to the spehere
        var distance = Math.sqrt((x - sphere.position.x) * (x - sphere.position.x) +
                           (y - sphere.position.y) * (y - sphere.position.y) +
                           (z - sphere.position.z) * (z - sphere.position.z));

        // if the distance is smaller than the radius of the sphere there is an intersection
        return distance < sphere.geometry.parameters.radius;
    }

    // CHecks if there is an intersection between a sphere and a cylinder.
    // Appoximates the cylinder as a box
    function intersectSphereCylinder(sphere, cylinder) {

        // approximate the cylinder as a box
        var hitBox = cylinderAsBox(cylinder);

        // check intersection
        var isIntersect = intersectSphereBox(sphere, hitBox);
        hitBox = undefined;

        return isIntersect;

    }

    // CHecks if there is an intersection between a box and a cylinder.
    // Appoximates the cylinder as a box
    function intersectBoxCylinder(box, cylinder) {

        // approximate the cylinder as a box
        var hitBox = cylinderAsBox(cylinder);

        // check intersection
        var isIntersect = intersectBoxBox(box, hitBox);
        hitBox = undefined;

        return isIntersect;

    }

    // Approximates a cylinder with a box
    function cylinderAsBox(cylinder) {

        // parameters for the box
        var x = cylinder.geometry.parameters.radiusTop * 2;
        var y = cylinder.geometry.parameters.height;
        var z = cylinder.geometry.parameters.radiusTop * 2;

        // initialize box
        var boxGeometry = new THREE.BoxGeometry(x,y,z);
        var boxMaterial = new THREE.MeshBasicMaterial({ color:0x00FF00 });
        var hitBox = new THREE.Mesh(boxGeometry, boxMaterial);

        // transform box to the position of the cylinder
        hitBox.applyMatrix(cylinder.matrix);

        return hitBox;
    }

    // Checks if one of the ShipHitboxes intersects a sphere
    function intersectSphereShipHitBox(sphere, box) {
      // get box closest point to sphere center by clamping
        var x = Math.max(minXship(box), Math.min(sphere.position.x, maxXship(box)));
        var y = Math.max(minYship(box), Math.min(sphere.position.y, maxYship(box)));
        var z = Math.max(minZship(box), Math.min(sphere.position.z, maxZship(box)));

        // distance between the sphere and the closest box-point to the spehere
        var distance = Math.sqrt((x - sphere.position.x) * (x - sphere.position.x) +
                           (y - sphere.position.y) * (y - sphere.position.y) +
                           (z - sphere.position.z) * (z - sphere.position.z));

        // console.log(distance);
        // console.log(sphere.geometry.parameters.radius);


        // if the distance is smaller than the radius of the sphere there is an intersection
        return distance < sphere.geometry.parameters.radius;
    }



    return {

        // returns whether there is an intersection between two boxes
        intersectBoxBox: intersectBoxBox,
        // returns whether there is an intersection between two spheres
        intersectSphereOther: intersectSphereOther,
        // returns whether there is an intersection between a sphere and a box
        intersectSphereBox: intersectSphereBox,
        // returns whether there is an intersection between a sphere and a cylinder
        intersectSphereCylinder: intersectSphereCylinder,
        // returns whether there is an intersection between a box and a cylinder
        intersectBoxCylinder: intersectBoxCylinder,
        // returns whether there is an intersection between a sphere and a shipHitBox
        intersectSphereShipHitBox: intersectSphereShipHitBox,

        // returns wheter there is a collision between a spehere and any other mesh
        // that is collidable
        sphereCollision: function(sphere) {
            for (var i = 0; i <= collidableMeshList.length - 1; i++) {
                // to prevent collision with itself
                if(sphere !== collidableMeshList[i]) {
                    // collision with a box
                    if(collidableMeshList[i].geometry.type === "BoxGeometry") {
                        if(intersectSphereBox(sphere, collidableMeshList[i])) {
                            return true;
                        }
                    }
                    // collision with another sphere
                    else if(collidableMeshList[i].geometry.type === "SphereGeometry") {
                        if(intersectSphereOther(sphere, collidableMeshList[i])) {
                            return true;
                        }
                    }

                }
            }
            return false;

        },

        // returns wheter there is a collision between a box and any other mesh
        // that is collidable
        boxCollision: function(box) {
            for (var i = 0; i <= collidableMeshList.length - 1; i++) {
                // to prevent collision with itself
                if (box !== collidableMeshList[i]) {
                    // collision with another box
                    if (collidableMeshList[i].geometry.type === "BoxGeometry") {
                        if (intersectBoxBox(box, collidableMeshList[i])) {
                            return true;
                        }
                    }
                    // collision with a sphere
                    else if(collidableMeshList[i].geometry.type === "SphereGeometry") {
                        if (intersectSphereBox(collidableMeshList[i], box)) {
                            return true;
                        }
                    }

                }
            }

        }


    }


}

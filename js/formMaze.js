var scene, camera, renderer;
var geometry, material, mesh, mazeGroup, mazeArr, mazeStack;
var mazeSize, cellSize;
var currentX, currentY;

init();
animate();

// Create individual cells
function mazeGroupInit(newGroup) {
	for (var i = 0; i < mazeSize; i++) {
		for (var j = 0; j < mazeSize; j++) {
			geometry = new THREE.BoxGeometry( cellSize, cellSize, cellSize );
			material = new THREE.MeshNormalMaterial();
			mesh = new THREE.Mesh( geometry, material );
			mesh.position.setX(j*cellSize-(mazeSize*cellSize/2));
			mesh.position.setY(i*cellSize-(mazeSize*cellSize/2));
			mesh.name = i+""+j;
			//console.log(mesh);
			newGroup.add(mesh);
		}
	}
}

/* Create the maze corridors
* Two containers are being manipulated: the array that keeps track of which cells are visited,
* and the Group of meshes that are rendered.
*
* Due to the structure of the maze, two-cell leaps need to be made, so two cells are actually visited
* each move.
*/
function formMaze(x, y) {
	var cell = mazeArr[x][y];
	var direction = [1,2,3,4];
	shuffle(direction);
	console.log(direction);
	var cellMesh;
	for (var i = 0; i < direction.length; i++) {	// Pick a random direction
		switch (direction[i]) {
		case 1: // Up
			if (x-2 <= 0)
				continue;
			if (!mazeArr[x-2][y].visited) { // If neighboring cell hasn't been visited...
				mazeArr[x-2][y].visited = true;	// ...mark it as such...
				cellMesh = mazeGroup.getObjectByName((x-2)+""+y);
				mazeGroup.remove(cellMesh);	// ....and get rid of its rendered representation
				mazeArr[x-1][y].visited = true;
				cellMesh = mazeGroup.getObjectByName((x-1)+""+y);
				mazeGroup.remove(cellMesh);
				formMaze(x-2, y);
			}
		case 2: // Right
			if (y+2 >= (mazeSize-1))
				continue;
			if (!mazeArr[x][y+2].visited) {
				mazeArr[x][y+2].visited = true;
				cellMesh = mazeGroup.getObjectByName(x+""+(y+2));
				mazeGroup.remove(cellMesh);
				mazeArr[x][y+1].visited = true;
				cellMesh = mazeGroup.getObjectByName(x+""+(y+1));
				mazeGroup.remove(cellMesh);
				formMaze(x, y+2);
			}
		case 3: // Down
			if ( x+2 >= (mazeSize-1))
				continue;
			if (!mazeArr[x+2][y].visited) {
				mazeArr[x+2][y].visited = true;
				cellMesh = mazeGroup.getObjectByName((x+2)+""+y);
				mazeGroup.remove(cellMesh);
				mazeArr[x+1][y].visited = true;
				cellMesh = mazeGroup .getObjectByName((x+1)+""+y);
				mazeGroup.remove(cellMesh);
				formMaze(x+2, y);
			}
		case 4:
			if (y-2 <= 0)
				continue;
			if (!mazeArr[x][y-2].visited) {
				mazeArr[x][y-2].visited = true;
				cellMesh = mazeGroup.getObjectByName(x+""+(y-2));
				mazeGroup.remove(cellMesh);
				mazeArr[x][y-1].visited = true;
				cellMesh = mazeGroup.getObjectByName(x+""+(y-1));
				mazeGroup.remove(cellMesh);
				formMaze(x, y-2);
			}
		}
	}
}


// Fisher-Yates Shuffle
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function init() {
	mazeSize = 13;
	cellSize = 50;

	currentX, currentY = 0;

	// Create cell indices list
	mazeArr = new Array();
	for (var i = 0; i < mazeSize; i++) {
		mazeArr[i] = new Array();
		for (var j = 0; j < mazeSize; j++) {
			var cell = {visited: false};
			mazeArr[i][j] = cell;
		}
	}


	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;

	// Lighting
	var ambient = new THREE.AmbientLight(0x555555);
	scene.add(ambient);

	var light = new THREE.DirectionalLight(0xffffff);
	light.position = camera.position;
	scene.add(light);


	// Group to contain all cells
	mazeGroup = new THREE.Group();
	mazeGroupInit(mazeGroup);
	scene.add(mazeGroup);

	currentX = Math.floor(Math.random()*10+1);
	currentY = Math.floor(Math.random()*10+1);
	formMaze(currentX, currentY);


	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	document.body.appendChild( renderer.domElement );

}

function animate() {

	requestAnimationFrame( animate );
	
	mazeGroup.rotation.x += 0.01;
	mazeGroup.rotation.y += 0.01;

	renderer.render( scene, camera );

}

let canvasMouseIsPressed = false;
let canvas;
let shapes = [];
let currentShape;
let jsonTextP;

function setup() {
	canvas = createCanvas(550, 550); //Taille du canvas
	canvas.mousePressed(canvasMousePressed); //Verifie le clic de la souris dans le canvas
	canvas.mouseReleased(canvasMouseReleased); ////Verifie le relachement du clic de la souris dans le canvas

	canvasPanel = select("#canvas");
	canvas.parent(canvasPanel); //Ajoute le canvas dans la page

	epaisseurPanel = select("#epaisseur"); //Selectionne l'element html qui gère l'epaisseur des traits

	sizeSlider = createSlider(1, 50, 4, 1); //Slider de l'epaisseur des traits

	sizeSlider.parent(epaisseurPanel); //Ajoute le slider dans la page

	redPanel = select("#red"); //Selectionne l'element html qui gère la couleur rouge des traits
	greenPanel = select("#green"); //Selectionne l'element html qui gère la couleur verte des traits
	bluePanel = select("#blue"); //Selectionne l'element html qui gère la couleur bleue des traits

	redSlider = createSlider(0, 255, 0, 0.01); //Slider de la couleur rouge des traits
	greenSlider = createSlider(0, 255, 0, 0.01); //Slider de la couleur verte des traits
	blueSlider = createSlider(0, 255, 0, 0.01); //Slider de la couleur bleue des traits

	redSlider.parent(redPanel); //Ajoute le slider dans la page
	greenSlider.parent(greenPanel); //Ajoute le slider dans la page
	blueSlider.parent(bluePanel); //Ajoute le slider dans la page

	select("#clear").mousePressed(clearData); //Ajoute la fonction qui efface la page au bouton
	select("#undo").mousePressed(undo); //Ajoute la fonction "ctrl + z" au bouton
	select("#send").mousePressed(sendData); //Ajoute la fonction qui sauvegarde le dessin
	select("#load").mousePressed(loadData); //Ajoute la fonction qui charge un dessin

	circleCheck = select("#circle"); //Selectionne la checkbox pour créer des cerlces
	squareCheck = select("#square"); //Selectionne la checkbox pour créer des carrés
	lignCheck = select("#lign"); //Selectionne la checkbox pour créer des droites
	remplisCheck = select("#remplis"); //Selectionne la checkbox pour remplir les formes

	red2Panel = select("#red2"); //Selectionne l'element html qui gère la couleur rouge du remplissage
	green2Panel = select("#green2"); //Selectionne l'element html qui gère la couleur verte du remplissage
	blue2Panel = select("#blue2"); //Selectionne l'element html qui gère la couleur bleue du remplissage

	red2Slider = createSlider(0, 255, 0, 0.01); //Slider de la couleur rouge du remplissage
	green2Slider = createSlider(0, 255, 0, 0.01); //Slider de la couleur verte du remplissage
	blue2Slider = createSlider(0, 255, 0, 0.01); //Slider de la couleur bleue du remplissage

	red2Slider.parent(red2Panel); //Ajoute le slider dans la page
	green2Slider.parent(green2Panel); //Ajoute le slider dans la page
	blue2Slider.parent(blue2Panel); //Ajoute le slider dans la page

	textPanel = select("#textPanel");
	textZone = select("#textZone"); //Selectionne la zone de texte
	textSizes = createSlider(1, 64, 14, 1); //Slider de la taille du texte
	textSizes.parent(textPanel); //Ajoute le slider dans la page
	textCheck = select("#textCheck"); //Selectionne la checkbox pour ecrire du texte
}

//Fonction qui dessine dans la canvas toute les frames
function draw() {

	//Prévisualisation de la couleur du trait
	let c = color(redSlider.value(), greenSlider.value(), blueSlider.value())
	colorView = select("#colorView");
	colorView.style('background-color', c);

	//Prévisualisation de la couleur du remplissage
	let c2 = color(red2Slider.value(), green2Slider.value(), blue2Slider.value())
	colorView2 = select("#colorView2");
	colorView2.style('background-color', c2);

	//Prévisualisation de l'épaisseur du trait
	let e = sizeSlider.value()+'px';
	epaisseurView = select("#epaisseurView");
	epaisseurView.style('width', e);
	epaisseurView.style('height', e);
	epaisseurView.style('background-color', c);

	//Prévisualisation du texte
	let t = textSizes.value()+'px';
	textView = select("#textView");
	textView.html(textZone.value());
	textView.style('font-size', t);
	textView.style('color', c);

	background(255); //Couleur de fond du canvas

	//Si l'user veut faire un cercle
	if (circleCheck.checked()){
		if (canvasMouseIsPressed) {
			let c = {
				x: mouseX,
				y: mouseY
			};
			currentShape.circles.push(c);
		}
		
	}

	//Si l'user veut faire un carré
	else if (squareCheck.checked()){
		if (canvasMouseIsPressed) {
			let s = {
				x: mouseX,
				y: mouseY
			};
			currentShape.squares.push(s);
		}
	}

	//Si l'user veut faire une droite
	else if (lignCheck.checked()){
		if (canvasMouseIsPressed) {
			let l = {
				x: mouseX,
				y: mouseY
			};
			currentShape.lign.push(l);
		}
	}

	//Si l'user veut mettre du texte
	else if (textCheck.checked()){
		if (canvasMouseIsPressed) {
			let t = {
				x: mouseX,
				y: mouseY
			};
			currentShape.textCoord.push(t);
		}
	}

	//Si l'user veut tracer des points
	else if (canvasMouseIsPressed) {
		let p = {
			x: mouseX,
			y: mouseY
		};
		currentShape.points.push(p);
	}
	

	//Recupere les tableaux et les dessines
	for(let j = 0; j< shapes.length; j++) {
		let shape = shapes[j];
		stroke(shape.red, shape.green, shape.blue); //Couleur des traits
		strokeWeight(shape.size); //Epaisseur des traits
		
		if (shape.remplissage == false){
			noFill(); //Pas de remplissage
		}
		else {
			fill(shape.red2, shape.green2, shape.blue2); //Couleur du remplissage
		}
		
		beginShape(); //Commence le dessin

		//Dessine tous les points
		let points = shape.points;
		for (let i = 0; i < points.length; i++) {
			let p = points[i];
			vertex(p.x, p.y);
		}

		//Dessine toutes les droites
		let lign = shape.lign;
		if(lign.length >= 2) {
			line(lign[0].x, lign[0].y, lign[lign.length-1].x, lign[lign.length-1].y);
		}

		//Dessine tous les cercles
		let circle = shape.circles;
		if(circle.length >= 2) {
			ellipse(circle[0].x, circle[0].y, dist(circle[0].x, circle[0].y, circle[circle.length-1].x, circle[circle.length-1].y));
		}

		//Dessine tous les carrés
		let square = shape.squares;
		if(square.length >= 2) {
			rect(square[0].x, square[0].y, dist(square[0].x, square[0].y, square[square.length-1].x, square[square.length-1].y), dist(square[0].x, square[0].y, square[square.length-1].x, square[square.length-1].y));
		}

		//Met les textes
		let texts = shape.textCoord;
		if(texts.length > 0) {
			fill(c); //Rempli de la couleur du texte
			textFont('Georgia'); //Police d'écriture
			textSize(shape.sizeText); //Taille du texte
			strokeWeight(1); //Epaisseur des traits
			text(shape.textZone, texts[0].x, texts[0].y); //Ecrit le texte
		}

		endShape();//Fin du dessin
	}
}

//Lorsque la souris clique dans le canvas, créé un tableau d'information pour le dessin
function canvasMousePressed() {
	canvasMouseIsPressed = true;

	//Active ou non le remplissage
	if(remplisCheck.checked()){
		remplis = true;
	}
	else {
		remplis = false;
	}

	//Tableau d'information de données
	currentShape = { 
		points: [], //Tableau pour les points
		circles: [], //Tableau pour les cercles
		squares: [], //Tableau pour les carré
		lign: [], //Tableau pour les droites
		textCoord: [], //Coordonnées du texte
		size: sizeSlider.value(), //Epaisseur du trait
		red: redSlider.value(), //Couleur rouge du trait
		green: greenSlider.value(), //Couleur verte du trait
		blue: blueSlider.value(), //Couleur bleue du trait
		remplissage: remplis, //Remplis ou non
		red2: red2Slider.value(), //Couleur rouge du remplissage
		green2: green2Slider.value(), //Couleur verte du remplissage
		blue2: blue2Slider.value(), //Couleur bleue du remplissage
		textZone: textZone.value(), //Texte à écrire
		sizeText: textSizes.value(), //Taille du texte

	};
	shapes.push(currentShape); //Ajoute le tableau au tableau général

}

//Lorsque le clique souris est relaché, le notifie
function canvasMouseReleased() {
	canvasMouseIsPressed = false;
}

//Enlève la dernière donné du dessin
function undo() {
	shapes.splice(shapes.length-1, 1);
}

//Supprime le dessin
function clearData() {
	shapes = [];
}

//Gestion des checkbox
function lignClear(){
	document.getElementById("square").checked = false;
	document.getElementById("circle").checked = false;
	document.getElementById("textCheck").checked = false;
	document.getElementById("remplis").checked = false;
}

//Gestion des checkbox
function circleClear(){
	document.getElementById("square").checked = false;
	document.getElementById("lign").checked = false;
	document.getElementById("textCheck").checked = false;
	if(document.getElementById("square").checked == false && document.getElementById("circle").checked == false && document.getElementById("lign").checked == false){
		document.getElementById("remplis").checked = false;
	}
}

//Gestion des checkbox
function squareClear(){
	document.getElementById("lign").checked = false;
	document.getElementById("circle").checked = false;
	document.getElementById("textCheck").checked = false;
	if(document.getElementById("square").checked == false && document.getElementById("circle").checked == false && document.getElementById("lign").checked == false){
		document.getElementById("remplis").checked = false;
	}
}

//Gestion des checkbox
function fillVerif(){
	if(document.getElementById("square").checked == false && document.getElementById("circle").checked == false && document.getElementById("lign").checked == false){
		document.getElementById("remplis").checked = false;
	}
}


function textClear(){
	document.getElementById("lign").checked = false;
	document.getElementById("circle").checked = false;
	document.getElementById("square").checked = false;
	if(document.getElementById("square").checked == false && document.getElementById("circle").checked == false && document.getElementById("lign").checked == false){
		document.getElementById("remplis").checked = false;
	}
}

//Envoie des données
function sendData() {
	fetch('http://cours.ardev.info/paint/index.php?action=send&author=' + author, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(shapes)
	})
	.then( response => {
		return response.json();
	})
	.then(responseJson => {
		select("#savingState").html("Saved with id: " + responseJson.id);
})
}

//Chargement des données
function loadData() {
	let id = select("#id").value();
  	fetch('http://cours.ardev.info/paint/index.php?action=getById&id=' + id)
  	.then( response => {
		return response.json();
  	})
  	.then(responseJson => {
	  	let d = responseJson.data;
	  	return JSON.parse(d);
  	})
  	.then(r => {
		shapes = r;
	})
}
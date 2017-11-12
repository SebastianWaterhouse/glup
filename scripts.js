var glupClickAdd = 1;
var glupSize = 194;
var gluphigh = 100;
var exponent = 1.2;
var parser, xmlDoc, text;
var vars = {};
var reqRes = {};
vars["glupAmt"] = 0;

function showGlup(){
	var c = document.getElementById("center");
	var ctx = c.getContext("2d");
	var glupIco = document.getElementById("glupico");
	ctx.fillStyle = "#BB5522";
	ctx.fillRect(0, 0, c.width, c.height)
	ctx.font="30pt Arial";
	ctx.fillStyle = "#773311";
	ctx.textAlign="center";
	ctx.fillText(((Math.round((vars["glupAmt"])*10)/10) + " Glup"), 350, 35);
	ctx.drawImage(glupIco, (c.width/2)-(glupSize/2), gluphigh, glupSize, glupSize);
};

function addGlup(){
	vars["glupAmt"] = vars["glupAmt"] + glupClickAdd;
	glupSize = glupSize * 1.1;
	gluphigh = gluphigh / 1.1;
	setTimeout(function(){
		glupSize = glupSize / 1.1;
		gluphigh = gluphigh * 1.1;
		showGlup();
	}, 50);
	showGlup();
};


text = "<resources>" +
	"<people>" +
		"<prerequisites>" +
			"<glupAmt>5</glupAmt>" +
		"</prerequisites>" +
		"<base-ingredients>" +
			"<glupAmt>10</glupAmt>" +
		"</base-ingredients>" +
		"<pproductionn>" +
			"<glupAmt>0.05</glupAmt>" +
		"</pproductionn>" +
	"</people>" +
	"<rockets>" +
		"<prerequisites>" +
			"<people>1</people>" +
		"</prerequisites>" +
		"<base-ingredients>" +
			"<glupAmt>30</glupAmt>" +
		"</base-ingredients>" +
	"</rockets>" +
	"<refined-glup>" +
		"<prerequisites>" +
			"<glupAmt>25</glupAmt>" +
			"<rockets>1</rockets>" +
		"</prerequisites>" +
		"<base-ingredients>" +
			"<glupAmt>50</glupAmt>" +
			"<rockets>1</rockets>" +
		"</base-ingredients>" +
	"</refined-glup>" +
"</resources>";

parser = new DOMParser();
xmlDoc = parser.parseFromString(text,"text/xml");

function shitinit(){
	vars["people"]=0;
	vars["rockets"]=0;
	vars["refined-glup"]=0;
}

function revealResource(targetr){
	document.getElementById(targetr).innerHTML = "you have " + eval(vars[targetr]) + " " + targetr + "<br><span style='margin:auto;'><button type='button' class='smolbuttons' onClick=\"resourceRefine(\'" + targetr + "\', 1)\">+1</button><button type='button' class='smolbuttons' onClick=\"resourceRefine(\'" + targetr + "\', 10)\">+10</button><button type='button' class='smolbuttons' onClick=\"resourceRefine(\'" + targetr + "\', 100)\">+100</button></span>";
	document.getElementById(targetr).classList.add("sublvl");
};

function updateResource(targetr){
	document.getElementById(targetr).innerHTML = "you have " + eval(vars[targetr]) + " " + targetr + "<br><span style='margin:auto;'><button type='button' class='smolbuttons' onClick=\"resourceRefine(\'" + targetr + "\', 1)\">+1</button><button type='button' class='smolbuttons' onClick=\"resourceRefine(\'" + targetr + "\', 10)\">+10</button><button type='button' class='smolbuttons' onClick=\"resourceRefine(\'" + targetr + "\', 100)\">+100</button></span>";

}

function resourceCheck(targetr){
	ready = true;
	var prereqs = xmlDoc.getElementsByTagName(targetr)[0].getElementsByTagName("prerequisites")[0].childNodes;
	for (i = 0; i <prereqs.length; i++) {
		if (prereqs[i].nodeType == 1) {
			if (vars[prereqs[i].nodeName] >= prereqs[i].childNodes[0].nodeValue) {
				console.log(prereqs[i].nodeName);
				console.log(vars[prereqs[i].nodeName]);
				console.log(prereqs[i].childNodes[0].nodeValue);
				console.log("hurrah!");
			} else {
				ready = false;
				console.log("nope");
			};
		};
	};
	if (ready == true) {
		revealResource(targetr);
		return true;
	};
};

function resourceRefine(targetro, coeff) {
	ready = true;
	console.log(targetro);
	console.log(coeff);
	var reqRess = xmlDoc.getElementsByTagName(targetro)[0].getElementsByTagName("base-ingredients")[0].childNodes;
	for (i = 0; i <reqRess.length; i++) {
		if (reqRess[i].nodeType == 1) {
			reqRes[reqRess[i].nodeName] = reqRess[i].childNodes[0].nodeValue;
			console.log(reqRes[reqRess[i].nodeName])
		};
	};
	console.log(reqRes);
	for (i = 0; i <reqRess.length; i++) {
		var backups = {};
		backups["backup" + i] = vars[reqRess[i].nodeName];
		console.log(reqRes[reqRess[i].nodeName]);
		console.log(reqRess[i].nodeName);
		console.log(i);
		reqRes[reqRess[i].nodeName] = reqRes[reqRess[i].nodeName] * coeff;
		console.log(reqRes[reqRess[i].nodeName]);
		if (reqRes[reqRess[i].nodeName] > vars[reqRess[i].nodeName]) {
			ready = false;
			console.log("sad");
		} else {
			console.log("ok?");
			console.log("need " + reqRes[reqRess[i].nodeName] + " " + reqRess[i].nodeName);
			console.log("have " + vars[reqRess[i].nodeName] + " " + reqRess[i].nodeName);
			console.log("will have " + (vars[reqRess[i].nodeName] - reqRes[reqRess[i].nodeName]) + " " + reqRess[i].nodeName)
			vars[reqRess[i].nodeName] = vars[reqRess[i].nodeName] - reqRes[reqRess[i].nodeName];
		};
	};
	console.log(backups);
	if (ready == true) {
		vars[targetro] = vars[targetro] + 1;
	} else {
		alert("Not enough resources!");
		for (i in backups){
			console.log(i)
			vars[reqRess[i].nodeName] = backups[i];
		};
	};
	updateResource(targetro);
	showGlup();
};

function superMegaLoop() {
	var resourceCounts = [];
	var revealedResources = []
	var resourceCountss = xmlDoc.getElementsByTagName("resources")[0].childNodes;
	for(var i = 0, n; n = resourceCountss[i]; ++i) resourceCounts.push(n);
	console.log(resourceCounts);
	setInterval(function(){
		showGlup();
		for (ri in resourceCounts) {
			console.log(ri);
			console.log(resourceCounts[ri].nodeName);
			resourceCheck(resourceCounts[ri].nodeName);
			if (resourceCheck(resourceCounts[ri].nodeName)){
				revealedResources.push(resourceCounts[ri].nodeName)
				resourceCounts.splice(resourceCounts.indexOf(resourceCounts[ri]), 1);
			};
		};
		console.log(revealedResources)
		for (ri = 0; ri< revealedResources.length; ri++) {
			console.log(revealedResources[ri]);
			updateResource(revealedResources[ri]);
			console.log("updated!");
		}
//		for (i =0; i<xmlDoc.getElementsByTagName("pproductionn").length; i++) {
//			prodss = xmlDoc.getElementsByTagName("pproductionn")[i];
//			console.log("prodss: " + prodss)
//			console.log("pproductionn length " + xmlDoc.getElementsByTagName("pproductionn").length);
//			for (a=0; a<prodss.childNodes.length; i++) {
//				prods = prodss.childNodes[a];
//				proda = prodss.parentNode.nodeName;
//				prod = prods.childNodes[0].nodeValue;
//				prodnom = prods.childNodes[0].nodeName;
//				prod = eval(proda) * prod;
//				vars[(eval(proda))] = ((vars[eval(proda)]) + prod);
//
//			};
//		};
//		console.log("increased?")
		console.log(xmlDoc.getElementsByTagName("pproductionn")[0].childNodes[0].childNodes[0].nodeValue)
		console.log(vars["people"])
		vars["glupAmt"] = vars["glupAmt"] + (vars["people"] * xmlDoc.getElementsByTagName("pproductionn")[0].childNodes[0].childNodes[0].nodeValue);
	}, 500);
}
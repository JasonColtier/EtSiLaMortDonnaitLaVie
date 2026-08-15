// dans un dossier TP1 dans le ftp

//chargement des eventlistener

document.getElementById("graine").addEventListener('click', moveObjetsBotaniques);
document.getElementById("pousse").addEventListener('click', moveObjetsBotaniques);
document.getElementById("arbre").addEventListener('click', moveObjetsBotaniques);
document.getElementById("arbreMini").addEventListener('click', moveObjetsBotaniques);
document.getElementById("bourgeon").addEventListener('click', moveObjetsBotaniques);
document.getElementById("fleur").addEventListener('click', moveObjetsBotaniques);
document.getElementById("fruit").addEventListener('click', moveObjetsBotaniques);

document.getElementById("excuse").addEventListener('click', deplaceMot);
document.getElementById("moi").addEventListener('click', deplaceMot);
document.getElementById("reviens").addEventListener('click', deplaceMot);
document.getElementById("mon").addEventListener('click', deplaceMot);
document.getElementById("chien").addEventListener('click', deplaceMot);
document.getElementById("je").addEventListener('click', deplaceMot);
document.getElementById("suis").addEventListener('click', deplaceMot);
document.getElementById("la").addEventListener('click', deplaceMot);

document.getElementById("oreille").addEventListener('click', jouerAudio);

document.getElementById("potion").addEventListener('click', addPotion);
document.getElementById("inventaire").addEventListener('click', returnInventaire);


//variables globales

var pentacleComplete = false;
var potionComplete = false;


//--------------- TEXTE ---------------//


//code pour afficher text petit à petit

var compteur; // permet arrêter le setInterval 
var nbCar; // nombre de caractères dans la chaine
var texte; // tableau des caractères
var idInterval; // id de l'interval pour le clearInterval()
var isLastChaine = false; // permet de faire disparaitre la boite de message
var once = true; // permet d'effacer le texte avant un nouvel affichage

function afficheText(vitesseApparition, chaineOriginale, lastChaine) {
    document.getElementById('overflowText').style.display = 'block';
    document.getElementById('dialogueContainer').style.marginTop = '0px';
    document.getElementById('overflowText').style.zIndex = 10;

    compteur = 0;
    texte = new Array;
    isLastChaine = lastChaine;

    var nbCar = chaineOriginale.length;
    var tableau = chaineOriginale.split("");

    if (once) {
        document.getElementById("textDialogue").innerHTML = "";
        once = false;
    }

    var txt = '';
    for (i = 0; i < nbCar; i++) {
        texte[i] = txt + tableau[i];
        var txt = texte[i];
    }

    setTimeout(function () { // change la chaine pour l'afficher avec 1 caractère de plus
        idInterval = setInterval("changeMessage()", vitesseApparition);
    }, 500);
}

function changeMessage() {
    if (compteur < texte.length - 1) { // si il reste des caractères à afficher
        compteur++;
        document.getElementById("textDialogue").innerHTML = texte[compteur];
    } else {
        clearInterval(idInterval);
        if (isLastChaine) {
            setTimeout(function () {
                document.getElementById('dialogueContainer').style.marginTop = '130px';
                document.getElementById('overflowText').style.zIndex = 0;
                once = true;
            }, 1000);
        }
    }
}


// ---------------- MUSIQUE --------------------//

var musique = document.getElementById('audio'); // élément jouant la musique dans le HTML
musique.volume = 0.4;
var playing = true; // est ce que la musique se joue ou est arrêtée
var intervalAudio1; // id du setInterval()
var intervalAudio2; // id du deuxième setInterval()
var changement = false; // savoir si on a change de musique
var onceMusique = false; // change une fois la source du fichier
var limbesAudio = false; // permet transition de musique vers les limbes

// permet de jouer ou d'arrêter la musique
function jouerAudio() {

    intervalAudio1 = setInterval(audioFade, 200); // permet des fondus
}

function audioFade() { // fondu audio

    if (playing == false) { // fondu in
        musique.play();
        var newVolume = musique.volume + 0.1;

        if (newVolume <= 0.4) { // si le volume est au maximum
            musique.volume = newVolume;
        } else {
            clearInterval(intervalAudio1); // arrêt du setInterval
            musique.volume = 0.4;
            playing = true;
        }
    } else { // fondu out
        var newVolume = musique.volume - 0.1;

        if (newVolume >= 0) {
            musique.volume = newVolume;
        } else {
            clearInterval(intervalAudio1);
            musique.volume = 0;
            musique.pause();
            playing = false;
        }
    }
}

// change de musique

function nextSong() {
    intervalAudio2 = setInterval(transitionAudio, 200); // permet des fondus
    if (limbesAudio == false) {
        limbesAudio = true;
    } else {
        limbesAudio = false;
    }
    onceMusique = false;
    changement = false;
}

// permet de faire le fondu entre les deux musiques
function transitionAudio() {
    if (changement == false) {
        if (musique.volume > 0.1) {
            musique.volume -= 0.1;
            console.log("fade out" + musique.volume);
        } else {
            musique.volume = 0;
            changement = true;
        }
    } else {
        if (onceMusique == false) {
            if (limbesAudio) {
                musique.src = "song/limbes.mp3";
            } else {
                musique.src = "song/aurora_theme.mp3";
            }
            musique.load();
            onceMusique = true;
        }
        if (musique.volume < 0.4) {
            musique.volume += 0.1;
        } else {
            clearInterval(intervalAudio2);
        }
    }
}

// --------------- TRANSITIONS ---------------//

// à chaque appel, fait un fondu au noir IN ou OUT
function fonduNoir() {
    var transitionFondu = document.getElementById("transitionFondu");
    if (transitionFondu.style.opacity == 1) {
        transitionFondu.style.opacity = "0";
        transitionFondu.style.zIndex = '0';
        setTimeout(function () { // une fois l'opacité à 0, on fait disparaitre la div
            transitionFondu.style.display = "none";
        }, 1000);
    } else {
        transitionFondu.style.display = "block";
        transitionFondu.style.opacity = "0";
        transitionFondu.style.zIndex = '100'; // apparait devant tous les autres objets

        setTimeout(function () { // léger délai pour permettre l'animation css
            transitionFondu.style.opacity = "1";
        }, 100);
    }
}

//fait un fondu noir vers une scène donnée
function transitionScene(sceneTarget) {
    fonduNoir(); // on cache, fondu out
    setTimeout(hideAllScenes, 1000); // disparition de toutes les div
    setTimeout(function () {
        loadScene(sceneTarget); // apparition d'une seule div
    }, 1000);
    setTimeout(fonduNoir, 2000); // on révèle fondu in
}

function loadScene(sceneTarget) {
    document.getElementById(sceneTarget).style.display = "block";
}

// cache toutes les scènes principales
function hideAllScenes() {
    document.getElementById("menuPrincipal").style.display = "none";
    document.getElementById("cinematique").style.display = "none";
    document.getElementById("map").style.display = "none";
    document.getElementById("chambreNoire").style.display = "none";
    document.getElementById("laboBotanique").style.display = "none";
    document.getElementById("limbes").style.display = "none";
    document.getElementById("overflowText").style.display = "none";
    document.getElementById("imageTransitionLimbes").style.display = "none";
    document.getElementById("limbes").style.display = "none";
    document.getElementById("gameOver").style.display = "none";
}

// fait la transition avec les tâches d'encre
function transitionInk() {
    var ink = document.getElementById("ink");
    ink.style.display = "none";
    ink.style.opacity = "1";
    ink.style.display = "block";

    setTimeout(function () {
        ink.style.opacity = "0";
    }, 4000);
    setTimeout(function () {
        ink.style.display = "none";
    }, 5000);

}


// -------------- CINEMATIQUE ----------------//

var compteurImagesCinematiqueA = 1; //compteur pour charger les images les unes après les autres
var compteurImagesCinematiqueB = 2; // compteur parallèle pour permettre une alternance
var timerDefilment = 5000; // temps d'apparition de chaque image
var cinematiqueImageA = document.getElementById("imagesCinematiqueA"); // une div montrant les images
var cinematiqueImageB = document.getElementById("imagesCinematiqueB"); // autre div montran les images en alterné
var AversB = true; // permet un alternement et des fondus enchainés entre les images
var nbImagesCinematique = 15; // nombre d'images dans la cinématique
var imageActuelle = 1;
var intervalDefilement; // ID pour pouvoir stoper l'interval à la fin
var passer = false; // pour passer la cinématique

// déclanche la cinématique
function cinematique() {

    var cinematiqueContainer = document.getElementById("cinematique");

    transitionInk(); // transition avec taches d'encre

    setTimeout(function () { // action quand l'encre a remplit tout l'écran
        hideAllScenes(); // on fait disparaitre toutes les divs principales
        cinematiqueContainer.style.display = "block"; // apparition de la cinématique uniquement
    }, 3000);

    setTimeout(function () {
        intervalDefilement = setInterval(defilement, timerDefilment);
    }, 5000); // commencer le défilement 5 secondes après affichage de la première image


}

// fait alterner deux div en fondu en changeant leurs images
function defilement() {

    imageActuelle++;

    if (AversB && passer != true) { // fade out de l'image A et fade in de l'image B
        AversB = false;
        cinematiqueImageA.style.opacity = "0";
        cinematiqueImageB.style.opacity = "1";

        compteurImagesCinematiqueA = compteurImagesCinematiqueB + 1;

        if (imageActuelle < nbImagesCinematique) {
            setTimeout(function () {
                cinematiqueImageA.src = "images/cinematique" + compteurImagesCinematiqueA + ".png"; // changement de l'image quand son opacité est à 0
            }, 1000);
        }

    } else if (AversB == false && passer != true) {
        AversB = true;
        cinematiqueImageA.style.opacity = "1";
        cinematiqueImageB.style.opacity = "0";

        compteurImagesCinematiqueB = compteurImagesCinematiqueA + 1;

        if (imageActuelle < nbImagesCinematique) {
            setTimeout(function () {
                cinematiqueImageB.src = "images/cinematique" + compteurImagesCinematiqueB + ".png";
            }, 1000);
        }

    }

    if ((imageActuelle == nbImagesCinematique) && (passer != true)) { // si toutes les images de la cinématique sont passés
        afficheText(40, "Tu peux encore le sauver en lui administrant le traitement si tu fais vite, autrement son âme n'ira même pas dans les limbes et disparaitra à jamais", true);
        clearInterval(intervalDefilement); // arrêt de l'interval
        setTimeout(transitionInk, 10000); // transition en taches d'encre
        console.log("ink2");

        setTimeout(function () {
            document.getElementById("cinematique").style.display = "none"; // disparition de la cinématique quand les taches recouvrent l'écran
            document.getElementById("map").style.display = "block"; // apparition de la map
            document.getElementById("mapIcon").style.display = "block"; // apparition de l'icone de map
            document.getElementById("timer").style.opacity = '1'; // apparition du timer
            startTimer(); // déclanchement du timer
        }, 13000);

    }

}

// permet de passer la cinématique
function passerCinematique() {
    passer = true; // sécurité pour arrêter la cinématique
    clearInterval(intervalDefilement); // arrêt de l'interval
    fonduNoir(); // fade to black
    setTimeout(hideAllScenes, 1000); // cacher toutes les scènes
    setTimeout(function () {
        document.getElementById("map").style.display = "block"; // idem qu'en fin de cinématique
        document.getElementById("timer").style.opacity = '1';
        document.getElementById("mapIcon").style.display = "block";
        startTimer();
    }, 1000);
    setTimeout(fonduNoir, 2000); // fade

}

// -------------- Timer --------------------- //

var chien = document.getElementById("chienTimer"); // div se déplaçant symbolisant le temps
var topChien = 0; // style top de la div
var timerInterval; // id setInterval
var stopTimer = false; // permet d'arrêter le timer

function startTimer() {
    timerInterval = setInterval(updateTimer, 450);
}

function updateTimer() { // déplace vers le bas d'un pixel toutes les 400 ms
    topChien += 1;
    chien.style.top = topChien + "px";

    if (topChien >= 400) {
        clearInterval(timerInterval);
        gameOver(); // si le chien est trop bas, on déclanche le Game Over
    }
    if (stopTimer) {
        clearInterval(timerInterval);
    }
}


// -------------- MAP -------------------------//

// rotation de l'aiguille en fontion de la div survolée par le curseur
function rotationAiguille(direction) {

    var aiguille = document.getElementById("aiguille");

    if (direction == "left") {
        aiguille.style.webkitTransform = 'rotate(-90deg)';
    } else {
        aiguille.style.webkitTransform = 'rotate(90deg)';
    }
}


// -------------- CHAMBRE NOIRE -------------- //

var degCircle1 = 20; // rotation initiale du cercle1
var degCircle2 = 180; // rotation initiale du cercle2
var degCircle3 = 240; // rotation initiale du cercle3
var complet = false; // si le pentacle est fini
var onceMsgPentacle = false; // affiche un message une fois
var nbPentacle = 1; // numéro du pentacle actuel
var divDeplacementsRestants = document.getElementById('deplacementsRestants'); // compteur de coups
var nbDeplacementRestants = 100; // coups restants
var onceMsgGameOver = true; // message de Game Over une fois

// rotation d'un cercle si on clique dessus
function rotationCircle(event) {
    var x = event.clientX; // position du curseur en X
    var y = event.clientY; // position du curseur en Y

    //    655 et 230 sont les coordonnées du centre des cercles

    var r = Math.sqrt((x - 655) * (x - 655) + (y - 260) * (y - 260)); // calcul de la distance entre le centre et l'entroit du clic

    if (nbDeplacementRestants <= 0) { // return si on a plus de coups
        if (onceMsgGameOver) {
            afficheText(40, "La magie s'est épuisée, je n'ai pas réussi à finir les pentacles à temps");
            onceMsgGameOver = false;
            setTimeout(gameOver, 4000); // déclanchement du Game Over
        }
        return;
    }

    if (complet == false) { // si le pentacle n'est pas fini
        if (r < 60) { // si on a cliqué sur le cercle intérieur
            var div = document.getElementById('circle3'); // récupération de la div
            div.style.webkitTransform = 'rotate(' + degCircle1 + 'deg)'; // rotation
            degCircle1 += 20; // incrémentation du compteur

        } else if (r < 100 && r > 60) {
            var div = document.getElementById('circle2');
            div.style.webkitTransform = 'rotate(' + degCircle2 + 'deg)';
            degCircle2 += 20;

        } else if (r > 100) {
            var div = document.getElementById('circle1');
            div.style.webkitTransform = 'rotate(' + degCircle3 + 'deg)';
            degCircle3 += 20;
        }

        nbDeplacementRestants--;
        divDeplacementsRestants.innerHTML = 'Déplacements Restants : ' + nbDeplacementRestants; // update du html

        //    utilisation des modulos pour déterminer si le pentacle est complet
        var mod1 = degCircle1 % 360;
        var mod2 = degCircle2 % 360;
        var mod3 = degCircle3 % 360;
    }

    if ((mod1 == mod2) && (mod1 == mod3) && onceMsgPentacle == false) { // si tous les modulos sont identiques et qu'on affiche pas déja le message
        onceMsgPentacle = true;
        if (nbPentacle == 1) {
            afficheText(40, "J'ai complété le premier pentacle !", true);
        }
        if (nbPentacle == 2) {
            afficheText(40, "Plus qu'un !", true);
        }
        if (nbPentacle == 3) {
            afficheText(40, "J'ai complété le dernier pentacle, mais le temps passe ...", true);
            pentacleComplete = true;
        }
        complet = true; // le pentacle est complet
        nbPentacle++;

        setTimeout(nextPentacle, 1000);
    }
}

// chargement du pentacle suivant
function nextPentacle() {

    if (nbPentacle == 2) {

        setTimeout(function () {
            document.getElementById('circle3').style.webkitTransform = 'rotate(0deg)'; // réinitialisation de la rotation
            document.getElementById('circle2').style.webkitTransform = 'rotate(0deg)';
            document.getElementById('circle1').style.webkitTransform = 'rotate(0deg)';

            document.getElementById('circle3').src = 'images/circle_06.png'; // changement de l'image source
            document.getElementById('circle2').src = 'images/circle_05.png';
            document.getElementById('circle1').src = 'images/circle_04.png';
        }, 1000);

        setTimeout(function () {
            document.getElementById('circle3').style.webkitTransform = 'rotate(180deg)'; // rotation initiale
            document.getElementById('circle2').style.webkitTransform = 'rotate(20deg)';
            document.getElementById('circle1').style.webkitTransform = 'rotate(140deg)';
        }, 1300);

        degCircle1 = 200; //redéfinition des rotations
        degCircle2 = 40;
        degCircle3 = 160;
    }

    if (nbPentacle == 3) {

        setTimeout(function () {
            document.getElementById('circle3').style.webkitTransform = 'rotate(0deg)';
            document.getElementById('circle2').style.webkitTransform = 'rotate(0deg)';
            document.getElementById('circle1').style.webkitTransform = 'rotate(0deg)';

            document.getElementById('circle3').src = 'images/circle_09.png';
            document.getElementById('circle2').src = 'images/circle_08.png';
            document.getElementById('circle1').src = 'images/circle_07.png';
        }, 1000);

        setTimeout(function () {
            document.getElementById('circle3').style.webkitTransform = 'rotate(60deg)';
            document.getElementById('circle2').style.webkitTransform = 'rotate(240deg)';
            document.getElementById('circle1').style.webkitTransform = 'rotate(120deg)';
        }, 1300);

        degCircle1 = 80;
        degCircle2 = 260;
        degCircle3 = 140;
    }

    if (nbPentacle == 2 || nbPentacle == 3) { // si on a fini le permier ou le deuxième pentacle
        complet = false; // on commence le suivant
    }
    onceMsgPentacle = false;

    if (nbPentacle == 4) { // si on finit le dernier pentacle
        complet = true; // vérouillage des déplacements
        if (checkLimbes()) {} else { // appel de la fonction pour vérifier si on est prêt à passer aux limbes, sinon on retourne à la map
            setTimeout(function () {
                transitionScene('map');
            }, 3000);
        }
    }
}

// ------------------Labo Botanique -------------- //   

var cooCompteur = 30; // espace entre les objets dans l'inventaire
var nbIngredients = 0; // nombre d'objets trouvés
var dansLeJardin = true; // est-on dans le jardin ou le labo
var numObjetPrecedent; // numéro de l'objet cliqué précédemment
var numObjet = 0; // numéro de l'objet cliqué
var onceLabo = true; // permet d'initialiser l'objet cliqué précédemment
var objetSelectionne = false; // si on a ciqué sur un objet ou pas
var comboBonnesReponses = 1; // si on a fait une erreur ou pas
var maDiv; // objet cliqué

// affichage d'un message dans le jardin ou le labo si on vient de la map et affichage de la div principale
function loadLabo() {
    transitionScene('laboBotanique');
    if (dansLeJardin) {
        setTimeout(function () {
            afficheText(40, 'je dois trouver les 6 ingrédients nécessaires pour faire une potion de vie en reconstituant le cycle.', true);
        }, 2000);
    } else {
        setTimeout(function () {
            afficheText(40, "Je dois maintenant mettre les ingrédients dans l'ordre pour reconstituer le cycle", true);
        }, 2000);
    }
}

// déplace les objets trouvés dans l'inventaire

function moveObjetsBotaniques() {

    maDiv = document.getElementById(this.id); // objet cliqué

    if (dansLeJardin) { // si on est dans le jardin
        if (nbIngredients < 6 && maDiv.getAttribute("value") != "inInv") { // si on ne clique pas sur un objet déja dans l'inventaire

            if (this.id == "arbre") { // si on clique sur l'arbre
                var arbreMini = document.getElementById("arbreMini"); // récupération de l'icone d'arbre
                arbreMini.style.display = "block"; // affichage de l'icone

                setTimeout(function () {
                    arbreMini.style.width = '110px'; // déplacment de 'licone
                    arbreMini.style.left = '686px';
                    arbreMini.style.top = (cooCompteur - 70) + 'px'; // -70 à cause du délait du setTimeout s'effectuant après l'incrémentation
                    arbreMini.children[1].style.display = 'block'; // affichage du text descriptif
                }, 10);

            } else {
                maDiv.children[1].style.display = 'block'; // affichage du text descriptif
                maDiv.style.display = 'block';
                maDiv.style.width = '110px';
                maDiv.style.left = '686px';
                maDiv.style.top = cooCompteur + 'px';
            }
            maDiv.setAttribute("value", "inInv"); // affectation de la valeur "dans l'inventaire" à l'objet
            nbIngredients += 1; // incrémentation du compteur d'ingrédients trouvés

            cooCompteur += 70; // placement vertical des objets
        }
        if (nbIngredients == 6) { // si tous les ingrédients sont trouvés

            dansLeJardin = false; // on passe dans le labo

            afficheText(40, "J'ai trouvé tous les ingrédients nécessaires pour faire la potion.", true);

            setTimeout(fonduNoir, 4000); // fondu au noir

            setTimeout(function () { // transition entre le jardin et le labo
                document.getElementById('jardin').style.display = 'none';
                document.getElementById('arbre').style.display = "none";
                document.getElementById('labo').style.display = 'block';
                fonduNoir();
            }, 5000);

            setTimeout(function () { // message explicatif
                afficheText(40, "Je dois maintenant mettre les ingrédients dans l'ordre pour reconstituer le cycle", true);
            }, 6000);

        }

    } else { // si on est dans le labo

        maDiv.style.display = 'none'; // disparition de l'objet dans l'inventaire si on clique dessus
        var imgCliquee = maDiv.firstChild.src;
        document.documentElement.style.cursor = 'url(' + imgCliquee + '),auto'; // changement de l'apparence du curseur
        objetSelectionne = true;
    }
}

// ajout d'un objet dans la potion
function addPotion() {

    if (onceLabo) {
        onceLabo = false;
        numObjetPrecedent = parseInt(maDiv.firstChild.getAttribute("value")); // récupération du numéro de la l'image dans la div et intitialisation de numObjetPrécéndent
    } else {
        numObjet = parseInt(maDiv.firstChild.getAttribute("value")); // récupération du numéro de la l'image dans la div
    }

    if (objetSelectionne == true) { // si on a séléctionné un objet et qu'on clique sur le liquide dans la potion
        document.documentElement.style.cursor = 'auto'; // le curseur redevient normal

        if (numObjet != 0) {
            if (numObjet == (numObjetPrecedent + 1) || numObjet == (numObjetPrecedent - 5)) { // si le numéro est : le numéro précédent + 1 ou le numéro précédent - 5, pour passer du fruit à la graine par exemple
                numObjetPrecedent = numObjet; // on défini le nouveau numéro précédent
                comboBonnesReponses++;
            } else { // si le numéro romp le cycle
                afficheText(40, "Je me suis trompé, cet élément romp le cycle ...", true);
                setTimeout(gameOver, 6000);
            }
        }
    }

    if (comboBonnesReponses == 6) { // si les 6 objets ont été ajoutés dans l'ordre à la potion
        afficheText(40, 'La potion est terminée!', true);
        potionComplete = true;
        if (checkLimbes()) {} else { // on vérifie si on est prêt à passer aux limbes
            setTimeout(function () {
                transitionScene('map');
            }, 2000);
        }
    }
}

function returnInventaire() { // si on a séléctionné un objet et qu'on clique sur l'inventaire, il y revient
    if (objetSelectionne) {
        document.documentElement.style.cursor = 'auto';
        maDiv.style.display = "block";
    }
}

/* --------------- LIMBES ------------- */

var onceDialoueFleur = true; // affiche une fois le dialogue de la fleur
var nbMots = 0; // nombre de mots utilisés
var motA = "";
var motB = "";
var motC = "";
var topA; // style top du mot A
var leftA;
var topB;
var leftB;
var topC;
var leftC;

// passe dans les limbes si on a fini le pentacle et la potion
function checkLimbes() {
    if (pentacleComplete == true && potionComplete == true) {
        stopTimer = true;
        document.getElementById('mapIcon').style.opacity = '0';

        setTimeout(function () {
            transitionScene('imageTransitionLimbes');
            document.getElementById('mapIcon').style.display = 'none';

        }, 3000)
        setTimeout(function () {
            afficheText('40', "J'ai fini la potion et l'arrangement des pentacles, j'espère que ça va marcher...", false);
        }, 5500);

        setTimeout(function () {
            afficheText('40', "Ho non je suis arrivé trop tard, son âme est partie dans les limbes... Mais je pense encore pouvoir la sauver", true);
        }, 10000);


        setTimeout(function () {
            transitionScene('limbes');
            nextSong();
        }, 15000);

        return true;
    } else {
        return false;
    }
}

// déclanche au clic le dialogue de la fleur
function dialogueFleur() {
    if (onceDialoueFleur) {
        document.getElementById('ameChien').style.cursor = 'pointer'; // indication qu'on pourra cliquer sur l'ame du chien
        afficheText('40', "Je suis la fleur que tu as tué tout à l'heure.", false);
        setTimeout(function () {
            afficheText('40', "Je suis restée intacte mais cette âme là bas n'a pas eu cette chance...", false);
        }, 3000);
        setTimeout(function () {
            afficheText('40', "Elle est torturée, elle a quité la vie sans y avoir renoncé.", false);
        }, 7000);
        setTimeout(function () {
            afficheText('40', "Je pense que tu sais quoi lui dire...", true);
            onceDialoueFleur = false; // on peut cliquer sur l'ame du chien
        }, 11000);
    } else {
        afficheText('40', "Aurais-tu peur de lui parler ?", true);
    }
}

// affiche au clic le nuage de mots
function dialogueChien() {
    if (onceDialoueFleur == false) {
        apparitionMots();
    }
}

// apparition du nuage de mots
function apparitionMots() {
    document.getElementById('nuageMots').style.opacity = '1';
    document.getElementById('boxDialogueChien').style.opacity = '1';
    document.getElementById('nuage').style.opacity = '1';
}

// déplacement du mot pour faire une phrase
function deplaceMot() {

    if (nbMots == 3) { // si 3 mots sont déja là, on ne peut pas en rajouter
        return;
    }

    nbMots++; // incrémentation du nombre de mots utilisés
    var monMot = document.getElementById(this.id); // le mot cliqué

    if (nbMots == 1) { // si c'est le premier mot
        document.getElementById('dire').style.display = 'block'; // affichage du bouton "dire"

        motA = this.id; // renseignement du mot A

        topA = monMot.style.top; // sauvegarde des ancients paramètres de style
        leftA = monMot.style.top;
        monMot.style.left = '-230px'; // animation à la bonne place horizontalement
    }
    if (nbMots == 2) {

        motB = this.id;

        topB = monMot.style.top;
        leftB = monMot.style.top;
        monMot.style.left = '-121px';
    }
    if (nbMots == 3) {

        motC = this.id;

        topC = monMot.style.top;
        leftC = monMot.style.top;
        monMot.style.left = '-20px';
    }


    monMot.style.top = '276px'; // aimation verticale


}

// déclanché par le bouton dire
function checkMots() { 
    if (motA == "excuse" && motB == "moi" && motC == "") { // si ce sont les bons mots
        victoire();
    } else { // sinon, reset des mots à leur place d'origine et reset des variables
        afficheText(40, 'non, tu ne devrais pas dire ça.', true)
        document.getElementById(motA).style.top = topA;
        document.getElementById(motA).style.left = leftA;

        if (motB != "") {
            document.getElementById(motB).style.top = topB;
            document.getElementById(motB).style.left = leftB;
        }

        if (motC != "") {
            document.getElementById(motC).style.top = topC;
            document.getElementById(motC).style.left = leftC;
        }
        motA = "";
        motB = "";
        motC = "";
        nbMots = 0;
        document.getElementById('dire').style.display = "none"; // disparition du bouton dire
    }
}

/* ---------------- GAME OVER ----------- */

// déclanche le Game Over
function gameOver() {

    transitionScene('gameOver');
    setTimeout(function () {
        afficheText(40, "Je n'ai pas réussi à lui administrer le traitement ...", true);
    }, 5000)
    setTimeout(fonduNoir, 8000); 
    setTimeout(jouerAudio, 8000); // arrêt de la musique
    setTimeout(function () {
        location.reload(); // rechargement de la page
    }, 9000);
}


/* ---------------- VICTOIRE ---------- */

// cinématique de fin
function victoire() {
    nextSong(); // changement de musique
    transitionInk(); // taches d'encre
    setTimeout(function () {
        document.getElementById('limbes').style.display = "none"; // disparition des limbes
        document.getElementById('victoire').style.display = "block"; // affichage de la div contenant les cinématiques
        document.getElementById('imgVictoire1').style.opacity = "1";
        document.getElementById('imgVictoire1').style.display = "block";
    }, 3000);

    // transition entre les images
    setTimeout(function () {
        document.getElementById('imgVictoire1').style.opacity = "0";
        document.getElementById('imgVictoire2').style.opacity = "1";
    }, 8000);

    setTimeout(function () {
        document.getElementById('imgVictoire2').style.opacity = "0";
        document.getElementById('imgVictoire3').style.opacity = "1";
    }, 13000);

    setTimeout(function () {
        document.getElementById('imgVictoire3').style.opacity = "0";
        document.getElementById('imgVictoire4').style.opacity = "1";
        afficheText(40, "Et c'est ainsi que la Mort redonna la vie", false);
    }, 17000);

    setTimeout(fonduNoir, 26000);
    
    // affichage des crédits
    setTimeout(function(){
        document.getElementById('credits').style.opacity = "1";
    },28000)
    
    setTimeout(function(){
        document.getElementById('credits').style.opacity = "0";
    },32000)
    
    setTimeout(jouerAudio, 32000);

    setTimeout(function () {
        location.reload();
    }, 33000);
}

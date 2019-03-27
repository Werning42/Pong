
//-----------------------------SETUP-----------------------------//
//La variable IA active (1) ou désactive (2) la raquette automatique et la variable Over est un état
IA = 0;
Over = 0;

//------------PLAYER------------//

//taille de la raquette
playerThickness=80;                                                    
playerHeight=10;

//position de la raquette 
playerX=240-playerThickness/2;     

//visuel de la raquette                                     
player = new Image(playerX,340,playerThickness,playerHeight);
player.src = 'player1.png';

//------------BALL------------//

//taille et location de spawn de la balle
ballSize=23;                                                           
ballX=ballY=50;

//la balle spawn à l'arrêt, la velocité de la balle est égale au nombre de pixels qu'elle va parcourir
//à chaque refresh du canvas sur un axe X ou Y (ou les deux pour la diagonale)
//par exemple, si la vélocité X est de 2 et le refreshrate du canvas est de 120 images par seconde,
//la balle va parcourir 240 pixels (120x2) par seconde sur l'axe X, mais divisé en mouvement de 2 pixels pour la fluidité
xVelocity=yVelocity=0;

//puis, après 2000ms (2s), elle se met à bouger
ball = new Image(ballX-ballSize/2,ballY-ballSize/2,ballSize,ballSize);
setTimeout(function(){
  xVelocity=yVelocity=1;
},2000);

//pour animer la balle, j'utilise un array d'images pratiquement similaire que je vais passer en image source
//de la balle à un interval très rapide et régulier (pour simuler un GIF)
ballArray = new Array();
ballArray[0] = 'lavaball1.png';
ballArray[1] = 'lavaball2.png';
ballArray[2] = 'lavaball3.png';
ballArray[3] = 'lavaball4.png';

//------------BOSS------------//

//points de vie & shield du boss
bossHp=1000;                                                           
bossShield = 0;                                                       

//reconnaissance des divs html qui vont permettre d'afficher les hp et shield du boss à l'écran    
bossHpBar = document.getElementById('hpbar');                          
bossHpState = document.getElementById('realhp');
bossHpDiv = document.getElementById('realhpnumber');
bossShieldDiv = document.getElementById('realshieldnumber');
bossHpBarWidth = 400;

//variable d'état pour empêcher le boss de prendre un dégat au spawn de la balle (passe à 1 au spawn de balle et repasse à zéro après le premier coup)
bossProtecSpawn = 0;                                                                                                                   

//-----------------------------ONLOAD-----------------------------//

//setup du canvas 
window.onload=function() {
  canvasGet=document.getElementById('monCanvas');
  canvas=canvasGet.getContext('2d'); 

  //refreshrate du canvas                                  
  setInterval(update,300/60);                                         

  //refreshrate de la balle (pour l'effet GIF)   
  setInterval(gifs,85/1);  

  //si l'IA est désactivée, on récupère la position du curseur pour déplacer la raquette
  if (IA == 0) {                                           
    canvasGet.addEventListener('mousemove',function(e){                
      playerX = (e.clientX-playerThickness/2)-canvasTrueOffset;
    });}
  }

  //------------OFFSET------------//

//J'ai du récupérer le canvas (var canvasHitboxOffset) puis faire des calculs pour centrer la zone de détection de la souris
//car centrer le canvas décalais la raquette vers la droite, le navigateur considérant que le canvas et la zone souris était deux
//choses distinctes
canvasHitboxOffset = getComputedStyle(document.getElementById('offset')).getPropertyValue('width');  

// slice pour récupérer la propriété css pure, 0 pour partir du début, -2 pour enlever les deux derniers caractères (les caractères 'px')
// -480 est la largeur du canvas, divisé en deux pour centrer la hitbox souris sur le canvas                
canvasTrueOffset = ((canvasHitboxOffset.slice(0, -2)-480) / 2);                                                       

//offset pour centrer le mot VICTOIRE sur le canvas      
victoryOffset = ((canvasHitboxOffset.slice(0, -2)/ 2)- 140);  

//-----------------------------ONRESET-----------------------------//

//remet la balle en jeu et fonction random pour rendre la direction de mouvement initial aléatoire
function reset(){
  ballX=canvasGet.width/2;                                           
  ballY=canvasGet.height/2;
  rand = Math.floor(Math.random() * Math.floor(2));                  
  xVelocity = 1;                                                     
  if (rand==0) {
    xVelocity = -xVelocity
  }
  yVelocity=-1;

  //si le boss est encore en vie (bossHp >1) lorsqu'on perd la balle (onreset), alors le boss reprend toute sa vie et gagne 5 shields
  syncHpBarPlus();
  if (bossHpBarWidth > 1 && bossHp > 1){                           
    bossHp = 1000;
    bossHpDiv.innerHTML = bossHp;
    bossShield=5;
    bossShieldDiv.innerHTML = bossShield;
    bossHpBarWidth = 400;
    bossProtecSpawn = 1;
  };
}

//-----------------------------ONREFRESH-----------------------------//

//attribue une image aléatoire de l'array sur la balle
function gifs(){
  ball.src = ballArray[Math.floor(Math.random() * ballArray.length)];
}


//refresh du canvas
function update(){
  canvasX = canvasGet.width;                                         
  canvasY = canvasGet.height;
  //réactualise le background du canvas pour éviter les bugs d'image qui se multiplie et reste avec le mouvement (trails)
  canvasbg = new Image();
  canvasbg.src = 'canvasbg.png';
  canvas.drawImage(canvasbg, 0, 0);

  //ajoute la vélocité à la valeur actuelle X et Y de la balle pour le mouvement
  ballX+=xVelocity;                                                 
  ballY+=yVelocity;                                                  

  //rebond lorsque l'axe X de la balle dépasse l'axe X du canvas
  if(ballX>canvasX) {
    xVelocity=-xVelocity;
  }

  //ballY est le coté du canvas ou le boss prend les coups, on fait donc un rebond et on calcul tout les états possible du boss avec un résultat adapté
  else if(ballY<0){                                                
    yVelocity=-yVelocity;

    //si le boss est protégé par la protection spawn
    if (bossProtecSpawn == 1) {
      bossProtecSpawn = 0;

    //si le boss en est a son dernier point de shield
    } else if (bossShield == 1) {
      yVelocity = 1;
      bossShield--;
      bossShieldDiv.innerHTML = bossShield;

    //si le boss n'a pas de shield et est encore en vie
    } else if (bossShield == 0 && bossHpBarWidth > 40){             
      bossHp-=100;  
      document.getElementById('hp100').style.display = "block"; 
      document.getElementById('hp100').style.top = "50px";
      document.getElementById('hp100').style.left ="100px"; 
      setTimeout(function(){
        document.getElementById('hp100').style.display = "none";
      },250);
      yVelocity+=0.5;     //accéleration de la balle pour la difficulté  (visible à plusieurs endroits)                                               
      syncHpBarMinus();
      bossHpDiv.innerHTML = bossHp; 

    //si le boss est a 100 hp lorsque la balle le touche (c'est donc le coup final)
    } else if (bossHp == 100) {
      syncHpBarMinus();
      bossHpState.innerHTML = 'DEAD';
      document.getElementById('boss').style.backgroundImage = 'url("deadboss.png")'; 

      //utilisation de la variable d'état pour finir le jeu (arrêter la balle, afficher victoire ...)
      if (Over == 0) {
        xVelocity = 0;
        yVelocity = 0;
        document.getElementById('victoire').style.display = "block";
        document.getElementById('victoire').style.left = victoryOffset+"px";
        document.getElementById('hpbar').style.border = '0px';
        ballSize = 0;
        document.getElementById('boss').style.marginTop = "10px";
      Over++;
    }

    //si le boss a plusieurs point de shields
    } else if (bossHpBarWidth > 1 && bossShield >= 1) {                                
      bossShield--;
      bossShieldDiv.innerHTML = bossShield;
      yVelocity+=0.5;  
      document.getElementById('shield1').style.display = "block"; 
      document.getElementById('shield1').style.top = "50px";
      document.getElementById('shield1').style.left = "100px"; 
      setTimeout(function(){
        document.getElementById('shield1').style.display = "none";
      },250);
    }
  }

  //rebond
  else if (ballX<0) {
    xVelocity=-xVelocity;
  }

  //rebond vers le bas, calcule donc si la balle touche la raquette ou le bord du canvas
  else if (ballY>canvasY-25){                                                         

    //si la balle touche le joueur   
    if (ballX>playerX && ballX<playerX+playerThickness){                               
      yVelocity=-yVelocity;        

      //la variable deltaX permet de faire en sorte que plus la balle touche la raquette sur le coté, plus la balle va partir
      //sur un axe X avec un angle de plus en plus obtus                                                    
      deltaX = ballX-(playerX+playerThickness/2);
      xVelocity = deltaX*0.05;

    //sinon (si la balle n'a pas touché la raquette), on lance la fonction reset qui regen le boss ect...
    } else {
      ballX=canvasGet.width/2;                                        
      ballY=canvasGet.height/2;
      xVelocity = 0;
      yVelocity = 0;
      setTimeout(function(){
        reset();
      },800);
    }
  }
  canvas.fillStyle="rgba(0,0,0,0)";                                                    
  canvas.fillRect(0,0,canvasGet.width,canvasGet.height);     

  //IA désactivée, controle souris activés
  if (IA == 0) {                            
    canvas.drawImage(player,playerX,330,playerThickness,playerHeight+7);
  }

  //IA activée, la raquette suit l'axe de la balle pour ne jamais la rater (très moche comme mouvement)
  else if (IA == 1) {
    playerX = ballX-(playerThickness/2);
    canvas.drawImage(player,playerX,330,playerThickness,playerHeight+7);
  }
  canvas.drawImage(ball,ballX-ballSize/2,ballY-ballSize/2,ballSize,ballSize);
}

  //-----------------------------FUNCTIONS-----------------------------//

  //synchronise les HP du boss avec la barre d'hp visuelle lorsqu'il regen onreset
  function syncHpBarPlus() {                                                               
    if (bossHpBarWidth < 400 && bossHpBarWidth > 1){
      bossHpBarWidth += 80;
      document.getElementById('hpbar').style.width = bossHpBarWidth+'px';
      if (bossHpBarWidth > 400){
        bossHpBarWidth = 400;
        document.getElementById('hpbar').style.width = bossHpBarWidth+'px';
      }
    }
  }

  //synchronsie les HP du boss avec la barre d'hp visuelle lorsqu'il perd de la vie (onhit)
  function syncHpBarMinus() {                                                              
    if (bossHpBarWidth > 0){
      bossHpBarWidth -= 40;
      document.getElementById('hpbar').style.width = bossHpBarWidth+'px';
      if (bossHpBarWidth < 0)
        bossHpBarWidth = 0;
      document.getElementById('hpbar').style.width = bossHpBarWidth+'px';
    }
  }

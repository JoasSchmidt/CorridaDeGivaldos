class Game {
  constructor() {
    this.resetB = createButton("");
    this.resetT = createElement("h2")
    this.leadersT = createElement("h2")
    this.leader1 = createElement("h2")
    this.leader2 = createElement("h2")
    this.isMoving = false
    this.keyActive = false
    this.isBum = false
  }

  showElements(){
    form.titleImg.position(40,50)
    form.titleImg.class("gameTitleAfterEffect")

    this.resetT.html("tente novamente🔴")
    this.resetT.position(width/2+200,50)
    this.resetT.class("resetText")

    this.resetB.position(width/2+225,100)
    this.resetB.class("resetButton")

    this.leadersT.html("placar")
    this.leadersT.position(width/3-60,50)
    this.leadersT.class("resetText")
    this.leader1.class("leadersText")
    this.leader2.class("leadersText")
    this.leader1.position(width/3-60,80)
    this.leader2.position(width/3-60,125)
  }


  
  start() {
    form = new Form();
    form.display();
    player = new Player();
    player.getCount()
    car1= createSprite(width/2-50,height-100)
    car1.addImage("car",car1Img)
    car1.addImage("carbum",bum)
    car1.scale = 0.07
    car2= createSprite(width/2+100,height-100)
    car2.addImage("car",car2Img)
    car2.addImage("carbum",bum)
    car2.scale = 0.07
    cars = [car1,car2]
    
    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    obstacles = new Group()
    this.addSprites(obstacles,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions)



    taCaro = new Group()
    this.addSprites(taCaro,10,taCaroImg,0.02)

    carcoin = new Group()
    this.addSprites(carcoin,37,carcoinImg,0.09)
  }
  getState(){
    var stateRef = database.ref("gameState")
    stateRef.on("value",(data)=>{
      gameState = data.val()
    })
  }
  updateState(valor){
    database.ref("/").update({
      gameState:valor
    })
  }

  resetarJogo(){
    this.resetB.mousePressed(()=>{
      database.ref("/").set({
        carsEnd:0,
        playCount:0,
        gameState:0,
        players:{}
      })
      location.reload()
    })
  }

  play(){
    form.hide()
    this.showElements()
    this.resetarJogo()

    Player.getPlayerInfo()

    player.getCarsEnd()

    if(allPlayers!==undefined){
      image(piesta,0,-height*5,width,height*6)

      this.showRanking()
      this.showLife()
      this.showFuelBar()

      var index =0
      for(var plr in allPlayers){
        index +=1
        var x = allPlayers[plr].positionX
        var y = height - allPlayers[plr].positionY
        cars[index-1].position.x=x
        cars[index-1].position.y=y

        var vidinha = allPlayers[plr].vidinha

        if(vidinha<=0){
          cars[index-1].changeImage("carbum")
          cars[index-1].scale = 0.3
          
        }


        if(index===player.index){
          camera.position.y=cars[index-1].position.y

          this.addfuel(index)
          this.addcoin(index)

          this.Pow(index)
          this.kabraul(index)

          if(player.vidinha<=0){
            this.isBum = true
          this.isMoving = false
          }

        }




      }
      
      const linha = height*6-100
      if(player.positionY>linha){
        gameState = 2
        player.ranking+=1
        Player.updateCarsEnd(player.ranking)
        player.update()
        this.showRank()
      }

      if(this.isMoving){
        player.positionY +=10
        player.update()
      }
      



      this.controles()

      drawSprites()
    }
  }
  controles(){
    if(!this.isBum){
      if(keyIsDown(UP_ARROW)){
        player.positionY +=5
        player.update()
        this.isMoving = true
      }
      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
  
        player.positionX -= 5;
        player.update();
        this.keyActive = true;
      }
  
      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
  
        player.positionX += 5;
        player.update();
        this.keyActive = false
      }
    }
  }
  showRanking(){
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].ranking === 0 && players[1].ranking === 0) ||
      players[0].ranking === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].ranking +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].ranking +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].ranking === 1) {
      leader1 =
        players[1].ranking +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].ranking +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
  addSprites(group, number, image, scale, positions=[]){
    for(var i=0; i<number; i++){
      var x, y;
      if(positions.length>0){
        x= positions[i].x
      y= positions[i].y
      image= positions[i].image
      }
      else{
        x= random(width/2+150,width/2-150)
        y= random(-height*4.5,height-400)
      }


      var sprite = createSprite(x,y)
      sprite.addImage("sprite",image)
      sprite.scale= scale
      group.add(sprite)


    }
  }
  addfuel(index){

    cars[index - 1].overlap(taCaro, function(collector,collected){
      player.taCaro = 200;
      collected.remove();

    });
    if(player.taCaro>0 && this.isMoving){
      player.taCaro -= 0.5

    }

    if(player.taCaro<=0){
      gameState=2
      this.gameOver()
    }
  }

  addcoin(index){

    cars[index - 1].overlap(carcoin, function(collector,collected){
      player.score +=20
      player.update();
      collected.remove();
    });
  }
  showRank() {
    swal({
      title: `Incrível!${"\n"}Rank${"\n"}${player.ranking}`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }
  showLife() {
    push();
    image(lifeImg, width / 2 - 130, height - player.positionY - 400, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 400, 185, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.positionY - 400, player.vidinha, 20);
    noStroke();
    pop();
  }

  showFuelBar() {
    push();
    image(taCaroImg, width / 2 - 130, height - player.positionY - 300, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 300, 200, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positionY - 300, player.taCaro, 20);
    noStroke();
    pop();
  }
  gameOver() {
    swal({
      title: `Fim de Jogo`,
      text: "Oops você perdeu a corrida!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar"
    });
  }
  Pow(index) {
    if(cars[index-1].collide(obstacles)){


      if(this.keyActive){
        player.positionX+=100
      }
      else{
        player.positionX-=100
      }

      if(player.vidinha>0){
        player.vidinha-=200/4
      }
      player.update()
    }
  }
  kabraul(index){
    if(index===1){
      if(cars[index-1].collide(cars[1])){
        if(this.keyActive){
          player.positionX+=100
        }
        else{
          player.positionX-=100
        }
  
        if(player.vidinha>0){
          player.vidinha-=200/4
        }
        player.update()
      }

    }
    if(index===2){
      if(cars[index-1].collide(cars[0])){
        if(this.keyActive){
          player.positionX+=100
        }
        else{
          player.positionX-=100
        }
  
        if(player.vidinha>0){
          player.vidinha-=200/4
        }
        player.update()
      }
      
    }
  }
}


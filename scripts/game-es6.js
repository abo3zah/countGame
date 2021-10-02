class NumberedBox extends createjs.Container{
    constructor(game, number=0){
        super();

        this.game= game;
        this.number = number;

        var boxWidth = 50;
        var boxHeight= 50;

        var box = new createjs.Shape();
        
        box.graphics
            .beginRadialGradientFill(["#FCD526","#E0AA22"], [0.1, 0.9], boxWidth/2, boxHeight/2, 0, 20, 20, 50)
            .beginStroke('#000000')
            .drawRect(0, 0, boxWidth,boxHeight);

        var text = new createjs.Text(number, "22px Gemunu Libre", "#000000");
        text.textAlign = 'center';
        text.textBaseline = 'middle';
        text.x = boxWidth / 2;
        text.y = boxHeight / 2;

        this.addChild(box, text);
        this.setBounds(0,0,boxWidth,boxHeight);

        this.on("mouseover",function(){
            box.graphics.beginRadialGradientFill(["#E0AA22","#FCD526"], [0.1, 0.9], boxWidth/2, boxHeight/2, 0, 20, 20, 50).beginStroke('#000000').drawRect(0, 0, boxWidth,boxHeight);
        })

        this.on("mouseout",function(){
            box.graphics.beginRadialGradientFill(["#FCD526","#E0AA22"], [0.1, 0.9], boxWidth/2, boxHeight/2, 0, 20, 20, 50).beginStroke('#000000').drawRect(0, 0, boxWidth,boxHeight);
        })

        //handle click/tap
        this.on('click', this.handleClick.bind(this));
    }
    handleClick(){
        this.game.handleClick(this);
    }
}

class GameOverView extends createjs.Container{
    constructor(game){
        super();

        this.game= game;

        var viewWidth = this.game.stage.width;
        var viewHeight= this.game.stage.height;
        
        //TODO: Add nice background
        //background
        var gameOverBackground = new createjs.Shape();
        gameOverBackground.graphics
            .s('black')
            .lf(['white','lightgray'],[0,1],0,0,0,viewHeight)
            .mt(0,70)
            .qt(150,80,300, 70)
            .qt(150,80,0, 70)
            .r(0, 0, viewWidth,viewHeight);

        //you won text
        var text = new createjs.Text('🎉You Won🎉', "26px Arial", "black");
        text.x = viewWidth/2;
        text.y = 40;
        text.textAlign = 'center';

        //button
        var button = new createjs.Shape();
        var buttonWidth = 150;
        var buttonHeight = 40;
        button.graphics.beginFill("#D1E4EB").beginStroke('#000000').drawRect(0, 0, buttonWidth,buttonHeight);
        button.x = (viewWidth-buttonWidth)/2;
        button.y = (viewHeight-buttonHeight)/2;

        //text
        var buttonText = new createjs.Text('😃Play Again😃', "18px Arial", "black");
        buttonText.x = viewWidth/2;
        buttonText.y = viewHeight/2 - buttonHeight/4;
        buttonText.textAlign = 'center';

        //animation
        button.on("mouseover", function(event) {
            button.graphics.beginFill('#4E81BF').drawRect(0, 0, buttonWidth,buttonHeight);
            buttonText.color = "white";
        });
        button.on("mouseout", function(event) {
            button.graphics.beginFill("#D1E4EB").drawRect(0, 0, buttonWidth,buttonHeight);
            buttonText.color = "black";
        });

        //click or tap
        button.on("click", this.restartGame.bind(this));
        
        //adding to the container
        this.addChild(gameOverBackground, text, button, buttonText);
        this.setBounds(0,0,viewWidth,viewHeight);
    }

    restartGame(){
        this.game.restartGame();
    }
}

//This class controls the game data
class GameData{
    constructor(){
        this.amountOfBox = 10;
        this.numberOfMistakes = 0;
        this.resetData();
    }
    resetData(){
        this.currentNumber = 1;
        this.numberOfMistakes = 0;
    }
    nextNumber(){
        this.currentNumber += 1;
    }
    isRightNumber(number){
        if (number === this.currentNumber) {
            return true
        } else {
            this.numberOfMistakes += 1;
            return false
        }
    }
    isGameWin(){
        return (this.currentNumber > this.amountOfBox);
    }
}

class GameBar extends createjs.Container{
    constructor(game){
        super();

        this.game= game;

        var boxWidth = this.game.stage.width;
        var boxHeight= this.game.barHeight;

        var box = new createjs.Shape();
        
        box.graphics
            .beginFill("lightgray")
            .beginStroke('#000000')
            .drawRect(0, 0, boxWidth,boxHeight);

        this.text = new createjs.Text(0, "20px Gemunu Libre", "#000000");
        this.text.textAlign = 'start';
        this.text.textBaseline = 'top';
        this.text.x += 20;

        var mistakeSymbol = new createjs.Shape();
        mistakeSymbol.graphics.ss(2).s("red").f("red").mt(5,4).lt(15,16).mt(15,4).lt(5,16);

        this.addChild(box, this.text, mistakeSymbol);
        this.setBounds(0,0,boxWidth,boxHeight);
    }
    sayHi(){
        console.log('hi');
    }
}

class Game{
    constructor(){

        //define variables
        this.canvas = document.getElementById("game-canvas")
        this.stage = new createjs.Stage(this.canvas);
        this.barHeight = 21;

        //load sounds
        this.loadSound();

        this.stage.enableMouseOver(10);

        this.stage.width = this.canvas.width;
        this.stage.height = this.canvas.height;

        //enable tap on touch device
        createjs.Touch.enable(this.stage);

        this.retinalize();

        //set frame per
        createjs.Ticker.setFPS(60);

        //game related initialization
        this.gameData = new GameData();

        //keep re-drawing the stage.
        createjs.Ticker.on("tick", this.stage)

        //generate the numbered boxes
        this.restartGame();
    }

    loadSound() {
        createjs.Sound.registerSound("soundfx/pick.wav", 'pick');
        createjs.Sound.registerSound("soundfx/gameover.wav", 'gameover');
        createjs.Sound.registerSound("soundfx/wrong.wav", 'wrong');
        createjs.Sound.alternateExtensions = ['ogg'];
    }

    generateMultipleBoxes(amount=10){
        for(var i=amount; i>0; i--){
            var movieClip = new NumberedBox(this, i);
            this.stage.addChild(movieClip);

            movieClip.x = Math.random() * (this.stage.width - movieClip.getBounds().width);
            movieClip.y = Math.random() * (this.stage.height - movieClip.getBounds().height - this.barHeight) + this.barHeight;
        }
    }

    handleClick(numberedBox){

        if (this.gameData.isRightNumber(numberedBox.number)){
            
            var cardScale = 0.3;
            var xOffset = 10;
            var yOffset = 3;
            var cardLocation = this.stage.width-(numberedBox.getBounds().width * cardScale) - xOffset;
            
            this.stage.setChildIndex( numberedBox, this.stage.getNumChildren()-1);

            createjs.Tween.get(numberedBox,{loop:false})
                .to({x:cardLocation, y:yOffset, scaleX:cardScale, scaleY:cardScale}, 400, createjs.Ease.getPowInOut(4))
            
            numberedBox.removeAllEventListeners();

            this.gameData.nextNumber();
            createjs.Sound.play('pick');

            //check if the player won
            if (this.gameData.isGameWin()){
                createjs.Sound.play('gameover');
                this.stage.addChild(new GameOverView(this));
            }
        } else {
            createjs.Sound.play('wrong');
            this.gameBar.text.text = this.gameData.numberOfMistakes;
        }
    }

    restartGame(){
        //reset
        this.gameData.resetData()
        this.stage.removeAllChildren();

        //load bar
        this.gameBar = new GameBar(this);
        this.stage.addChild(this.gameBar);
        this.gameBar.x = this.gameBar.y = 0;

        //load background
        var border = new createjs.Shape();
        border.graphics.s('black').ss(2).r(0,0,this.stage.width,this.stage.height);
        this.stage.addChild(border);

        //load boxes
        this.generateMultipleBoxes(this.gameData.amountOfBox);
    }

    retinalize(){
        this.stage.width = this.canvas.width;
        this.stage.height = this.canvas.height;

        let ratio = window.devicePixelRatio;
        if (ratio === undefined){
            return;
        }

        this.canvas.setAttribute('width', Math.round( this.stage.width * ratio))
        this.canvas.setAttribute('height', Math.round( this.stage.height * ratio))

        this.stage.scaleX = this.stage.scaleY = ratio;

        //set CSS style
        this.canvas.style.width = this.stage.width + "px";
        this.canvas.style.height = this.stage.height + "px";
    }
}

function init() {
    var game = new Game();
}
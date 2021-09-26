class NumberedBox extends createjs.Container{
    constructor(game, number=0){
        super();

        this.game= game;
        this.number = number;

        var boxWidth = 50;
        var boxHeight= 50;

        var movieClip = new createjs.Shape();
        
        movieClip.graphics
            .beginRadialGradientFill(["#FCD526","#E0AA22"], [0.1, 0.9], boxWidth/2, boxHeight/2, 0, 20, 20, 50)
            .beginStroke('#000000')
            .drawRect(0, 0, boxWidth,boxHeight);

        var text = new createjs.Text(number, "22px Gemunu Libre", "#000000");
        text.textAlign = 'center';
        text.textBaseline = 'middle';
        text.x = boxWidth / 2;
        text.y = boxHeight / 2;

        this.addChild(movieClip, text);
        this.setBounds(0,0,boxWidth,boxHeight);

        movieClip.on("mouseover",function(){
           
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
        
        //background
        var gameOverBackground = new createjs.Shape();
        gameOverBackground.graphics.beginFill('black').drawRect(0, 0, viewWidth,viewHeight);

        //you won text
        var text = new createjs.Text('You Won!!', "26px Arial", "#FFFFFF");
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
        var buttonText = new createjs.Text('Restart!!', "20px Arial", "#000000");
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
        this.resetData();
    }
    resetData(){
        this.currentNumber = 1;
    }
    nextNumber(){
        this.currentNumber += 1;
    }
    isRightNumber(number){
        return (number === this.currentNumber)
    }
    isGameWin(){
        return (this.currentNumber > this.amountOfBox);
    }
}

class Game{
    constructor(){
        console.log('Welcome to the game. Version', this.version());

        this.canvas = document.getElementById("game-canvas")
        this.stage = new createjs.Stage(this.canvas);

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

        //add the background

        //generate the numbered boxes
        this.generateMultipleBoxes(this.gameData.amountOfBox);
    }

    version(){
        return '1.0.0'
    }

    loadSound() {
        createjs.Sound.registerSound("soundfx/background.wav", 'background');
        createjs.Sound.registerSound("soundfx/sweep.wav", 'sweep');
        createjs.Sound.registerSound("soundfx/gameover.wav", 'gameover');
        createjs.Sound.alternateExtensions = ['ogg','aiff'];
    }

    generateMultipleBoxes(amount=10){
        for(var i=amount; i>0; i--){
            var movieClip = new NumberedBox(this, i);
            this.stage.addChild(movieClip);

            movieClip.x = Math.random() * (this.stage.width - movieClip.getBounds().width);
            movieClip.y = Math.random() * (this.stage.height - movieClip.getBounds().height);
        }
    }

    handleClick(numberedBox){

        if (this.gameData.isRightNumber(numberedBox.number)){

            numberedBox.number === 1? createjs.Sound.play('background',{loop: -1}) : null;
            
            createjs.Tween.get(numberedBox,{loop:false})
                .to({alpha: 0}, 1000, createjs.Ease.getPowInOut(4))

            setTimeout(() => {this.stage.removeChild(numberedBox); }, 1000);

            this.gameData.nextNumber();
            createjs.Sound.play('sweep')

            //check if the player won
            if (this.gameData.isGameWin()){
                createjs.Sound.stop();
                createjs.Sound.play('gameover')
                this.stage.addChild(new GameOverView(this));
            }
        }
    }

    restartGame(){
        this.gameData.resetData()
        this.stage.removeAllChildren();
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
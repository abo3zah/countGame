class boxWithText extends createjs.Container{
    constructor(clickEvent= [false,'', ''] , caption='Hi', fontParameters="20px Arial", color='#FCD526', width=50, height=50){
        super();

        this.game = clickEvent[1];
        
        var box = new createjs.Shape();
        
        box.graphics
            .beginLinearGradientFill([color,'white',color], [0.1, 0.8 ,1], 0, 0, 0,height)
            .beginStroke('#000000')
            .drawRect(0, 0, width,height);

        var text = new createjs.Text(caption, fontParameters, "#000000");
        text.textAlign = 'center';
        text.textBaseline = 'middle';
        text.x = width / 2;
        text.y = height / 2;

        this.addChild(box, text);
        this.setBounds(0,0,width,height);

        this.on("mouseover",function(){
            box.graphics.beginLinearGradientFill(['white',color,'white'], [0.1, 0.8 ,1], 0, 0, 0,height).beginStroke('#000000').drawRect(0, 0, width,height);
        })

        this.on("mouseout",function(){
            box.graphics.beginLinearGradientFill([color,'white',color], [0.1, 0.8 ,1], 0, 0, 0,height).beginStroke('#000000').drawRect(0, 0, width,height);
        })

        clickEvent[0] == true ? this.on('click',this.game[clickEvent[2]].bind(this)) : null
    }
}

class Game{
    constructor(){

        this.canvas = document.getElementById("game-canvas")
        this.stage = new createjs.Stage(this.canvas);

        this.stage.width = this.canvas.width;
        this.stage.height = this.canvas.height;

        this.stage.enableMouseOver(10);

        //set frame per
        createjs.Ticker.setFPS(60);

        //keep re-drawing the stage.
        createjs.Ticker.on("tick", this.stage)

        //test
        this.generateMultipleBoxes();
    }

    generateMultipleBoxes(amount=10){
        for (let i = amount; i > 0; i--) {
            var box = new boxWithText([true, this, 'sayHi'],i);
            //i==10?console.log(box):null;
            //box.on('click',this.sayHi());
            this.stage.addChild(box);
            box.x = Math.random() * (this.stage.width - box.getBounds().width);
            box.y = Math.random() * (this.stage.height - box.getBounds().height);
        }
    }

    sayHi(box){
        console.log(box);
    }
}

function init() {
    var game = new Game();
}
let columns = 7;
let rows = 6;

class Player
{
    constructor(id)
    {
        this.id = id;
    }
}

class Cell
{
    constructor(id)
    {
        this.id = id
        this.active = true
    }
}

class Game
{
    constructor()
    {
        this.player1 = new Player(1);
        this.player2 = new Player(2);
        this.cell_list = []

        for (let r = 0; r < rows; r++)
        {
            this.cell_list.push([])
            for (let c = 0; c < columns; c++)
            {
                this.cell_list[r].push(new Cell(""+r + ""+c));
            }
        }
    }

    findCell(id)
    {
        for (let r = 0; r < rows; r++)
        {
            for (let c = 0; c < columns; c++)
            {
                if (this.cell_list[r][c].id == id)
                {
                    console.log(""+r+""+c)
                    return this.cell_list[r][c]
                }
            }
        }
    }


    insertPiece(button)
    {
        let cell = this.findCell(button.id)
        if (cell.active)
        {
            cell.active = false
            if (document.getElementById("player").className == "player1")
            {
                button.style.background='#FF0000';
                document.getElementById("player").className = "player2"
            }
            else
            {
                button.style.background='#FFFF00';
                document.getElementById("player").className = "player1"
            }
        }
    }
}

class View
{
    constructor(grid)
    {
        this.grid = grid;
    }

    connectToGame(game) 
    {
        let index = 0;
        for (let button of this.grid.getElementsByTagName("button"))
        {
            button.addEventListener("click", () => game.insertPiece(button), false);
            index++;
        }  
        
    }
}



const view = new View(document.getElementsByClassName("grid")[0]);
const game = new Game();
view.connectToGame(game);
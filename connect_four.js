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
        this.used = true
        
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

    findNearestFreeColumnPlace(row)
    {
        for (let column = 0; column< columns; column++)
        {
            if (this.cell_list[row][column].used == false)
            {
                return row - 1
            }
        }
        return row - 1
    }


    insertPiece(button)
    {
        let cell = this.findCell(button.id)
        let color = ''
        if (cell.used)
        {
            cell.used = false
            if (document.getElementById("player").className == "player1")
            {
                color = '#FF0000'
                document.getElementById("player").className = "player2"
            }
            else
            {
                color = '#FFFF00'
                document.getElementById("player").className = "player1"
            }
            document.getElementById(""+cell.id[0]+""+this.findNearestFreeColumnPlace(cell.id[1])).style.background=color;//red
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

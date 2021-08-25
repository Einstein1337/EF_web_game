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
        this.used = false
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
            this.cell_list.push([]);
            for (let c = 0; c < columns; c++)
            {
                let id = ""+r + ""+c;
                this.cell_list[r].push(new Cell(id));
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
                    return this.cell_list[r][c];
                }
            }
        }
    }

    findNearestFreeColumnPlace(column)
    {
        for (let row = 0; row < rows; row++)
        {
            if (this.cell_list[row][column].used == true)
            {
                return row - 1;
            }
        }
        return rows - 1;
    }


    insertPiece(button)
    {
        let cell = this.findCell(button.id)
        let color = ''
        if (!cell.used)
        {
            cell.used = false
            if (document.getElementById("player").className == "player1")
            {
                color = '#FF0000';
                document.getElementById("player").className = "player2";
            }
            else
            {
                color = '#FFFF00';
                document.getElementById("player").className = "player1";
            }
            let free_row = this.findNearestFreeColumnPlace(parseInt(cell.id[1]))
            this.cell_list[free_row][cell.id[1]].used = true
            document.getElementById(""+free_row+""+parseInt(cell.id[1])).style.background=color;//red
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

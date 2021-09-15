let columns = 7;
let rows = 6;

class Cell
{
    constructor(id)
    {
        this.id = id
        this.used = false
        this.color = ""
    }
}

class Game
{
    constructor()
    {
        this.id = 0
        this.state = ""
        this.able_to_find_new_game = true
        this.player = 0
        this.cell_list = []
        this.able_to_click = false
        this.myTurn = false
        this.player = ""
        this.player_color = ''
        this.player_color_str = ""

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


    updateGame(data)
    {
        this.able_to_click = data.turn
        this.state = data.state
        if (this.state == "win")
        {
            this.able_to_find_new_game = true;
        }
        if (this.able_to_click == true)
        {
            document.getElementById("player").className = this.player;
        }
        for (let r = 0; r < rows; r++)
        {
            for (let c = 0; c < columns; c++)
            {
                if(data.cli[r][c] == 1)
                {
                    this.cell_list[r][c].used = true;
                    this.cell_list[r][c].color = "red";
                    document.getElementById(""+r+""+c).style.background='#FF0000';
                }
                else if(data.cli[r][c] == 2)
                {
                    this.cell_list[r][c].used = true;
                    this.cell_list[r][c].color = "yellow";
                    document.getElementById(""+r+""+c).style.background='#FFFF00';
                }
                else
                {
                    this.cell_list[r][c].used = false;
                    this.cell_list[r][c].color = "";
                    document.getElementById(""+r+""+c).style.background='#808080';
                }
            }
        }
    }

    async fetchCurrentGame()
    {
        if(!this.able_to_click)
            try {
                const response = await fetch(`/gamestate/${this.player}/${this.id}`);
                const json = await response.json();
                this.updateGame(json);
            } catch (error) {
                console.log(error);
            }
    }

    // wait ms milliseconds
    wait(ms) 
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
        
    /** Poll the current game while it's their turn. */
    async pollState() 
    {
        while (this.state == "theirturn" || this.state == "waiting")
            {
                await this.wait(1000);
                await this.fetchCurrentGame();
            }
    }

    async newGame()
    {
        if(this.able_to_find_new_game)
        {
            this.able_to_find_new_game = false
            try {
                const response = await fetch('/newgame');
                const json = await response.json();
                this.player = json.player;
                this.id = json.id;
                if (this.player == "player1")
                {
                    this.player_color = '#FF0000';
                    this.player_color_str = "red"
                }
                else
                {
                    this.player_color = '#FFFF00';
                    this.player_color_str = "yellow"
                }
                this.updateGame(json);
                this.pollState()
            } catch (error) {
                console.log(error);
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

    async fetchMove(row, column)
    {
        try {
            const response = await fetch(`/move/${this.player}/${this.id}/${row}/${column}`);
            const json = await response.json();
            this.updateGame(json);
        } catch (error) {
            console.log(error);
        }
    }

    insertPiece(button)
    {
        if (this.able_to_click)
        {
            let cell = this.findCell(button.id);
            if (!cell.used)
            {
                cell.used = false;
                let free_row = this.findNearestFreeColumnPlace(parseInt(cell.id[1]));
                this.cell_list[free_row][parseInt(cell.id[1])].used = true;
                this.cell_list[free_row][parseInt(cell.id[1])].color = this.player_color_str;
                document.getElementById(""+free_row+""+parseInt(cell.id[1])).style.background=this.player_color;//red
                this.able_to_click = false;
                document.getElementById("player").className = "notmyturn";
                this.fetchMove(free_row, parseInt(cell.id[1]));
                this.state = "theirturn";
                this.pollState();
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
        document.getElementById("NewGame").addEventListener("click", () => game.newGame(), false)
    }
}



const view = new View(document.getElementsByClassName("grid")[0]);
const game = new Game();
view.connectToGame(game);

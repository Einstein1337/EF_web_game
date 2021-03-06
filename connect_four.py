from werkzeug.utils import header_property


ROWS = 6
COLUMNS = 7

class Player:
    def __init__(self, id, color, hex_color):
        self.id = id
        self.str = f"player{self.id}"
        self.color = color
        self.hex_color = hex_color


class Cell:
    def __init__(self, id):
        self.id = id
        self.used = False
        self.color = ""

class Game:
    def __init__(self, id):
        self.id = id
        self.state = "waiting"
        self.player1 = Player(1, "red", '#FF0000')
        self.player2 = Player(2, "yellow", '#FFFF00')
        self.currentPlayer = self.player1
        self.cell_list = []

        for r in range(ROWS):
            self.cell_list.append([])
            for c in range(COLUMNS):
                self.cell_list[r].append(Cell(f"{r}{c}"))

    def Join(self):
        self.state = "running"
        return self.player2.str
    

    def fieldEvaluation(self, last_token_row, last_token_column, last_color):
        i_j_list = [[-1, 1],[0, 1],[1, 1],[1, 0]]
        for dir in range(4):
            winning_index = 0
            no_win = False
            i = i_j_list[dir][0]
            j = i_j_list[dir][1]
            running_var = 1
            for neighbour in range(4):
                fail = False
                next_row = last_token_row+i*running_var
                next_column = last_token_column+j*running_var

                if next_row <= ROWS-1 and next_column <= COLUMNS-1 and next_row >= 0 and next_column >= 0:
                    if self.cell_list[next_row][next_column].color != last_color:
                        fail = True
                    else:
                        winning_index += 1
                else:
                    fail = True

                if fail:
                    if no_win:
                        break
                    else:
                        i *= -1
                        j *= -1
                        no_win == True
                        running_var = 0

                if winning_index == 3:
                    return True
                running_var += 1
        return False

    def cellState(self):
        cell_list_int = []
        for r in range(ROWS):
            cell_list_int.append([])
            for c in range(COLUMNS):
                if self.cell_list[r][c].used == False:
                    cell_list_int[r].append(0)
                elif self.cell_list[r][c].color == "red":
                    cell_list_int[r].append(1)
                elif self.cell_list[r][c].color == "yellow":
                    cell_list_int[r].append(2)
        return cell_list_int
                

    def move(self, row, column):
        if self.state == "running":
            cell = self.cell_list[row][column]
            cell.used = True
            cell.color = self.currentPlayer.color

            if self.fieldEvaluation(row, column, self.currentPlayer.color):
                self.state = f"{self.currentPlayer.color} wins" 

                for r in self.cell_list:
                    for c in r:
                        c.used = True
                        c.color = self.currentPlayer.color  
                            
                        

            if self.currentPlayer.id == 1:
                self.currentPlayer = self.player2
            else:
                self.currentPlayer = self.player1

    def sm(self, row, column, color):
        cell = self.cell_list[row][column]
        if color == "red" or color == "yellow":
            cell.used = True
            cell.color = color
        else:
            cell.used = False
        
        if self.fieldEvaluation(row, column, color):
            self.state = f"{color} wins" 

            for r in self.cell_list:
                for c in r:
                  c.used = True
                  c.color = color  

    def win(self, color):
        self.state = f"{color} wins" 

        for r in self.cell_list:
            for c in r:
                c.used = True
                c.color = color
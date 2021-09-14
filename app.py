from os import truncate
from flask import Flask
from flask import session
from werkzeug.utils import redirect
from flask import render_template
from connect_four import *
import random
from flask import jsonify

game_list = []
next_game_id = 0
default_cell_list = []
for r in range(6):
    default_cell_list.append([])
    for c in range(7):
        default_cell_list[r].append(0)

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('connect_four.html')#redirect(url_for('static', filename='connect_four.html'))

@app.route("/newgame")
def newGame():
    global next_game_id
    if len(game_list) > 0:
        for game in game_list:
            if game.state == "waiting":
               player_str = game.Join()
               return jsonify(player=player_str, turn=False, id=game.id, cli=game.cellState(), state="theirturn")
        game_list.append(Game(next_game_id))
        next_game_id +=1 

        cg = game_list[-1]
        return  jsonify(player=cg.currentPlayer.str, turn=False, id=cg.id, cli=cg.cellState(), state="waiting")
            
    else: 
        game_list.append(Game(next_game_id))
        next_game_id +=1 
        
        cg = game_list[-1]
        return  jsonify(player=cg.currentPlayer.str, turn=False, id=cg.id, cli=cg.cellState(), state="waiting")

@app.route("/gamestate/<player>/<int:game_id>")
def gameState(player, game_id):
    for game in game_list:
        if game.id == game_id:
            if game.state == "running":
                if game.currentPlayer.str == player:
                    state = "myturn"
                    turn = True
                else:
                    state = "theirturn"
                    turn = False
                return  jsonify(turn=turn, cli=game.cellState(), state=state)
            else:
                return  jsonify(turn=False, cli=game.cellState(), state=game.state)

@app.route("/move/<player>/<int:game_id>/<int:row>/<int:column>")
def move(player, game_id, row, column):
    for game in game_list:
        if game.id == game_id:
            game.move(row, column)
            return jsonify(turn=False, cli=game.cellState(), state="theirturn")
            

    
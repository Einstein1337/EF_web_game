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
            if game.mode != "running":
               player_str = game.Join()
               return jsonify(player=player_str, turn=True, id=game.id, cli=default_cell_list)
        game_list.append(Game(next_game_id))
        next_game_id +=1 
        
        cg = game_list[-1]
        return  jsonify(player=cg.currentPlayer.str, turn=False, id=cg.id, cli=default_cell_list)
            
    else: 
        game_list.append(Game(next_game_id))
        next_game_id +=1 
        
        cg = game_list[-1]
        return  jsonify(player=cg.currentPlayer.str, turn=False, id=cg.id, cli=default_cell_list)

@app.route("/gamestate/<player>/<int:game_id>")
def gameState(player, game_id):
    for game in game_list:
        if game.id == game_id:
            if game.currentPlayer.str == player:
                turn = True
            else:
                turn = False
            cell_list_int = game.cellState()
            return  jsonify(turn=turn, cli=cell_list_int)
            

    
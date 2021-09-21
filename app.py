from os import stat, truncate
import os
from flask import Flask
from flask import session
from werkzeug.utils import redirect
from flask import render_template, abort
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
app.secret_key = os.urandom(16)

@app.route("/")
def index():
    return render_template('connect_four.html')

@app.route("/newgame", methods=['POST'])
def newGame():
    global next_game_id
    if len(game_list) > 0:
        for game in game_list:
            if game.state == "waiting":
               player_str = game.Join()
               session["gameID"] = game.id
               return jsonify(player=player_str, turn=False, id=game.id, cli=game.cellState(), state="theirturn")
        game_list.append(Game(next_game_id))
        session["gameID"] = next_game_id
        next_game_id +=1 

        cg = game_list[-1]
        return  jsonify(player=cg.currentPlayer.str, turn=False, id=cg.id, cli=cg.cellState(), state="waiting")
            
    else: 
        game_list.append(Game(next_game_id))
        session["gameID"] = next_game_id
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

@app.route("/move/<int:game_id>/<int:row>/<int:column>", methods=['POST'])
def move(game_id, row, column):
    if not "gameID" in session:
        abort(403)  # go away, not your game! Forbidden
    game_id_from_session = session["gameID"]
    if game_id != game_id_from_session:
        abort(403)  # go away, not your game! Forbidden
    for game in game_list:
        if game.id == game_id:
            game.move(row, column)
            if game.state == "red wins" or game.state == "yellow wins":
                state = game.state
            else:
                state = "theirturn"
            return jsonify(turn=False, cli=game.cellState(), state=state)
            

    
from flask import Flask
from flask import session
from werkzeug.utils import redirect
from flask import render_template
from connect_four import *
import random

game_list = []
next_game_id = 0


app = Flask(__name__)

@app.route("/")
def index():
    return render_template('connect_four.html')#redirect(url_for('static', filename='connect_four.html'))

@app.route("/newgame")
def newGame():
    if len(game_list) > 0:
        for game in game_list:
            if game.mode != "running":
                game.Join()
    else: 
        game_list.append(Game(next_game_id))
        next_game_id += 1
        
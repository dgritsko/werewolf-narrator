from bottle import route, run, static_file, post, request
from pymongo import MongoClient


def get_client():
    return MongoClient('localhost:27017')


@route('/api/games')
def games_collection():
    client = get_client()
    games = client['werewolf']['games'].find()

    result = []
    for game in games:
        result.append({'name': game.get('name')})
    return {'games': result}


@post('/api/games')
def create_game():
    game_name = request.json['name']
    client = get_client()
    client['werewolf']['games'].insert({'name': game_name})
    return {'result': 'ok'}


@route('/')
def index():
    return static_file('index.html', root='static')


@route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='static')


# Run the server
run(host='localhost', port=8080, debug=True)
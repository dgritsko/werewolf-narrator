from bottle import route, run, static_file, post, request, abort
from pymongo import MongoClient


def get_client():
    return MongoClient('localhost:27017')


@route('/api/games')
def games_collection():
    client = get_client()
    games = client['werewolf']['games'].find()

    return {'games': [x for x in games]}


@post('/api/games')
def create_game():
    game_name = request.json['name']

    client = get_client()
    game_id = client['werewolf']['games'].count()

    client['werewolf']['games'].insert({
        'name': game_name,
        '_id': game_id
    })

    return {'result': 'ok'}


@route('/api/games/<game_id:int>')
def game_detail(game_id):
    client = get_client()
    game = client['werewolf']['games'].find_one({'_id': game_id})

    if game is None:
        abort(404, 'no such game')

    return game

@route('/')
def index():
    return static_file('index.html', root='static')


@route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='static')


# Run the server
run(host='localhost', port=8080, debug=True)
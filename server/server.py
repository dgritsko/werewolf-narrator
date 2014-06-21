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
    owner_key = request.json['key']

    client = get_client()
    game_id = client['werewolf']['games'].count()

    client['werewolf']['games'].insert({
        'name': game_name,
        '_id': game_id,
        'owner_key': owner_key
    })

    return {'result': 'ok'}


@route('/api/games/<game_id:int>')
def game_detail(game_id):
    client = get_client()
    game = client['werewolf']['games'].find_one({'_id': game_id})

    if game is None:
        abort(404, 'no such game')

    return game


@route('/api/games/<game_id:int>/players')
def players_collection(game_id):
    client = get_client()
    game = client['werewolf']['games'].find_one({'_id': game_id})

    if game is None:
        abort(404, 'no such game')

    players = client['werewolf']['players'].find({'game_id': game_id})

    def player_select(x):
        return {'name': x.get('name')}

    return {'players': [player_select(x) for x in players]}


@post('/api/games/<game_id:int>/players')
def create_player(game_id):
    client = get_client()
    game = client['werewolf']['games'].find_one({'_id': game_id})

    if game is None:
        abort(404, 'no such game')

    player_key = request.json['key']
    player_name = request.json['name']

    if player_key is None or player_name is None:
        abort(412, 'key and name are required')

    player = client['werewolf']['players'].find_one({'key': player_key, 'game_id': game_id})

    if player is None:
        client['werewolf']['players'].insert({'key': player_key, 'name': player_name, 'game_id': game_id})

    return {'result': 'ok'}


@route('/')
def index():
    return static_file('index.html', root='static')


@route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='static')


# Run the server
run(host='localhost', port=8080, debug=True)
from bottle import route, run, static_file

@route('/')
def index():
    return static_file('index.html', root='static')

@route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='static')

run(host='localhost', port=8080, debug=True)
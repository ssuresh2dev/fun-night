from templates import app, socketio


@socketio.on('change color')
def change_color(color):
    raise Exception


if __name__ == '__main__':
    socketio.init_app(app, cors_allowed_origins='*')
    socketio.run(app, debug=True)
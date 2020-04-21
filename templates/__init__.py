from flask import Flask
from flask_socketio import SocketIO
from templates.src.views import blueprint

app = Flask(__name__,
            static_folder='./public',
            template_folder="./static")
app.register_blueprint(blueprint)

socketio = SocketIO(app)

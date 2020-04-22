from flask import Flask

app = Flask(__name__,
            static_folder='./public',
            template_folder="./static")
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

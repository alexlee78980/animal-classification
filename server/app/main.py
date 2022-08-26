from flask import Flask, request, jsonify
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy
import tensorflow as tf
from flask_cors import CORS
from urllib.request import urlopen
import numpy as np
from PIL import Image
import cv2
import os
app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})
api = Api(app)
video_put_args = reqparse.RequestParser()
video_put_args.add_argument("url", type=str, help="url of the picture")

classnames = ['antelope',
 'badger',
 'bat',
 'bear',
 'bee',
 'beetle',
 'bison',
 'boar',
 'butterfly',
 'cat',
 'caterpillar',
 'chimpanzee',
 'cockroach',
 'cow',
 'coyote',
 'crab',
 'crow',
 'deer',
 'dog',
 'dolphin',
 'donkey',
 'dragonfly',
 'duck',
 'eagle',
 'elephant',
 'flamingo',
 'fly',
 'fox',
 'goat',
 'goldfish',
 'goose',
 'gorilla',
 'grasshopper',
 'hamster',
 'hare',
 'hedgehog',
 'hippopotamus',
 'hornbill',
 'horse',
 'human',
 'hummingbird',
 'hyena',
 'jellyfish',
 'kangaroo',
 'koala',
 'ladybugs',
 'leopard',
 'lion',
 'lizard',
 'lobster',
 'mosquito',
 'moth',
 'mouse',
 'octopus',
 'okapi',
 'orangutan',
 'otter',
 'owl',
 'ox',
 'oyster',
 'panda',
 'parrot',
 'pelecaniformes',
 'penguin',
 'pig',
 'pigeon',
 'porcupine',
 'possum',
 'raccoon',
 'rat',
 'reindeer',
 'rhinoceros',
 'sandpiper',
 'seahorse',
 'seal',
 'shark',
 'sheep',
 'snake',
 'sparrow',
 'squid',
 'squirrel',
 'starfish',
 'swan',
 'tiger',
 'turkey',
 'turtle',
 'whale',
 'wolf',
 'wombat',
 'woodpecker',
 'zebra']
img_size = 600
@app.route("/im_size", methods=["POST"])
def process_image():
    model = tf.keras.models.load_model('app/animal_recong.h5')
    file = request.files['image']
    # Read the image via file.stream
    img = Image.open(file.stream)
    print(file)
    print(file.stream)
    img_array = tf.keras.utils.img_to_array(img)
    img_array = tf.image.resize(img_array, [img_size,img_size])
    img_array = tf.expand_dims(img_array, 0) # Create a batch
    predictions = model.predict(img_array)
    score = tf.nn.softmax(predictions[0])
    print(classnames[np.argmax(score)])
    return {"data": classnames[np.argmax(score)]}
class Calculate(Resource):
    def put(self):
        args = video_put_args.parse_args()
        model = tf.keras.models.load_model('app/animal_recong.h5')
        print(args.url)
        def get(url):
            with urlopen(str(url.numpy().decode("utf-8"))) as request:
                img_array = np.asarray(bytearray(request.read()), dtype=np.uint8)
            img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
            return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        def read_image_from_url(url):
            return tf.py_function(get, [url], tf.uint8)
        dataset_images = read_image_from_url(args.url)
        dataset_images = tf.image.resize(dataset_images, [img_size,img_size])
        img_array = tf.expand_dims(dataset_images, 0) # Create a batch
        predictions = model.predict(img_array)
        score = tf.nn.softmax(predictions[0])
        return {"data": classnames[np.argmax(score)]}
    def get(self):
        print("test")
        return {"data": "a"}

api.add_resource(Calculate, "/")

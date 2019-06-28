from flask import Flask,render_template,jsonify
import pandas as pd

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/map')
def map():
    return render_template('map.html')

@app.route('/table')
def table():
    return render_template('table.html')

@app.route('/data')
def data():

    df = pd.read_csv('datasets/data.csv')
    return jsonify(df.to_dict(orient="records"))


if __name__ == "__main__":
    app.run(debug=True)
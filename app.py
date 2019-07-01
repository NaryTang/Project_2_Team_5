from flask import Flask,render_template,jsonify
import pandas as pd

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/map')
def map():
    return render_template('map.html')

@app.route('/2017')
def table():
    return render_template('2017.html')

@app.route('/data')
def data():

    df = pd.read_csv('datasets/data.csv')
    return jsonify(df.to_dict(orient="records"))

@app.route('/annual_data')
def tabledata():

    annual_df = pd.read_csv('datasets/annual_data.csv')
    return jsonify(annual_df.to_dict(orient="records"))

if __name__ == "__main__":
    app.run(debug=True)
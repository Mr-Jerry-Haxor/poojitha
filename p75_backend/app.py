from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies, get_jwt
from flask_cors import CORS
from datetime import datetime, timedelta, timezone
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"msg": "Missing username or password"}), 400
    user = User.query.filter_by(username=data['username']).first()
    if user and user.password == data['password']:
        access_token = create_access_token(identity=user.username)
        return jsonify(access_token=access_token)
    return jsonify({"msg": "Bad username or password"}), 401

@app.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

@app.route('/summary', methods=['GET'])
@jwt_required()
def summary():
    chart_data = {
        "labels": ["January", "February", "March", "April", "May"],
        "datasets": [{
            "label": "Summary Data",
            "data": [65, 59, 80, 81, 56],
            "backgroundColor": "rgba(75,192,192,0.4)",
            "borderColor": "rgba(75,192,192,1)",
            "borderWidth": 1
        }]
    }
    return jsonify(chart_data), 200

@app.route('/reports', methods=['GET'])
@jwt_required()
def reports():
    chart_data = {
        "labels": ["June", "July", "August", "September", "October"],
        "datasets": [{
            "label": "Reports Data",
            "data": [28, 48, 40, 19, 86],
            "backgroundColor": "rgba(153,102,255,0.4)",
            "borderColor": "rgba(153,102,255,1)",
            "borderWidth": 1
        }]
    }
    return jsonify(chart_data), 200

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        return response

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        if not User.query.filter_by(username='p75').first():
            new_user = User(username='p75', password='p75')
            db.session.add(new_user)
            db.session.commit()
    app.run(port=8000)
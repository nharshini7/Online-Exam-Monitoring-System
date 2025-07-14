# backend/app.py
from flask import Flask, request, jsonify, session, redirect, Response, url_for, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from pymongo import MongoClient
import re
import pandas as pd
import pickle
import cv2
from onlineproctor import head_pose_detect, detect_phone_person, detect_faces_wc
import torch
import csv
import time
from datetime import datetime
import face_recognition
import warnings
import certifi
import torch.cuda.amp as amp
import bcrypt
import json

app = Flask(__name__)
app.secret_key = 'your_secret_key'

app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
jwt = JWTManager(app)
mongo_uri = "mongodb+srv://admin:admin@cluster0.fv8uf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(mongo_uri,tlsCAFile=certifi.where())
db = client['studentdata']
collection = db['student']
submissions_collection = db['submissions']
cheating_logs_collection = db['cheating_logs']

# Submission file paths
SUBMISSIONS_CSV = 'submissions.csv'
SUBMISSIONS_JSON = 'submissions.json'

# Global variables
images = {}  # To store the loaded face images
encoding = {}  # To store the face encodings
known_face_encodings = []  # List to store known face encodings
known_face_names = []  # List to store known usernames
index = 0  # Initialize your index variable here, it can be 1 or any starting value

# Enable CORS for all routes (you can restrict origins as needed)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Suppress specific FutureWarnings
warnings.filterwarnings("ignore", category=FutureWarning)

# Load YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
model.eval()  # Set the model to evaluation mode

# Use CUDA if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Ensure directories exist
if not os.path.exists("face_images"):
    os.mkdir("face_images")

# Load or initialize known faces
if not os.path.exists('known_face_names.txt'):
    known_face_names = []
    with open('known_face_names.txt', 'wb') as fp:
        pickle.dump(known_face_names, fp)
else:
    with open('known_face_names.txt', 'rb') as fp:
        known_face_names = pickle.load(fp)

if os.path.exists('known_face_encodings.txt'):
    with open('known_face_encodings.txt', 'rb') as fp:
        known_face_encodings = pickle.load(fp)
else:
    known_face_encodings = []

# Load or initialize candidates
if not os.path.exists("candidates.csv"):
    candidates = pd.DataFrame(columns=['id', 'username', 'password', 'gender'])
    candidates.to_csv('candidates.csv', index=False)
else:
    candidates = pd.read_csv('candidates.csv')

# Initialize submission files if they don't exist
def init_submission_files():
    # Initialize CSV file
    if not os.path.exists(SUBMISSIONS_CSV):
        with open(SUBMISSIONS_CSV, 'w', newline='') as csvfile:
            fieldnames = ['examID', 'subject', 'title', 'date', 'username', 
                         'answers', 'score', 'timestamp']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
    
    # Initialize JSON file
    if not os.path.exists(SUBMISSIONS_JSON):
        with open(SUBMISSIONS_JSON, 'w') as jsonfile:
            json.dump([], jsonfile)

init_submission_files()


# def make_encoding(username,known_face_encodings, file_path):
#     images[username]=face_recognition.load_image_file(file_path)
#     encoding[username]=face_recognition.face_encodings(images[username])[0]
#     known_face_encodings.append(encoding[username])

# function that generates frame and process it to recognise face, detect mobile phones and head position
def detect_faces_wc(known_face_encodings, known_face_names, frame):
    try:
        # Convert the frame to RGB format
        rgb_small_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
        
        # Initialize name to handle unknown cases
        detected_faces = []

        for face_encoding, face_location in zip(face_encodings, face_locations):
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)

            print("Comparing with known faces:")
            print(f"Face Encoding Shape: {face_encoding.shape}")
            print(f"Known Face Encodings: {[e.shape for e in known_face_encodings]}")
            print(f"Matches: {matches}")

            # Default to unknown
            name = "Unknown"

            if True in matches:
                matched_idx = matches.index(True)
                name = known_face_names[matched_idx]
            
            # Add face details to the list of detected faces
            detected_faces.append((face_location, name))

    except Exception as e:
        print(f"Error in face recognition: {e}")
        detected_faces = []  # Return an empty list on error

    return detected_faces

def generate_frames(model, known_face_encodings, known_face_names, username):
    camera = cv2.VideoCapture(0)
    global index

    # Filter known encodings and names to only the logged-in user
    if username in known_face_names:
        user_index = known_face_names.index(username)
        user_face_encoding = [known_face_encodings[user_index]]
        user_face_name = [username]
    else:
        user_face_encoding = []
        user_face_name = ["Unknown"]

    last_detection_time = None
    submit_test = False
    unknown_person_detected = False
    unknown_person_detection_start_time = None
    device_detected = False
    device_detection_start_time = None

    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            # Detect faces using only the logged-in user's encoding
            detected_faces = detect_faces_wc(user_face_encoding, user_face_name, frame)
            for (top, right, bottom, left), name in detected_faces:
                if name == username:
                    color = (0, 255, 0)  # Green box for the logged-in user
                    cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
                    cv2.putText(frame, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)
                    unknown_person_detected = False
                else:
                    color = (0, 0, 255)  # Red box for unknown persons
                    cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
                    cv2.putText(frame, "Unknown", (left + 6, bottom - 6), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)
                    if not unknown_person_detected:
                        unknown_person_detection_start_time = time.time()
                        unknown_person_detected = True

            # Additional checks for head pose and device detection
            head_pos_text = head_pose_detect(frame)
            if head_pos_text != 'Forward':
                cv2.putText(frame, head_pos_text, (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
                last_detection_time = time.time()

            obj_det_text = detect_phone_person(model, frame)
            if obj_det_text != ' ':
                cv2.putText(frame, obj_det_text, (20, 150), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
                last_detection_time = time.time()
                submit_test = True
                if not device_detected:
                    device_detection_start_time = time.time()
                    device_detected = True
            else:
                device_detected = False

            # Log unknown person detection into MongoDB
            if unknown_person_detected and time.time() - unknown_person_detection_start_time > 5:
                cheating_logs_collection.insert_one({
                    'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'username': username if username else 'Unknown',
                    'action': 'Unknown person detected for at least 5 seconds'
                })
                # Save snapshot
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                snapshot_path = f"cheating_snapshot_{username}_{timestamp}.jpg"
                cv2.imwrite(snapshot_path, frame)
                print(f"Cheating snapshot saved: {snapshot_path}")
                
                unknown_person_detection_start_time = None
                unknown_person_detected = False

            # Log device detection into MongoDB
            if device_detected and time.time() - device_detection_start_time > 2:
                cheating_logs_collection.insert_one({
                    'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                    'username': username if username else 'Unknown',
                    'action': 'Device detected for at least 2 seconds'
                })
                # Save snapshot
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                snapshot_path = f"cheating_snapshot_{username}_{timestamp}.jpg"
                cv2.imwrite(snapshot_path, frame)
                print(f"Cheating snapshot saved: {snapshot_path}")
                
                device_detection_start_time = None
                device_detected = False

            # Encode and yield frame for display
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    camera.release()
    cv2.destroyAllWindows()

      


# def get_next_index():
#     try:
#         candidates = pd.read_csv('candidates.csv')
#         # Get the maximum index from the existing candidates
#         max_id = candidates['id'].max()
#         return max_id + 1 if not pd.isnull(max_id) else 0
#     except FileNotFoundError:
#         return 0  # If the file doesn't exist, start from index 0

# API Route for Registration

    
@app.route("/api/register", methods=["POST"])
def register():
    msg = ""
    try:
        # Retrieve form data
        files = request.files.get("filename")
        username = request.form.get("Username")
        password = request.form.get("psw")
        gender = request.form.get("gender")
        firstname = request.form.get("Firstname")
        lastname = request.form.get("Lastname")
        
        # Validation
        if not username or not password or not gender or not files:
            msg = 'Please fill out the form!'
            return jsonify({"msg": msg}), 400
        
        if collection.find_one({"username": username}):
            msg = 'Account already exists!'
            return jsonify({"msg": msg}), 400
        
        # Save the uploaded image
        file_extension = files.filename.split('.')[-1]
        file_path = os.path.join("face_images", f"{username}.{file_extension}")
        files.save(file_path)
        
        # Create face encoding for the new user
        image = face_recognition.load_image_file(file_path)
        face_encodings = face_recognition.face_encodings(image)
        if face_encodings:
            face_encoding = face_encodings[0]
            known_face_encodings.append(face_encoding)
            known_face_names.append(username)
            print(f"Added face encoding for {username}: {face_encoding}")
        else:
            msg = 'No face detected in the image!'
            print(msg)
            return jsonify({"msg": msg}), 400

        # Update known faces
        with open('known_face_names.txt', 'wb') as fp:
            pickle.dump(known_face_names, fp)
        with open('known_face_encodings.txt', 'wb') as fp:
            pickle.dump(known_face_encodings, fp)
        
        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create the new user record
        new_user = {
            'username': username,
            'password': hashed_password.decode('utf-8'),
            'gender': gender,
            'firstname': firstname,
            'lastname': lastname,
            'exams': []
            # 'face_encoding': face_encoding.tolist()  # Convert numpy array to list
        }

        # Insert the new user into the MongoDB collection
        collection.insert_one(new_user)

        msg = "Registration successful!"
        return jsonify({"msg": msg}), 200
    except Exception as e:
        msg = f"An error occurred: {str(e)}"
        return jsonify({"msg": msg}), 500
    

# Modify /api/signin to return a JWT and store username in session

@app.route("/api/signin", methods=["POST"])
def signin():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"msg": "Please provide both username and password"}), 400

        user = collection.find_one({"username": username})
        if user:
            stored_password = user['password'].encode('utf-8')
            if bcrypt.checkpw(password.encode('utf-8'), stored_password):
                access_token = create_access_token(identity=username)
                session['loggedin'] = True  # Optional: Store login state in session
                session['username'] = username  # Store username in session
                # session['id'] = int(user['id'].values[0])   # Store user id in session
                # print("Username: ", user)

                # Remove '_id' field from user
                user.pop('_id', None)
                user.pop('password', None)  # Remove password if it's included
                
                return jsonify({"msg": "Sign-in successful", "access_token": access_token, "user": user}), 200
            else:
                return jsonify({"msg": "Invalid username or password"}), 401
        else:
            return jsonify({"msg": "Invalid username or password"}), 401
    except Exception as e:
        return jsonify({"msg": f"An error occurred: {str(e)}"}), 500

# Protect routes using JWT
@app.route("/api/dashboard", methods=["GET"])
@jwt_required()
def dashboard_api():
    current_user = get_jwt_identity()
    return jsonify({"msg": f"Welcome, {current_user}!"}), 200

# Protected API Route for Test Page
@app.route("/api/test_welcome_msg", methods=["GET"])
@jwt_required()
def test():

    current_user = get_jwt_identity()
    # print(current_user)
    return jsonify({"msg": f"Welcome to the test page, {current_user}!"}), 200

# Video Feed Route
@app.route("/api/test")
def video_feed():
    print(session)
    if 'username' in session:
        username = session['username']  # Get the username from the session
        # print("hello")
        print(username)
        return Response(generate_frames(model, known_face_encodings, known_face_names, username),
                        mimetype='multipart/x-mixed-replace; boundary=frame')
    else:
        print("hello")

        return jsonify({"msg": "User not logged in"}), 401  # Handle case where user is not logged in

@app.route("/api/submit_answers", methods=["POST"])
@jwt_required()
def submit_answers():
    try:
        submission_data = request.get_json()
        username = get_jwt_identity()
        
        # Validate submission data
        required_fields = ['examID', 'subject', 'title', 'date', 'answers', 'score']
        if not all(field in submission_data for field in required_fields):
            return jsonify({"msg": "Missing required fields in submission"}), 400

        # Create submission record
        submission_record = {
            'examID': submission_data['examID'],
            'subject': submission_data['subject'],
            'title': submission_data['title'],
            'date': submission_data['date'],
            'username': username,
            'answers': submission_data['answers'],
            'score': submission_data['score'],
            'timestamp': datetime.now().isoformat()
        }
        print(submission_record)

        user = collection.find_one({"username": username})

        if user:
            # If user exists, add the submission to their submissions list
            collection.update_one(
                {"username": username},
                {"$push": {"exams": submission_record}}  # Use $push to append to array
                )
            result = submissions_collection.insert_one(submission_record)
            
        else:
            print("else")
            # If user is not found, return an error
            return jsonify({"msg": "User not found"}), 404

        return jsonify({
            "msg": "Submission successful",
            # "submission_id": submission_record['_id']
        }), 200

    except Exception as e:
        print(f"Error occurred during submission: {e}")
        return jsonify({"msg": f"An error occurred: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)

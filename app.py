# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
# from pymongo import MongoClient
# from bson import ObjectId
# import bcrypt
# from datetime import datetime

# app = Flask(__name__)
# # CORS(app, supports_credentials=True)
# CORS(app, resources={
#     r"/*": {
#         "origins": ["http://localhost:5173"],
#         "methods": ["GET", "POST", "OPTIONS"],
#         "allow_headers": ["Content-Type", "Authorization"]
#     }
# })
# # MongoDB Connection
# MONGO_URI = "mongodb+srv://workrelatedV1:workrelated6375@cluster0.wkeoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
# client = MongoClient(MONGO_URI)
# db = client["community_platform"]
# users_collection = db["users"]
# posts_collection = db["posts"]
# groups_collection = db["groups"]
# # JWT Secret Key
# app.config["JWT_SECRET_KEY"] = "abujaid123"
# jwt = JWTManager(app)

# # ------------------- HELPER FUNCTIONS -------------------
# # Password Hashing Functions
# def hash_password(password):
#     return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# def check_password(password, hashed_password):
#     return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

# @app.route("/", methods=["GET"])
# def home():
#     return jsonify({"message": "Flask API is running!"})

# # ------------------- AUTH ROUTES -------------------
# @app.route("/signup", methods=["POST"])
# def signup():
#     """Registers a new user with hashed password storage."""
#     data = request.get_json()
#     username = data.get("username")
#     email = data.get("email")
#     password = data.get("password")

#     if not username or not email or not password:
#         return jsonify({"error": "All fields are required"}), 400

#     # Check if user already exists
#     if users_collection.find_one({"email": email}):
#         return jsonify({"error": "Email already exists"}), 400

#     # Hash password and store user
#     hashed_password = hash_password(password)
#     user_id = users_collection.insert_one({
#         "username": username,
#         "email": email,
#         "password": hashed_password,
#         "created_at": datetime.utcnow()
#     }).inserted_id

#     return jsonify({"message": "User registered successfully", "user_id": str(user_id)}), 201

# @app.route("/login", methods=["POST"])
# def login():
#     """Authenticates user and returns a JWT token."""
#     try:
#         data = request.get_json()
#         email = data.get("email")
#         password = data.get("password")

#         # Input validation
#         if not email or not password:
#             return jsonify({"error": "Email and password are required"}), 400

#         user = users_collection.find_one({"email": email})
#         if not user:
#             return jsonify({"error": "Invalid credentials"}), 401

#         # Extract stored password and verify it
#         stored_password = user["password"]
#         if not check_password(password, stored_password):
#             return jsonify({"error": "Invalid credentials"}), 401

#         # Generate JWT token
#         token = create_access_token(identity=str(user["_id"]))

#         return jsonify({
#             "message": "Login successful",
#             "token": token,
#             "user_id": str(user["_id"]),
#             "username": user["username"]
#         }), 200

#     except Exception as e:
#         # Log the full error for server-side debugging
#         print(f"Login error: {str(e)}")
#         return jsonify({"error": "Internal server error"}), 500
    

# @app.route("/protected", methods=["GET"])
# @jwt_required()
# def protected():
#     """Protected route that requires authentication."""
#     current_user = get_jwt_identity()
#     return jsonify({"message": "Access granted", "user_id": current_user})

# # ------------------- FETCH ALL POSTS (FIXED) -------------------
# @app.route("/posts", methods=["GET"])
# def get_posts():
#     """Fetch all posts and include author_id as string."""
#     posts = list(posts_collection.find({}))
#     posts_data = []

#     for post in posts:
#         posts_data.append({
#             "post_id": str(post["_id"]),
#             "title": post.get("title", ""),
#             "content": post.get("content", ""),
#             "category": post.get("category", ""),
#             "author_id": str(post["author_id"]),  # ✅ Convert ObjectId to string
#             "created_at": post.get("created_at", datetime.utcnow()),  # Use default if missing
#             "upvotes": post.get("upvotes", 0),  # Default to 0 if missing
#             "comments": post.get("comments", [])
#         })

#     return jsonify(posts_data), 200

# # ------------------- COMMENT ON A POST (FIXED) -------------------
# @app.route("/posts/<post_id>/comment", methods=["POST"])
# @jwt_required()
# def comment_on_post(post_id):
#     """Allows authenticated users to comment on a post."""
#     current_user = get_jwt_identity()  # Get logged-in user ID from JWT
#     data = request.get_json()

#     comment_text = data.get("comment")
#     if not comment_text:
#         return jsonify({"error": "Comment cannot be empty"}), 400

#     comment = {
#         "user_id": str(current_user),  # ✅ Convert user_id to string
#         "comment": comment_text,
#         "timestamp": datetime.utcnow()
#     }

#     # Push new comment into the "comments" array in MongoDB
#     result = posts_collection.update_one(
#         {"_id": ObjectId(post_id)},
#         {"$push": {"comments": comment}}
#     )

#     if result.modified_count == 0:
#         return jsonify({"error": "Post not found"}), 404

#     return jsonify({"message": "Comment added successfully", "comment": comment}), 201

# # ------------------- UPVOTE A POST (NO CHANGES) -------------------
# @app.route("/posts/<post_id>/upvote", methods=["POST"])
# @jwt_required()
# def upvote_post(post_id):
#     """Allows authenticated users to upvote a post."""
#     result = posts_collection.update_one(
#         {"_id": ObjectId(post_id)},
#         {"$inc": {"upvotes": 1}}
#     )

#     if result.modified_count == 0:
#         return jsonify({"error": "Post not found"}), 404

#     return jsonify({"message": "Post upvoted successfully"}), 200

# def main():
#     app.run(host="0.0.0.0", port=5001, debug=False)

# if __name__ == "__main__":
#     main()

#########################
import os
import base64
import google.generativeai as genai
from PIL import Image
from io import BytesIO
from pymongo.errors import PyMongoError
from bson.objectid import ObjectId

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from bson import ObjectId
import bcrypt
import re
from datetime import datetime

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
  # Enable CORS for frontend-backend communication

# MongoDB Atlas Connection
MONGO_URI = ""
client = MongoClient(MONGO_URI)
db = client["community_platform"]
db1 = client["crop_disease_db"]  # Database name
db2 = client["farmers_ai_db"]
collection1 = db2["queries"]

users_collection = db["users"]
posts_collection = db["posts"]
fpo_groups_collection = db["fpo_groups"] 
collection = db1["predictions"]

# JWT Secret Key
app.config["JWT_SECRET_KEY"] = "abujaid123"  # Change this to a strong secret key
jwt = JWTManager(app)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCAYS1gL7i3GIAbquudL1Olxpy7P-o4ej4")
genai.configure(api_key=GEMINI_API_KEY)
# ------------------- USER AUTHENTICATION -------------------

# Helper function to hash passwords
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

# Helper function to check passwords
def check_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)


# Home Route
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flask API is running!"})


# User Signup Route
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # Check if user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    # Hash password and save user
    hashed_password = hash_password(password)
    user_id = users_collection.insert_one({
        "username": username,
        "email": email,
        "password": hashed_password
    }).inserted_id

    return jsonify({"message": "User registered successfully", "user_id": str(user_id)}), 201

# User Login Route
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = users_collection.find_one({"email": email})
    if not user or not check_password(password, user["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    # Generate JWT token
    access_token = create_access_token(identity=str(user["_id"]))
    return jsonify({"message": "Login successful", "token": access_token, "user_id": str(user["_id"])}), 200

# Protected Route (Example)
@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({"message": "Access granted", "user_id": current_user})


# ------------------- DISCUSSION FORUM CRUD OPERATIONS -------------------

# Create a New Post
@app.route("/posts", methods=["POST"])
@jwt_required()
def create_post():
    current_user = get_jwt_identity()  # Get logged-in user ID
    data = request.get_json()
    
    title = data.get("title")
    content = data.get("content")
    category = data.get("category")
    
    if not title or not content or not category:
        return jsonify({"error": "Title, content, and category are required"}), 400
    
    post = {
        "title": title,
        "content": content,
        "category": category,
        "author_id": current_user,
        "created_at": datetime.utcnow(),
        "upvotes": 0,
        "comments": []
    }
    
    post_id = posts_collection.insert_one(post).inserted_id
    return jsonify({"message": "Post created successfully", "post_id": str(post_id)}), 201

# Fetch All Posts
@app.route("/posts", methods=["GET"])
def get_posts():
    posts = list(posts_collection.find({}))
    posts_data = []
    
    for post in posts:
        posts_data.append({
            "post_id": str(post["_id"]),
            "title": post["title"],
            "content": post["content"],
            "category": post["category"],
            "author_id": post["author_id"],
            "created_at": post["created_at"],
            "upvotes": post["upvotes"],
            "comments": post["comments"]
        })
    
    return jsonify(posts_data), 200

# Fetch a Single Post
@app.route("/posts/<post_id>", methods=["GET"])
def get_single_post(post_id):
    post = posts_collection.find_one({"_id": ObjectId(post_id)})
    if not post:
        return jsonify({"error": "Post not found"}), 404
    
    post_data = {
        "post_id": str(post["_id"]),
        "title": post["title"],
        "content": post["content"],
        "category": post["category"],
        "author_id": post["author_id"],
        "created_at": post["created_at"],
        "upvotes": post["upvotes"],
        "comments": post["comments"]
    }
    
    return jsonify(post_data), 200

# Comment on a Post
@app.route("/posts/<post_id>/comment", methods=["POST"])
@jwt_required()
def comment_on_post(post_id):
    current_user = get_jwt_identity()
    data = request.get_json()
    
    comment_text = data.get("comment")
    if not comment_text:
        return jsonify({"error": "Comment cannot be empty"}), 400
    
    comment = {
        "user_id": current_user,
        "comment": comment_text,
        "timestamp": datetime.utcnow()
    }
    
    result = posts_collection.update_one({"_id": ObjectId(post_id)}, {"$push": {"comments": comment}})
    if result.modified_count == 0:
        return jsonify({"error": "Post not found"}), 404
    
    return jsonify({"message": "Comment added successfully"}), 201

# Upvote a Post
@app.route("/posts/<post_id>/upvote", methods=["POST"])
@jwt_required()
def upvote_post(post_id):
    result = posts_collection.update_one({"_id": ObjectId(post_id)}, {"$inc": {"upvotes": 1}})
    if result.modified_count == 0:
        return jsonify({"error": "Post not found"}), 404
    
    return jsonify({"message": "Post upvoted successfully"}), 200

# ------------------- FPO GROUP FUNCTIONALITY -------------------

@app.route("/fpo/create", methods=["POST"])
@jwt_required()
def create_fpo_group():
    current_user = get_jwt_identity()
    data = request.get_json()
    group_name = data.get("group_name")
    description = data.get("description")
    category = data.get("category")

    if not group_name or not description:
        return jsonify({"error": "Group name and description are required"}), 400

    group = {
        "group_name": group_name,
        "description": description,
        "category": category,
        "created_by": current_user,
        "created_at": datetime.utcnow(),
        "members": [current_user],
        "messages": []
    }
    group_id = fpo_groups_collection.insert_one(group).inserted_id
    return jsonify({"message": "FPO Group created successfully", "group_id": str(group_id)}), 201

# Fetch all FPO Groups
@app.route("/fpo/groups", methods=["GET"])
def get_fpo_groups():
    groups = list(fpo_groups_collection.find({}))
    groups_data = []
    
    for group in groups:
        groups_data.append({
            "group_id": str(group["_id"]),
            "group_name": group["group_name"],
            "description": group["description"],
            "members": len(group["members"])
        })
    
    return jsonify(groups_data), 200

# Join an FPO Group
@app.route("/fpo/groups/<group_id>/join", methods=["POST"])
@jwt_required()
def join_fpo_group(group_id):
    current_user = get_jwt_identity()
    result = fpo_groups_collection.update_one({"_id": ObjectId(group_id)}, {"$addToSet": {"members": current_user}})
    if result.modified_count == 0:
        return jsonify({"error": "FPO Group not found or already joined"}), 404
    
    return jsonify({"message": "Joined FPO Group successfully"}), 200

# Fetch Single FPO Group Details
@app.route("/fpo/groups/<group_id>", methods=["GET"])
def get_fpo_group(group_id):
    group = fpo_groups_collection.find_one({"_id": ObjectId(group_id)})
    if not group:
        return jsonify({"error": "FPO Group not found"}), 404
    
    group_data = {
        "group_id": str(group["_id"]),
        "group_name": group["group_name"],
        "description": group["description"],
        "members": group["members"]
    }
    return jsonify(group_data), 200


################################################disease

# Allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_text_prompt(image, prompt_text):
    """Helper function to send individual prompts to Gemini AI"""
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content([image, prompt_text])
    cleaned_text = response.text.replace("**", "").strip()
    return cleaned_text

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files['image']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file format"}), 400

    try:
        image = Image.open(file)
        
        # AI Prompts for Disease Detection
        plant_name = generate_text_prompt(image, "Identify the plant name in this image.")
        disease = generate_text_prompt(image, "Identify the disease if present; if none, return 'Healthy'.")
        cause = generate_text_prompt(image, "Provide a brief cause (1-2 lines) for the detected disease, or 'No cause needed' if healthy.")
        treatment = generate_text_prompt(image, "Suggest a brief treatment (1-2 lines) for the detected disease, or 'No treatment needed' if healthy.")
        
        # Convert image to base64
        img_byte_array = BytesIO()
        image.save(img_byte_array, format="PNG")
        encoded_image = base64.b64encode(img_byte_array.getvalue()).decode('utf-8')

        # Prepare MongoDB record with unique _id
        record = {
            "_id": str(ObjectId()),  # Generate a unique ID for each record
            "plant": plant_name,
            "disease": disease,
            "cause": cause,
            "treatment": treatment,
            "image": encoded_image
        }
        print("Record to be inserted:", record)  # Debugging

        # Insert into MongoDB
        try:
            result = collection.insert_one(record)
            print(f"Inserted document ID: {result.inserted_id}")
        except PyMongoError as e:
            print(f"MongoDB Insert Error: {e}")
            return jsonify({"error": "Database insertion failed"}), 500
        
        return jsonify({
            "id": str(record["_id"]),  # Return the unique ID
            "plant": plant_name,
            "disease": disease,
            "cause": cause,
            "treatment": treatment
        })

    except Exception as e:
        print(f"Prediction error: {e}")  # Debugging
        return jsonify({"error": str(e)}), 500
    

SYSTEM_PROMPT = """
You are AgriExpert, an AI assistant specialized in agriculture. Follow these guidelines:
1. Structure responses with clear headings and bullet points
2. Use simple language suitable for farmers
3. Provide practical, actionable advice
4. Format lists, steps, and important points clearly
5. Include relevant emojis where appropriate
6. If suggesting solutions, provide multiple options
7. Highlight warnings/dangers with warning symbols
8. Keep responses concise but comprehensive
9. DO NOT use markdown formatting like **bold** or ## headings
10. Separate each point with a new line
11. For lists, use simple numbering or bullets without special characters
12. Maintain a clean, readable format throughout
"""

def clean_response(text):
    """Clean and format the response text"""
    # Remove markdown formatting
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)  # Remove bold
    text = re.sub(r'\#+\s*(.*?)\n', r'\1\n', text)  # Remove headings
    text = re.sub(r'`(.*?)`', r'\1', text)  # Remove code formatting
    
    # Convert markdown lists to plain text with newlines
    text = re.sub(r'^\s*[\-\*\+]\s+(.*)$', r'\1', text, flags=re.MULTILINE)
    text = re.sub(r'^\s*\d+\.\s+(.*)$', r'\1', text, flags=re.MULTILINE)
    
    # Ensure proper spacing and newlines
    text = re.sub(r'\n\s*\n', '\n\n', text)  # Remove excessive newlines
    text = text.strip()
    
    return text

def format_response(text):
    """Format the response into a structured format"""
    cleaned_text = clean_response(text)
    
    # Split into sections if there are clear headings
    sections = {}
    lines = cleaned_text.split('\n')
    current_section = 'response'
    sections[current_section] = []
    
    for line in lines:
        if line.endswith(':') and len(line) < 30:  # Likely a section heading
            current_section = line[:-1].lower().replace(' ', '_')
            sections[current_section] = []
        else:
            if line.strip():  # Only add non-empty lines
                sections[current_section].append(line.strip())
    
    # Convert lists to single strings with newlines
    for section in sections:
        sections[section] = '\n'.join(sections[section])
    
    return sections if len(sections) > 1 or 'response' not in sections else {'response': cleaned_text}

def generate_ai_response(query):
    """Generate structured AI response using Gemini API"""
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content([SYSTEM_PROMPT, query])
    return format_response(response.text)

@app.route('/ask', methods=['POST'])
def ask_ai():
    data = request.get_json()
    user_query = data.get("query")
    
    if not user_query:
        return jsonify({"error": "No query provided"}), 400
    
    try:
        ai_response = generate_ai_response(user_query)
        record = {
            "query": user_query,
            "response": ai_response,
            "timestamp": datetime.utcnow()
        }
        
        collection1.insert_one(record)
        return jsonify({"query": user_query, "response": ai_response})
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/history', methods=['GET'])
def get_history():
    try:
        history = list(collection1.find({}, {"_id": 0}).sort("timestamp", -1).limit(20))
        return jsonify(history)
    except PyMongoError as e:
        return jsonify({"error": "Database error"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True, use_reloader=False)

from flask import Flask, request, jsonify
from flask import session
from bson.objectid import ObjectId
from flask_cors import CORS
from pymongo import MongoClient
import os
# import vercel_wsgi


from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
CORS(app, supports_credentials=True)  # Adjust to your front-end URL


app.secret_key = "verysecret"
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SECURE"] = False
app.config["SESSION_PERMANENT"] = (
    False  # This means the session lasts until the browser is closed
)
app.config["SESSION_COOKIE_PATH"] = "/"

# Replace with your actual MongoDB URI
mongo_uri = "mongodb+srv://ykyash2k03:Senthilkumar88@cluster1.ly8rv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"
client = MongoClient(mongo_uri)
db = client.Finance_Tracker


@app.route("/register", methods=["POST"])
def register_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")

    if not data:
        return jsonify({"message": "No data received"}), 400

    # Check if user already exists
    if db.user_details.find_one({"email": email}):
        return jsonify({"status": "error", "message": "User already exists."}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)
    user_data = {"name": name, "email": email, "password": hashed_password}
    db.user_details.insert_one(user_data)
    return (
        jsonify({"status": "success", "message": "User registered successfully!"}),
        201,
    )


# User login route
@app.route("/login", methods=["POST"])
def login_user():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    print(
        f"Login attempt with email: {email} and password: {password}"
    )  # Print received data

    user = db.user_details.find_one({"email": email})
    if user and check_password_hash(user["password"], password):
        session["user_email"] = email
        print(
            f"User logged in: {email}, Session: {session}"
        )  # Debugging session content
        return jsonify({"status": "success", "message": "Login successful!"}), 200
    else:
        return (
            jsonify({"status": "error", "message": "Invalid email or password."}),
            401,
        )


@app.route("/add-transaction", methods=["POST"])
def add_transaction():
    data = request.json
    # Ensure email in session matches the user_email in the transaction data
    # if email != data.get('user_email'):
    #     return jsonify({"status": "error", "message": "Unauthorized transaction."}), 401

    # Store the transaction in the database
    result = db.transaction_details.insert_one(data)
    return jsonify({"id": str(result.inserted_id), "status": "success"}), 201


# Get transactions route (user-specific)
@app.route("/get-transactions", methods=["GET"])
def get_transactions():
    email = request.args.get("email")
    print("email for get transactions - " + email)
    # Fetch transactions for the logged-in user
    transactions = list(db.transaction_details.find({"email": email}))

    # Convert ObjectId to string for each transaction
    for transaction in transactions:
        transaction["_id"] = str(transaction["_id"])

    return jsonify(transactions), 200


@app.route("/delete-transactions", methods=["DELETE"])
def delete_transaction():
    data = request.json  # Get the JSON data from the request
    transaction_id = ObjectId(data.get("transaction_id"))

    # Delete the transaction in the database
    result = db.transaction_details.delete_one(
        {"_id": transaction_id}
    )  # Match the transaction by ID

    if result.deleted_count > 0:
        return jsonify({"message": "Transaction deleted successfully"}), 200
    else:
        return jsonify({"message": "Transaction not found"}), 404


@app.route("/edit-transactions", methods=["POST"])
def edit_transaction():
    print("backe dn edit route called")
    data = request.json  # Get the JSON data from the request
    transaction_id = ObjectId(data.get("transaction_id"))

    print("Type of transaction_id:", type(transaction_id))
    updated_data = {
        "amount": float(data.get("amount")),
        "tag": data.get("tag"),
        "name": data.get("name"),
        "date": data.get("date"),
    }
    print("updated_data before pushing to the database", updated_data)
    # Update the transaction in the database
    result = db.transaction_details.update_one(
        {"_id": transaction_id},  # Match the transaction by ID
        {"$set": updated_data},  # Set the updated fields
    )

    if result.modified_count > 0:
        return jsonify({"message": "Transaction updated successfully"}), 200
    else:
        return jsonify({"message": "No changes made or transaction not found"}), 404


@app.route("/check-session", methods=["GET"])
def check_session():
    if "user_email" in session:
        print(f"Session check successful for user: {session['user_email']}")
        return jsonify({"status": "success", "user_email": session["user_email"]}), 200
    else:
        print("Session check failed: User not logged in.")
        return jsonify({"status": "error", "message": "User not logged in."}), 401


# app = vercel_wsgi.make_wsgi_app(app)

if __name__ == "__main__":
    app.run(debug=True, port=int(os.environ.get('PORT', 5000)))

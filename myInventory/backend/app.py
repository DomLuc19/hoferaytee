from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/")
def home():
    return "Backend is running!"

# -------------------------
# USER REGISTRATION
# -------------------------

@app.post("/register")
def register():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    try:
        db = get_db()
        db.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (username, email, password)
        )
        db.commit()
        return jsonify({"message": "Registration successful"}), 200

    except sqlite3.IntegrityError:
        return jsonify({"error": "User already exists"}), 409

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------
# USER LOGIN (REAL CHECK)
# -------------------------

@app.post("/login")
def login():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Missing fields"}), 400

    db = get_db()
    row = db.execute(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        (username, password)
    ).fetchone()

    if row is None:
        return jsonify({"error": "Invalid username or password"}), 401

    return jsonify({
        "message": "Login successful",
        "user_id": row["id"],
        "username": row["username"]
    }), 200

# -------------------------
# ITEMS CRUD
# -------------------------

@app.get("/items")
def get_items():
    db = get_db()
    rows = db.execute("SELECT * FROM items").fetchall()
    return jsonify([dict(row) for row in rows])

@app.post("/items")
def create_item():
    data = request.get_json()

    name = data.get("name")
    quantity = data.get("quantity")
    price = data.get("price")
    date_added = data.get("date_added")

    if not name or quantity is None:
        return jsonify({"error": "Missing fields"}), 400

    db = get_db()
    db.execute(
        "INSERT INTO items (name, quantity, price, date_added) VALUES (?, ?, ?, ?)",
        (name, quantity, price, date_added)
    )
    db.commit()

    return jsonify({"message": "Item created successfully"}), 201

@app.get("/items/<int:item_id>")
def get_item(item_id):
    db = get_db()
    row = db.execute("SELECT * FROM items WHERE id = ?", (item_id,)).fetchone()

    if row is None:
        return jsonify({"error": "Item not found"}), 404

    return jsonify(dict(row))

@app.put("/items/<int:item_id>")
def update_item(item_id):
    data = request.get_json()

    name = data.get("name")
    quantity = data.get("quantity")
    price = data.get("price")
    date_added = data.get("date_added")

    db = get_db()
    row = db.execute("SELECT * FROM items WHERE id = ?", (item_id,)).fetchone()

    if row is None:
        return jsonify({"error": "Item not found"}), 404

    db.execute(
        "UPDATE items SET name = ?, quantity = ?, price = ?, date_added = ? WHERE id = ?",
        (name, quantity, price, date_added, item_id)
    )
    db.commit()

    return jsonify({"message": "Item updated"})

@app.delete("/items/<int:item_id>")
def delete_item(item_id):
    db = get_db()
    row = db.execute("SELECT * FROM items WHERE id = ?", (item_id,)).fetchone()

    if row is None:
        return jsonify({"error": "Item not found"}), 404

    db.execute("DELETE FROM items WHERE id = ?", (item_id,))
    db.commit()

    return jsonify({"message": "Item deleted"})

# -------------------------
# START SERVER
# -------------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)

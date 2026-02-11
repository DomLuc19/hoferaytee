const API_URL = "https://api.hoferaytee.ch";

// -------------------------
// REGISTRATION
// -------------------------
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;

    const data = {
        username: form.username.value,
        email: form.email.value,
        password: form.password.value,
        confirmPassword: form.confirmPassword.value
    };

    // Frontend Validierung
    if (data.password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }
    if (data.password !== data.confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: data.username,
                email: data.email,
                password: data.password,
                password2: data.confirmPassword   // <-- WICHTIG!
            })
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Registration failed.");
            return;
        }

        alert(result.message || "Registration successful! You can now log in.");
        form.reset();
        window.location.href = 'login.html';
    } catch (err) {
        console.error(err);
        alert("An error occurred during registration.");
    }
});

// -------------------------
// LOGIN
// -------------------------
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;

    const data = {
        username: form.username.value,
        password: form.password.value
    };

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Login failed.");
            return;
        }

        alert(result.message || "Login successful!");
        form.reset();
        window.location.href = 'index.html';
    } catch (err) {
        console.error(err);
        alert("An error occurred during login.");
    }
});

// -------------------------
// CREATE NEW ITEM
// -------------------------
document.getElementById('newRecordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;

    const data = {
        name: form.itemName.value,
        quantity: Number(form.quantity.value),
        price: Number(form.price.value),
        date_added: form.dateAdded.value
    };

    try {
        const response = await fetch(`${API_URL}/items`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Failed to create item.");
            return;
        }

        alert(result.message || "Item created successfully.");
        form.reset();

        if (document.getElementById("itemsList")) {
            loadItems();
        }
    } catch (err) {
        console.error(err);
        alert("An error occurred while creating the item.");
    }
});

// -------------------------
// LOAD ITEMS
// -------------------------
async function loadItems() {
    try {
        const response = await fetch(`${API_URL}/items`);
        const items = await response.json();

        const list = document.getElementById("itemsList");
        if (!list) return;

        list.innerHTML = "";

        items.forEach(item => {
            const div = document.createElement("div");
            div.innerHTML = `
                <strong>${item.name}</strong><br>
                Amount: ${item.quantity}<br>
                Price: ${item.price}<br>
                Date: ${item.date_added}<br>
                <button onclick="deleteItem(${item.id})">Delete</button>
                <button onclick="editItem(${item.id})">Edit</button>
                <hr>
            `;
            list.appendChild(div);
        });
    } catch (err) {
        console.error(err);
        alert("An error occurred while loading items.");
    }
}

// -------------------------
// DELETE ITEM
// -------------------------
async function deleteItem(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
        const response = await fetch(`${API_URL}/items/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Failed to delete item.");
            return;
        }

        alert(result.message || "Item deleted.");
        loadItems();
    } catch (err) {
        console.error(err);
        alert("An error occurred while deleting the item.");
    }
}

// -------------------------
// EDIT ITEM
// -------------------------
async function editItem(id) {
    try {
        const response = await fetch(`${API_URL}/items/${id}`);
        const item = await response.json();

        if (!response.ok) {
            alert(item.error || "Failed to load item.");
            return;
        }

        document.getElementById("editName").value = item.name;
        document.getElementById("editQuantity").value = item.quantity;
        document.getElementById("editPrice").value = item.price;
        document.getElementById("editDate").value = item.date_added;

        const form = document.getElementById("editForm");
        form.style.display = "block";
        form.dataset.id = id;
    } catch (err) {
        console.error(err);
        alert("An error occurred while loading the item.");
    }
}

// -------------------------
// SAVE EDITED ITEM
// -------------------------
document.getElementById("editForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = e.target.dataset.id;

    const data = {
        name: document.getElementById("editName").value,
        quantity: Number(document.getElementById("editQuantity").value),
        price: Number(document.getElementById("editPrice").value),
        date_added: document.getElementById("editDate").value
    };

    try {
        const response = await fetch(`${API_URL}/items/${id}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.error || "Failed to update item.");
            return;
        }

        alert(result.message || "Item updated.");
        e.target.reset();
        e.target.style.display = "none";
        loadItems();
    } catch (err) {
        console.error(err);
        alert("An error occurred while updating the item.");
    }
});

// -------------------------
// LOAD RECORDS TABLE
// -------------------------
async function loadMyRecords() {
    const table = document.querySelector(".myRecordsTable");
    if (!table) return;

    try {
        const response = await fetch(`${API_URL}/items`);
        const items = await response.json();

        items.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.date_added}</td>
            `;
            table.appendChild(row);
        });
    } catch (err) {
        console.error(err);
        alert("An error occurred while loading records.");
    }
}

// -------------------------
// ON LOAD
// -------------------------
window.addEventListener('load', () => {
    if (document.getElementById("itemsList")) {
        loadItems();
    }
    if (document.querySelector(".myRecordsTable")) {
        loadMyRecords();
    }
});
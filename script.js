let items = JSON.parse(localStorage.getItem("campusItems")) || [];

const reportForm = document.getElementById("reportForm");
const itemsContainer = document.getElementById("items");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

// Display items
function displayItems() {
    itemsContainer.innerHTML = "";

    const search = searchInput.value.toLowerCase();
    const filter = filterType.value;

    const filteredItems = items.filter(item => {
        const matchesSearch =
            item.name.toLowerCase().includes(search) ||
            item.location.toLowerCase().includes(search);

        const matchesType =
            filter === "all" || item.type === filter;

        return matchesSearch && matchesType;
    });

    if (filteredItems.length === 0) {
        itemsContainer.innerHTML = "<p>No items found.</p>";
        return;
    }

    filteredItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "item-card";

        const title = document.createElement("h3");
        title.textContent = item.name;

        const type = document.createElement("p");
        type.textContent = "Type: " + item.type;

        const location = document.createElement("p");
        location.textContent = "Location: " + item.location;

        const contact = document.createElement("p");
        contact.textContent = "Contact: " + item.contact;

        const description = document.createElement("p");
        description.textContent = item.description;

        const status = document.createElement("span");
        status.className = "status";
        status.textContent = item.type + " Item";

        card.append(title, type, location, contact,
                    description, status);

        if (item.image) {
            const image = document.createElement("img");
            image.src = item.image;
            image.alt = item.name;
            card.prepend(image);
        }

        itemsContainer.appendChild(card);
    });
}

// Submit new item
reportForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const imageFile = document.getElementById("itemImage").files[0];

    const newItem = {
        id: Date.now(),
        name: document.getElementById("itemName").value,
        type: document.getElementById("itemType").value,
        location: document.getElementById("location").value,
        contact: document.getElementById("contact").value,
        description: document.getElementById("description").value,
        image: ""
    };

    function saveItem() {
        items.push(newItem);

        localStorage.setItem(
            "campusItems",
            JSON.stringify(items)
        );

        reportForm.reset();
        displayItems();

        alert("Item reported successfully!");
    }

    if (imageFile) {
        if (!imageFile.type.startsWith("image/")) {
            alert("Please select a valid image.");
            return;
        }

        if (imageFile.size > 900 * 1024) {
            alert("Please select an image smaller than 900 KB.");
            return;
        }

        const reader = new FileReader();

        reader.onload = function() {
            newItem.image = reader.result;
            saveItem();
        };

        reader.onerror = function() {
            alert("Unable to read the selected image.");
        };

        reader.readAsDataURL(imageFile);
    } else {
        saveItem();
    }
});

// Search items
searchInput.addEventListener("input", displayItems);

// Filter lost and found items
filterType.addEventListener("change", displayItems);

// Demo login
document.getElementById("loginBtn").addEventListener("click", function() {
    const name = prompt("Enter your student name:");

    if (name && name.trim()) {
        alert("Welcome, " + name.trim() + "!");
    }
});

// Initial display
displayItems();

// Firebase SDK import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBVqDaD82IzRf0VheHWgJmlniE1-iW65aE",
    authDomain: "login-system-a83ef.firebaseapp.com",
    databaseURL: "https://login-system-a83ef-default-rtdb.firebaseio.com",
    projectId: "login-system-a83ef",
    storageBucket: "login-system-a83ef.firebasestorage.app",
    messagingSenderId: "586906299008",
    appId: "1:586906299008:web:d2d93f383fa8958b551465",
    measurementId: "G-0WF4S9S1PK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Login form submission handler
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page reload

    const loginId = document.getElementById("loginId").value.trim();
    const loginPassword = document.getElementById("loginPassword").value.trim();
    const message = document.getElementById("message");
    const icon = document.getElementById("icon");

    // Clear previous icon and message
    icon.innerHTML = "";
    message.innerText = "";

    // Check if both fields are filled
    if (loginId && loginPassword) {
        const dbRef = ref(db);

        // Fetch entire database
        get(dbRef).then((snapshot) => {
            console.log("Entire Database Snapshot:", snapshot.val()); // Debugging

            if (snapshot.exists()) {
                const databaseData = snapshot.val();
                let loginSuccessful = false;

                // Function to recursively search for ID and password
                const searchDatabase = (data) => {
                    for (const key in data) {
                        if (data[key].adminId === loginId && data[key].password === loginPassword) {
                            loginSuccessful = true;
                            break;
                        }
                        if (typeof data[key] === "object") {
                            searchDatabase(data[key]); // Recursively search nested objects
                        }
                    }
                };

                // Start searching
                searchDatabase(databaseData.admins); // Only search the "admins" node

                // Check if login was successful
                if (loginSuccessful) {
                    console.log("Login Successful!"); // Debugging
                    icon.innerHTML = "✅";
                    icon.classList.add("tick", "animate__animated", "animate__bounceIn");
                    message.style.color = "green";
                    message.innerText = "Login Successful!";
                    setTimeout(() => {
                        window.location.href = "dashboard.html"; // Redirect after login
                    }, 1000);
                } else {
                    console.log("ID or Password not found!"); // Debugging
                    icon.innerHTML = "❌";
                    icon.classList.add("cross", "animate__animated", "animate__shakeX");
                    message.style.color = "red";
                    message.innerText = "Incorrect ID or Password!";
                    document.querySelector(".login-container").classList.add("animate__shakeX"); // Shake animation
                }
            } else {
                console.log("Database is empty!"); // Debugging
                icon.innerHTML = "❌";
                icon.classList.add("cross", "animate__animated", "animate__shakeX");
                message.style.color = "red";
                message.innerText = "Database is empty!";
            }
        }).catch((error) => {
            console.error("Error fetching data:", error); // Debugging
            icon.innerHTML = "❌";
            icon.classList.add("cross", "animate__animated", "animate__shakeX");
            message.style.color = "red";
            message.innerText = "Error Fetching Data!";
        });

    } else {
        icon.innerHTML = "❌";
        icon.classList.add("cross", "animate__animated", "animate__shakeX");
        message.style.color = "red";
        message.innerText = "Please enter both ID and Password!";
    }
});

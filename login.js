// Firebase SDK import import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"; import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase config const firebaseConfig = { apiKey: "AIzaSyBVqDaD82IzRf0VheHWgJmlniE1-iW65aE", authDomain: "login-system-a83ef.firebaseapp.com", databaseURL: "https://login-system-a83ef-default-rtdb.firebaseio.com", projectId: "login-system-a83ef", storageBucket: "login-system-a83ef.appspot.com", messagingSenderId: "586906299008", appId: "1:586906299008:web:d2d93f383fa8958b551465", measurementId: "G-0WF4S9S1PK" };

// Initialize Firebase const app = initializeApp(firebaseConfig); const db = getDatabase(app);

// Login form submission handler document.getElementById("loginForm").addEventListener("submit", function(event) { event.preventDefault();

const loginId = document.getElementById("loginId").value.trim();
const loginPassword = document.getElementById("loginPassword").value.trim();
const message = document.getElementById("message");
const icon = document.getElementById("icon");

icon.innerHTML = "";
message.innerText = "";

if (loginId && loginPassword) {
    const dbRef = ref(db);

    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const databaseData = snapshot.val();
            let loginSuccessful = false;

            const searchDatabase = (data) => {
                for (const key in data) {
                    if (data[key].adminId === loginId && data[key].password === loginPassword) {
                        loginSuccessful = true;
                        break;
                    }
                    if (typeof data[key] === "object") {
                        searchDatabase(data[key]);
                    }
                }
            };

            searchDatabase(databaseData.admins);

            if (loginSuccessful) {
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('lastActivity', new Date().getTime());

                icon.innerHTML = "✅";
                icon.className = "tick animate__animated animate__tada";
                message.style.color = "#00e676";
                message.style.textShadow = "0 0 15px #00e676";
                message.innerText = "Login Successful! Welcome!";

                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1200);
            } else {
                icon.innerHTML = "❌";
                icon.className = "cross animate__animated animate__shakeX";
                message.style.color = "#ff1744";
                message.style.textShadow = "0 0 15px #ff1744";
                message.innerText = "Incorrect ID or Password!";
                document.querySelector(".login-container").classList.add("animate__shakeX");
            }
        } else {
            icon.innerHTML = "⚠️";
            icon.className = "cross animate__animated animate__flash";
            message.style.color = "#ffa726";
            message.style.textShadow = "0 0 15px #ffa726";
            message.innerText = "Database is empty!";
        }
    }).catch((error) => {
        console.error("Error fetching data:", error);
        icon.innerHTML = "⚠️";
        icon.className = "cross animate__animated animate__flash";
        message.style.color = "#ffa726";
        message.style.textShadow = "0 0 15px #ffa726";
        message.innerText = "Error Fetching Data!";
    });

} else {
    icon.innerHTML = "❌";
    icon.className = "cross animate__animated animate__shakeX";
    message.style.color = "#ff1744";
    message.style.textShadow = "0 0 15px #ff1744";
    message.innerText = "Please enter both ID and Password!";
}

});



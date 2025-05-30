window.onload = () => {
        document.getElementById("login").style.display = "block";
    };

    function authenticate() {
        const input = document.getElementById("password").value;
        const loginMsg = document.getElementById("login-msg");

        // Save the password in session memory (not visible in code)
        sessionStorage.setItem("uploadPassword", input);

        // Try sending a dummy auth request to validate
        fetch("http://localhost:5000/auth", {
            method: "POST",
            headers: {
                "X-Password": input
            }
        })
        .then(res => {
            if (res.ok) {
                document.getElementById("login").style.display = "none";
                document.getElementById("upload").style.display = "block";
            } else {
                loginMsg.innerText = "Incorrect password.";
                loginMsg.className = "error";
            }
        })
        .catch(() => {
            loginMsg.innerText = "Server error.";
            loginMsg.className = "error";
        });
    }

    function uploadFile() {
        const file = document.getElementById("fileInput").files[0];
        const password = sessionStorage.getItem("uploadPassword");

        if (!file) {
            document.getElementById("upload-msg").innerText = "Please choose a file.";
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        fetch("http://localhost:5000/upload", {
            method: "POST",
            headers: {
                "X-Password": password
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                document.getElementById("upload-msg").innerText = data.message;
                document.getElementById("upload-msg").className = "success";
            } else {
                document.getElementById("upload-msg").innerText = data.error;
                document.getElementById("upload-msg").className = "error";
            }
        })
        .catch(() => {
            document.getElementById("upload-msg").innerText = "Upload failed.";
            document.getElementById("upload-msg").className = "error";
        });
    }


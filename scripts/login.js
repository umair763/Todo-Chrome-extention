document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("loginButton").addEventListener("click", async () => {
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;

		if (!email || !password) {
			alert("Please enter both email and password");
			return;
		}

		try {
			const response = await new Promise((resolve) => {
				chrome.runtime.sendMessage({ action: "login", email, password }, resolve);
			});

			if (!response.success) {
				throw new Error(response.message);
			}

			// Successfully logged in, redirect to tasks page
			window.location.href = "popup.html";
		} catch (error) {
			console.error("Login failed:", error);
			alert("Login failed. Please try again.");
		}
	});
});

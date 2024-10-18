// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "login") {
		loginUser(request.email, request.password)
			.then((token) => {
				// Store the token in chrome.storage
				chrome.storage.local.set({ token }, () => {
					sendResponse({ success: true, token });
				});
			})
			.catch((error) => {
				console.error("Login failed:", error);
				sendResponse({ success: false, message: error.message });
			});
		return true; // Indicate that we will send a response asynchronously
	}
});

// Function to log in the user and retrieve the token
async function loginUser(email, password) {
	const response = await fetch("https://todo-app-full-stack-opal.vercel.app/api/users/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password }), // Ensure this matches your expected structure
	});

	if (!response.ok) {
		throw new Error("Login failed");
	}

	const data = await response.json();
	return data.token; // Return the token from the response
}

// Function to fetch user tasks using the stored token
async function fetchTasks() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(["token"], async (result) => {
			const token = result.token;
			if (!token) {
				reject(new Error("No token found."));
			} else {
				const response = await fetch("https://todo-app-full-stack-opal.vercel.app/api/tasks", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					reject(new Error("Failed to fetch tasks"));
				} else {
					resolve(await response.json());
				}
			}
		});
	});
}

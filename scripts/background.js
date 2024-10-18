chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "login") {
		loginUser(request.email, request.password)
			.then((token) => {
				chrome.storage.local.set({ token }, () => {
					sendResponse({ success: true, token });
				});
			})
			.catch((error) => {
				console.error("Login failed:", error);
				sendResponse({ success: false, message: error.message });
			});
		return true;
	}
});

async function loginUser(email, password) {
	const response = await fetch("https://todo-app-full-stack-opal.vercel.app/api/users/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	});

	if (!response.ok) {
		throw new Error("Login failed");
	}

	const data = await response.json();
	return data.token;
}

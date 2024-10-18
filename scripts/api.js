export const loginUser = async (email, password) => {
	const response = await fetch("https://todo-app-full-stack-opal.vercel.app/api/users/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password }),
	});

	if (!response.ok) {
		throw new Error("Login failed");
	}

	return await response.json();
};

export const fetchUserTasks = async (token) => {
	const response = await fetch("https://todo-app-full-stack-opal.vercel.app/api/tasks", {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch tasks");
	}

	return await response.json();
};

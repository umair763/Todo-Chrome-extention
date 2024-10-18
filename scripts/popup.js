document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("fetchTasks").addEventListener("click", async () => {
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;

		if (!email || !password) {
			alert("Please enter both email and password");
			return;
		}

		try {
			// Send a message to the background script to log in
			const response = await new Promise((resolve) => {
				chrome.runtime.sendMessage({ action: "login", email, password }, resolve);
			});

			if (!response.success) {
				throw new Error(response.message);
			}

			// Now fetch tasks using the stored token
			const tasks = await fetchTasks(response.token);
			displayTasks(tasks);
		} catch (error) {
			console.error("Error fetching tasks:", error);
			alert("Failed to fetch tasks. Please try again.");
		}
	});
});

// Function to display tasks in the popup
function displayTasks(tasks) {
	const taskList = document.getElementById("taskList");
	taskList.innerHTML = ""; // Clear previous tasks

	if (tasks.length === 0) {
		taskList.innerHTML = "<p class='col-span-4 text-center'>No tasks found.</p>";
		return;
	}

	tasks.forEach((task) => {
		const taskCard = document.createElement("div");
		taskCard.className = "bg-white border rounded-lg shadow p-4 flex flex-col justify-between";
		taskCard.innerHTML = `
            <h2 class="font-semibold">${task.task}</h2>
            <span class="text-gray-600">Due: ${task.date}      Time: ${task.time}</span>
        `;
		taskList.appendChild(taskCard);
	});
}

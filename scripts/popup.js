// Function to fetch tasks from the server
async function fetchTasks() {
	try {
		// Fetch the stored token
		const token = await new Promise((resolve) => {
			chrome.storage.local.get("token", (result) => {
				resolve(result.token);
			});
		});

		if (!token) {
			alert("User not logged in");
			return;
		}

		// Show loading animation
		document.getElementById("loading").classList.remove("hide");

		// Fetch tasks from the API
		const response = await fetch("https://todo-app-full-stack-opal.vercel.app/api/tasks", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const errorMessage = await response.text();
			throw new Error(`Failed to fetch tasks: ${errorMessage}`);
		}

		const tasks = await response.json(); // Get the list of tasks
		displayTasks(tasks); // Pass the tasks to the display function

		// Hide loading animation after tasks have been displayed
		document.getElementById("loading").classList.add("hide");
	} catch (error) {
		console.error("Error fetching tasks:", error);
		alert("Failed to load tasks. Please try again.");
		// Hide loading animation if there’s an error
		document.getElementById("loading").classList.add("hide");
	}
}

// Function to display tasks in the popup
function displayTasks(tasks) {
	const taskList = document.getElementById("taskList");
	taskList.innerHTML = ""; // Clear previous tasks

	if (tasks.length === 0) {
		taskList.innerHTML = "<p class='col-span-4 text-center'>No tasks found.</p>";
		// Hide loading animation when there are no tasks
		document.getElementById("loading").classList.add("hiddenn");
		return;
	}

	tasks.forEach((task) => {
		const taskCard = document.createElement("div");
		taskCard.className = "bg-white border rounded-lg shadow p-4 grid grid-cols-4 items-center gap-2"; // Using a grid layout with 4 columns
		taskCard.innerHTML = `
			<h2 class="font-semibold col-span-2 text-sm sm:text-base truncate">${task.task}</h2>
			<span class="text-gray-600 text-xs sm:text-sm text-center">${task.date}</span>
			<span class="text-gray-600 text-xs sm:text-sm text-center">${task.time}</span>
			<button class="bg-red-600 text-white text-xs p-1 rounded delete-btn">
				Delete
			</button>
		`;

		// Add an event listener to the delete button
		const deleteButton = taskCard.querySelector(".delete-btn");
		deleteButton.addEventListener("click", () => deleteTask(task._id, taskCard));

		taskList.appendChild(taskCard);
	});
}

// Function to delete the task
async function deleteTask(taskId, taskElement) {
	try {
		// Fetch the stored token
		const token = await new Promise((resolve) => {
			chrome.storage.local.get("token", (result) => {
				resolve(result.token);
			});
		});

		if (!token) {
			alert("User not logged in");
			return;
		}

		// Send the DELETE request to the server
		const response = await fetch(`https://todo-app-full-stack-opal.vercel.app/api/tasks/${taskId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!response.ok) {
			const errorMessage = await response.text();
			throw new Error(`Failed to delete task: ${errorMessage}`);
		}

		// Remove the task from the UI after successful deletion
		taskElement.remove();
		alert("Task deleted successfully.");
	} catch (error) {
		console.error("Error deleting task:", error);
		alert("Failed to delete task. Please try again.");
	}
}

// Call fetchTasks to load tasks when the popup opens
fetchTasks();

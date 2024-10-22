document.addEventListener("DOMContentLoaded", () => {
	checkIfLoggedIn();

	document.getElementById("logout")?.addEventListener("click", () => {
		logoutUser();
	});
});

// Function to check if the user is logged in
function checkIfLoggedIn() {
	chrome.storage.local.get("token", async (result) => {
		const token = result.token;
		if (token) {
			// If token exists, assume it's valid and fetch tasks
			fetchTasks(token).catch((error) => {
				console.error("Error fetching tasks with stored token:", error);
				alert("Session expired or token invalid. Please log in again.");
				logoutUser(); // Log out if there's an issue with the token
			});
		} else {
			// No token, redirect to login page
			window.location.href = "login.html";
		}
	});
}

// Function to log out the user
function logoutUser() {
	chrome.storage.local.remove("token", () => {
		alert("Logged out successfully.");
		window.location.href = "login.html"; // Redirect to login
	});
}

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
		document.getElementById("loading").classList.add("hidden");
		return;
	}

	// Function to check if a task has exceeded its deadline
	function isDeadlineExceeded(task) {
		const now = new Date(); // Current date and time
		const taskDateTime = convertToComparableDateTime(task.date, task.time);

		// Extract just the date part from the current time for comparison (ignoring the time part)
		const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

		// Extract just the date part from the task date for comparison (ignoring the time part)
		const taskDateOnly = new Date(taskDateTime.getFullYear(), taskDateTime.getMonth(), taskDateTime.getDate());

		// If the task date is before today, it's considered exceeded
		if (taskDateOnly < nowDateOnly) {
			return true;
		}

		// If the task date is today, it hasn't exceeded yet (we check full day, not time)
		if (taskDateOnly.getTime() === nowDateOnly.getTime()) {
			return false; // Still within today's deadline
		}

		// If the task is in the future, it's not exceeded
		return false;
	}

	// Convert date and time to comparable Date object
	function convertToComparableDateTime(date, time) {
		const [day, month, year] = date.split("/");
		let [hours, minutes, ampm] = time.match(/(\d+):(\d+)\s(AM|PM)/).slice(1, 4);

		hours = parseInt(hours);
		if (ampm === "PM" && hours < 12) hours += 12;
		if (ampm === "AM" && hours === 12) hours = 0;

		return new Date(year, month - 1, day, hours, minutes);
	}

	// Display tasks with exceeded deadline status
	tasks.forEach((task) => {
		const taskCard = document.createElement("div");
		taskCard.className = "bg-white border rounded-lg shadow p-4 grid grid-cols-4 items-center gap-2"; // Using a grid layout with 4 columns

		// Check if the task's deadline is exceeded
		const exceeded = isDeadlineExceeded(task);
		const exceededMessage = exceeded
			? `<span style="color: #b91c1c; class="text-red-700 text-xs sm:text-sm">Deadline Exceeded</span>`
			: "";

		taskCard.innerHTML = `
			<h2 class="font-semibold col-span-2 text-sm sm:text-base truncate">${task.task}</h2>
			<span class="text-xs sm:text-sm text-center">${task.date}</span>
			<span class="text-xs sm:text-sm text-center">${task.time}</span>
			${exceededMessage}
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

# Todo App Chrome Extension

This Chrome extension is designed to seamlessly integrate with the [Todo App Full Stack](https://github.com/umair763/Todo-App-Full-Stack), allowing users to view, manage, and delete tasks directly from their browser. By logging into the extension with your Todo App account, you can easily access your tasks without needing to open the web application.

## Table of Contents

-   [Features](#features)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Screenshots](#screenshots)
-   [Demo](#demo)
-   [Contributing](#contributing)
-   [License](#license)

## Features

-   **View Tasks**: Instantly view all your tasks that are stored in the [Todo App Full Stack](https://github.com/your-repo/todo-app-full-stack).
-   **Delete Tasks**: Easily delete any task directly from the extension without having to open the web application.
-   **Persistent Session**: Once logged in, you remain logged in until you manually log out. The token is securely stored, and you will only be logged out if the token expires or you choose to log out.
-   **User Authentication**: Uses your existing credentials from the Todo App Full Stack, ensuring secure and verified access to your tasks.

## Prerequisites

To use this extension, you must have:

1. An active account in the [Todo App Full Stack](https://github.com/your-repo/todo-app-full-stack) application.
2. At least one task added to your account to see the functionality in action.

## Installation

1. Clone or download this repository:
    ```bash
    git clone https://github.com/your-repo/todo-chrome-extension.git
    ```
2. Open Google Chrome, and go to the Extensions page.

3. Enable **Developer mode** by toggling the switch in the upper right corner.

4. Click the **Load unpacked** button, and select the folder where you cloned or extracted the `todo-chrome-extension` repository.

5. Once loaded, the extension will appear in your Chrome toolbar.

## Usage

1. Open the Chrome extension by clicking its icon in the toolbar.

2. **Login**: If you're not logged in, you will be redirected to the login page. Enter your Todo App Full Stack credentials to log in.

3. **View Tasks**: Once logged in, the extension will automatically load your tasks from the Todo App Full Stack. Tasks are displayed with their title, date, and time.

4. **Delete Tasks**: Click the delete button next to any task to remove it from both the extension and your Todo App account.

5. **Logout**: Click the "Logout" button to sign out of your session. Your token will be cleared from local storage, and you will be redirected to the login page.

### Important Notes:

-   You must have an existing account in the [Todo App Full Stack](https://github.com/your-repo/todo-app-full-stack) to use this extension.
-   The tasks you see in the extension are the same as those stored in the Todo App Full Stack application. Any task added or deleted in the extension will reflect in the full app and vice versa.

## Screenshots

Here are some screenshots of the extension in action:

1. **Login Screen**

2. **Task List View**

3. **Task Deletion**

4. **Logged Out State**

## Demo

Watch the full demo of the Todo App Chrome Extension in action:

[Click here](https://vimeo.com/1020995254) to watch the demo video on YouTube.

## Project Structure

```bash
/Todo-Chrome-extention
   ├── /images                # Optional: icons and images for the extension
   ├── /scripts               # JavaScript files for extension logic
       ├── background.js      # Background script to handle GitHub login and token management
       ├── popup.js           # JavaScript for handling popup interactions (e.g., displaying tasks, delete task)
       ├── content.js         # Interacts with GitHub page to detect login (optional but useful)
       ├── api.js             # Handles API requests to your Todo app's backend to fetch and delete tasks
   ├── /styles                # Optional: CSS files for styling popup and other UI elements
       ├── popup.css          # Styles for the popup interface
   ├── manifest.json          # Metadata about the extension (version, permissions, etc.)
   ├── popup.html             # HTML for the popup interface where tasks will be displayed
   ├── options.html           # Optional: options page (if you need settings for the extension)
   ├── options.js             # JavaScript for options page (if needed)


```

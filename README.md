# CloudFourRainTaskManagementApp

A responsive, task management application built with Angular and deployed on Vercel. This app allows users to create, manage, and track tasks efficiently, offering a user experience across devices.

## 🌐 Live Demo

Experience the application live: [cloud-four-rain-task-management-app.vercel.app](https://cloud-four-rain-task-management-app.vercel.app)
Video Url [Video Link](https://drive.google.com/file/d/1EQPGmpwZyniugV4u7LpluNHLcgCEmApN/view?usp=drive_link)

## 🚀 Features

- User-friendly interface for task creation and management
- Responsive design compatible with various devices
- Workspaces management
- Real-time updates and task tracking
- Efficient handling of edge cases to ensure robustness

## 🛠️ Installation Steps

To set up the project locally, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/MohamedWaelGD/cloud-four-rain-task-management-app.git
   cd cloud-four-rain-task-management-app
   ```

2. **Install Dependencies**

   Ensure you have [Node.js](https://nodejs.org/) installed. Then, install the project dependencies:

   ```bash
   npm install --force
   ```

3. **Run the Development Server**

   Start the Angular development server:

   ```bash
   ng serve
   ```

   Navigate to `http://localhost:4200/` in your browser to view the application. The app will automatically reload if you make changes to the source files.

## 🧪 Edge Cases Handled

The application incorporates several checks and validations to handle potential edge cases, ensuring a smooth user experience:

- **Empty Task Submission**: Prevents users from creating tasks without a title or description, prompting for necessary information.
- **Task Deletion Confirmation**: Prompts users for confirmation before deleting a task to prevent accidental removals.
- **Responsive Design**: Ensures the application layout adjusts appropriately across different screen sizes and devices.
- **Error Handling**: Displays user-friendly error messages for unexpected issues, such as network errors or server unavailability.

## 📁 Project Structure

The project follows a standard Angular structure:

- `src/`
  - `app/`
    - `core/` - All services, components & classes in project
    - `features/` - Main features and pages
    - `shared/` - Reusable UI components
    - `app.module.ts` - Main application module
    - `app.component.ts` - Root component

## 📦 Deployment

The application is deployed on [Vercel](https://vercel.com/), leveraging its edge network for fast and reliable delivery. Vercel's infrastructure ensures optimal performance and scalability for the application.


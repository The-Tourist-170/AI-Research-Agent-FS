Of course. Here is the `README.md` file with detailed setup and deployment instructions.

# AI Research Agent

This is an AI Research Agent application that allows users to submit a research topic. The system processes it through an asynchronous workflow, fetches articles from various sources, summarizes them, stores the results, and displays the progress and final report in the UI.

## Tech Stack ⚙️

  - **Frontend**: React + Vite with TypeScript, Framer Motion for animations, `react-router-dom` for routing, and the native Fetch API for HTTP requests.
  - **Backend**: Node.js with TypeScript, Express for the API, `pg` for PostgreSQL connection, Bull.js for background job processing, and `node-fetch` for external API calls.
  - **Database**: PostgreSQL for storing tasks, logs, and results.
  - **Queue**: Redis is used with Bull.js to manage the asynchronous research workflow.
  - **Deployment**: The frontend is deployed on Firebase Hosting, while the backend API and worker are deployed on Render using Docker.

-----

## Local Setup 🚀

Follow these steps to get the application running on your local machine.

1.  **Clone the Repository**:

    ```bash
    git clone https://github.com/yourusername/ai-research-agent.git
    cd ai-research-agent
    ```

2.  **Environment Variables**:
    Copy the example environment file `.env.example` to a new `.env` file in the root directory.

    ```bash
    cp .env.example .env
    ```

    Open the `.env` file and add your `NEWSAPI_KEY` from [newsapi.org](https://newsapi.org).

3.  **Install Dependencies**:
    You need to install dependencies for both the backend and frontend.

      - In the `/backend` directory:
        ```bash
        cd backend
        npm install
        cd ..
        ```
      - In the `/frontend` directory:
        ```bash
        cd frontend
        npm install
        cd ..
        ```

4.  **Run with Docker**:
    The easiest way to start the entire stack (backend, worker, database, and redis) is with Docker Compose.

      - From the root directory, run:
        ```bash
        docker-compose up --build
        ```
      - The backend API will be available at `http://localhost:3000`.

5.  **Run the Frontend**:
    In a separate terminal, navigate to the `/frontend` directory and start the Vite development server.

    ```bash
    cd frontend
    npm run dev
    ```

      - The frontend will be available at `http://localhost:5173`.

6.  **Test the Application**:
    Open `http://localhost:5173` in your browser. Submit a research topic through the form to trigger the workflow. You can then view the task list and details as the worker processes the job.

-----

## Deployment Instructions ☁️

### Frontend (Firebase)

1.  **Firebase Setup**:

      - Create a Firebase account at [firebase.google.com](https://firebase.google.com) and create a new web project.
      - Install the Firebase CLI globally: `npm install -g firebase-tools`.

2.  **Build the Frontend**:
    Navigate to the `/frontend` directory and create a production build.

    ```bash
    cd frontend
    npm run build
    ```

    This will create a `dist/` directory with the compiled assets.

3.  **Deploy**:

      - Log in to Firebase: `firebase login`.
      - Initialize Firebase in the `/frontend` directory: `firebase init`.
          - Select **Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys**.
          - Choose your existing Firebase project.
          - Set your public directory to **`dist`**.
          - Configure as a single-page app by responding **Yes** to `Configure as a single-page app (rewrite all urls to /index.html)?`.
      - Deploy to Firebase: `firebase deploy`.

4.  **Configure Backend URL**:
    After deploying your backend on Render, update the `VITE_BACKEND_URL` environment variable in your frontend code or Firebase Hosting settings to point to your backend's public URL and redeploy.

### Backend (Render with Docker)

1.  **Render Setup**:

      - Create an account at [render.com](https://render.com).
      - Push your repository to GitHub.

2.  **Create Services on Render**:

      - **PostgreSQL**: Go to New \> PostgreSQL. Give it a name and choose a free plan. After it's created, copy the **Internal Connection URL**.
      - **Redis**: Go to New \> Redis. Provide a name and choose a free plan. Copy the **Internal Connection URL**.
      - **Web Service (API)**:
          - Go to New \> Web Service and connect your GitHub repository.
          - Set the **Root Directory** to `./backend`.
          - Set the **Runtime** to **Docker**.
          - Under **Environment Variables**, add `DATABASE_URL` (from Postgres), `REDIS_URL` (from Redis), `NEWSAPI_KEY`, etc.
          - The **Start Command** is not needed when using Docker, as it will be defined in the `Dockerfile`. Ensure your `Dockerfile` uses `CMD ["node", "dist/app.js"]`.
      - **Background Worker (Queue)**:
          - Go to New \> Background Worker. Use the same GitHub repository.
          - Set the **Root Directory** to `./backend` and **Runtime** to **Docker**.
          - Add the same environment variables as the Web Service.
          - Ensure your `Dockerfile` for the worker uses a different start command, like `CMD ["node", "dist/service/worker.js"]`. You may need separate Dockerfiles for the API and worker or use a single one with an entrypoint script.

3.  **Auto-Deploy**:
    Render will automatically build and deploy your services whenever you push changes to the `main` branch on GitHub.

-----

## Public URLs 🌐

  - **Frontend**: [client](https://ai-research-agent-2002.firebaseapp.com/)
  - **Backend**: [server](https://server-ai-research-agent.onrender.com)

-----

## Running Tests ✅

  - **Backend**: No automated tests are configured yet. You can manually test the API endpoints using a tool like Postman:
      - `POST /research`
      - `GET /research`
      - `GET /research/:id`
  - **Frontend**: Manually test all UI interactions locally, including form submission, task status updates, and viewing results.

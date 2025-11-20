 
cd C:\Users\pavan\Downloads\AI-EDITOROR
notepad README.md
```

When Notepad opens and asks "Do you want to create a new file?", click **Yes**.

Then paste this content:
```
# Collaborative Code Editor

A real-time collaborative code editor with AI completions for JavaScript, Python, and Java.

## What You Need

- Java 17+
- Node.js 18+
- Maven
- Gemini API Key (free from Google)

## Getting Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Click "Create API key in new project"
5. Copy the API key

## Setup Instructions

### Backend Setup

1. Open the file backend/src/main/resources/application.properties
2. Find the line: gemini.api.key=YOUR_API_KEY_HERE
3. Replace YOUR_API_KEY_HERE with your actual Gemini API key
4. Save the file

5. Open Command Prompt and run:
   cd backend
   mvn clean install
   mvn spring-boot:run

6. Wait for the message "Backend Started"
7. Backend will run on http://localhost:8080

### Frontend Setup

1. Open a new Command Prompt window
2. Run these commands:
   cd frontend
   npm install
   npm start

3. Wait for "Compiled successfully"
4. Frontend will run on http://localhost:4200

## How to Use

1. Start the backend first (follow Backend Setup)
2. Start the frontend (follow Frontend Setup)
3. Open your browser and go to http://localhost:4200
4. Select a programming language from the dropdown
5. Start typing code
6. Press Ctrl+Space for AI code suggestions

## Testing Collaboration

1. Open http://localhost:4200 in first browser tab
2. Open http://localhost:4200 in second browser tab
3. Type in one tab and see changes appear in the other tab

## Common Problems

### Port 8080 is already in use
- Another program is using port 8080
- Stop that program or restart your computer

### Backend won't start
- Check if you added the Gemini API key correctly
- Make sure Java 17 is installed: java -version
- Make sure Maven is installed: mvn -version

### Frontend won't start
- Delete the node_modules folder and package-lock.json
- Run npm install again
- Run npm start

### AI completions not working
- Check if backend is running
- Check if you added the correct Gemini API key
- Look at backend terminal for error messages

## Project Structure

AI-EDITOROR/
  frontend/
    src/
      app/
        components/
          editor/
        services/
  backend/
    src/
      main/
        java/
          com/editor/
            config/
            controller/
            model/
            service/
        resources/

## Features

- Real-time collaborative editing
- Support for JavaScript, Python, and Java
- AI-powered code completions using Google Gemini
- Syntax highlighting
- Multiple users can code together

## Stopping the Application

Backend: Press Ctrl+C in the backend terminal
Frontend: Press Ctrl+C in the frontend terminal
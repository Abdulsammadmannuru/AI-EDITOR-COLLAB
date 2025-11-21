 Real-time Collaborative Code Editor with AI Code Completion

A full-stack web application enabling multiple developers to edit code simultaneously in real-time with AI-powered code completion using Google's Gemini API.

## Features

- Real-time Collaboration: Multiple users can edit the same code document simultaneously
- AI Code Completion: Intelligent code suggestions powered by Google Gemini API
- Multi-language Support: JavaScript, Python, and Java syntax highlighting
- WebSocket Communication: Low-latency bidirectional communication using STOMP protocol
- Live Cursor Tracking: See where other collaborators are typing in real-time
- Room-based Sessions: Users join specific rooms for isolated collaboration
- Responsive UI: Clean, modern interface with CodeMirror 6 editor
- Conflict-free Updates: Real-time synchronization without merge conflicts

---


### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Angular Frontend Application                  │  │
│  │  ┌─────────────────────┐  ┌──────────────────────────┐   │  │
│  │  │   CodeMirror 6      │  │   Collaboration UI       │   │  │
│  │  │   Editor Component  │  │   (Users, Status)        │   │  │
│  │  └──────────┬──────────┘  └──────────────────────────┘   │  │
│  │             │                                              │  │
│  │  ┌──────────▼────────────────────────────────────────┐   │  │
│  │  │            Services Layer                          │   │  │
│  │  │  • CompletionService (HTTP REST)                  │   │  │
│  │  │  • CollaborationService (WebSocket STOMP)         │   │  │
│  │  └───────────┬──────────────────┬────────────────────┘   │  │
│  └──────────────┼──────────────────┼────────────────────────┘  │
└─────────────────┼──────────────────┼───────────────────────────┘
                  │                  │
            HTTP REST          WebSocket STOMP
                  │                  │
┌─────────────────▼──────────────────▼───────────────────────────┐
│                   Spring Boot Backend                           │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    Controllers Layer                       │ │
│  │  • CompletionController (REST)                            │ │
│  │  • CollaborationController (WebSocket)                    │ │
│  └────────┬──────────────────────────┬────────────────────────┘ │
│           │                          │                          │
│  ┌────────▼──────────┐      ┌────────▼─────────────┐          │
│  │  GeminiService    │      │  WebSocket STOMP     │          │
│  │  (Business Logic) │      │  Message Broker      │          │
│  └────────┬──────────┘      └──────────────────────┘          │
└───────────┼─────────────────────────────────────────────────────┘
            │
    ┌───────▼──────────┐
    │  Google Gemini   │
    │  API (AI Model)  │
    └──────────────────┘
```

### Component Interaction Flow

## 1. Real-time Collaboration Flow

```
User A Types Code → Frontend Detects Change → WebSocket Message
    ↓
Backend Receives via @MessageMapping → Broadcasts to All Subscribers
    ↓
All Connected Clients Receive Update → Update Their Editors
```

## 2. AI Code Completion Flow


User Presses Ctrl+Space → Frontend Calls CompletionService
    ↓
HTTP POST to /api/complete → Backend CompletionController
    ↓
GeminiService Builds Prompt → Calls Gemini API
    ↓
Parses AI Response → Returns Suggestions
    ↓
Frontend Displays in Autocomplete Dropdown



##  Technology Stack

### Backend
- Framework: Spring Boot 3.2.0
- Language: Java 17
- Build Tool: Maven 3.6+
- WebSocket: Spring WebSocket with STOMP protocol
- HTTP Client: OkHttp 4.12.0
- AI Integration: Google Gemini API

### Frontend
- Framework: Angular 20
- Language: TypeScript 5.6
- Editor: CodeMirror 6
- WebSocket Client: @stomp/stompjs
- HTTP Client: Angular HttpClient
- Reactive Programming: RxJS 7.8

### Infrastructure
- Protocol: HTTP/HTTPS, WebSocket (ws/wss)
- Real-time: STOMP over WebSocket
- Data Format: JSON

---

## 📦 Prerequisites

### Required Software

| Software | Version | Purpose |
| Java JDK | 17+ | Backend runtime |
| Maven | 3.6+ | Backend build tool |
| Node.js | 18+ | Frontend runtime |
| npm | 9+ | Frontend package manager |
| Angular CLI | 20+ | Frontend development |

### Verify Installations

```bash
# Check Java
java -version


# Check Maven
mvn -version


# Check Node.js
node -v


# Check npm
npm -v


# Check Angular CLI
ng version

```

### Obtaining Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Click "Create API key in new project"
5. Copy the generated key (format: `AIzaSy...`)

Note: The API key is FREE with generous quotas (60 requests/minute).

---

## 🚀 Installation & Setup

### Linux Environment Setup

#### 1. Install Java 17

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk -y

# Fedora/RHEL
sudo dnf install java-17-openjdk-devel -y

# Verify
java -version
```

#### 2. Install Maven

```bash
# Ubuntu/Debian
sudo apt install maven -y

# Fedora/RHEL
sudo dnf install maven -y

# Manual installation
cd /opt
sudo wget https://dlcdn.apache.org/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.tar.gz
sudo tar xzf apache-maven-3.9.6-bin.tar.gz
sudo ln -s apache-maven-3.9.6 maven

# Add to PATH
echo 'export PATH=/opt/maven/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Verify
mvn -version
```

#### 3. Install Node.js and npm

```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node -v
npm -v
```

#### 4. Install Angular CLI

```bash
sudo npm install -g @angular/cli@20

# Verify
ng version
```

---

### Backend Setup

#### 1. Clone Repository

```bash
https://github.com/Abdulsammadmannuru/AI-EDITOR-COLLAB.git
cd AI-EDITOR-COLLAB
```

#### 2. Navigate to Backend Directory

```bash
cd CollaborativeEditor
```

#### 3. Configure Application Properties

Edit `src/main/resources/application.properties`:

```properties
# Server Configuration
spring.application.name=collaborative-code-editor
server.port=8080

# Gemini API Configuration
gemini.api.key=AIzaSyDB5Ice-rE5KhkuH5CDdg16pb-Bpme_POE
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent

# WebSocket Configuration(size 1MB)
spring.websocket.max-message-size=1048576
spring.websocket.max-buffer-size=1048576

# Logging
logging.level.root=INFO
logging.level.com.editor=DEBUG
```

 Replace `GEMINI_API_KEY` with your real API key!

#### 4. Build Backend

```bash
# Clean and build
mvn clean install

# Skip tests (if needed)
mvn clean install -DskipTests
```

Expected Output:
```
[INFO] BUILD SUCCESS
[INFO] Total time: 45.123 s
```

---

### Frontend Setup

#### 1. Navigate to Frontend Directory

```bash
cd ../frontend
```

#### 2. Install Dependencies

```bash
npm install

# If peer dependency warnings appear:
npm install --legacy-peer-deps
```

This will take 3-5 minutes. You should see:
```
added XXX packages in XXs
```

#### 3. Verify Configuration

Check `src/app/services/completion.service.ts`:
```typescript
private apiUrl = 'http://localhost:8080/api';
```

Check `src/app/services/collaboration.service.ts`:
```typescript
private wsUrl = 'http://localhost:8080/ws';
```

---

## ⚙️ Configuration

### Backend Configuration Options

File: `backend/src/main/resources/application.properties`

### Frontend Configuration Options

File: `frontend/src/app/services/completion.service.ts`

```typescript
private apiUrl = 'http://localhost:8080/api';  // Backend REST API
```

File: `frontend/src/app/services/collaboration.service.ts`

```typescript
private wsUrl = 'http://localhost:8080/ws';  // Backend WebSocket
```

### CORS Configuration

File: `/src/main/java/com/editor/CollaborativeEditor/config/WebSocketConfig.java`

```java
.setAllowedOriginPatterns("*")  // Development: Allow all origins
```



---

## 🎮 Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
mvn spring-boot:run
```

Wait for:
```
=================================================
 Collaborative Code Editor Backend Started!
=================================================
 WebSocket: ws://localhost:8080/ws
 REST API: http://localhost:8080/api
 Health: http://localhost:8080/api/health
=================================================
```

Backend is ready when you see this message!

### Start Frontend (Terminal 2)

Open a new terminal:

```bash
cd frontend
ng serve
```

Wait for:
```
✔ Browser application bundle generation complete.
✔ Compiled successfully.
```

Frontend is ready!

### Access Application

Open your browser and navigate to:

```
http://localhost:4200
```

### Verify Backend Health

```bash
curl http://localhost:8080/api/health
```

Expected Response:
```
Backend is running! ✅
```

---

## 📡 API Documentation

### REST API Endpoints

#### 1. Health Check

Endpoint: `GET /api/health`

Description: Check if backend is running

Request:
```bash
curl http://localhost:8080/api/health
```

Response:
```
Backend is running! ✅
```

Status Codes:
- `200 OK`: Backend is healthy

---

#### 2. Get Code Completion

Endpoint: `POST /api/complete`

Description: Get AI-powered code completion suggestions

Request Headers:
```
Content-Type: application/json
```

Request Body:
```json
{
  "code": "function test() {",
  "cursorPosition": 17,
  "language": "javascript",
  "maxSuggestions": 5
}
```

Request Fields:

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| `code` | string | Current code content | Yes |
| `cursorPosition` | integer | Cursor position (0-based) | Yes |
| `language` | string | Programming language | Yes |
| `maxSuggestions` | integer | Max suggestions to return | No |

Response:
```json
[
  {
    "suggestion": "\n  return true;\n}",
    "description": "AI-generated completion",
    "confidence": 85,
    "source": "gemini-pro"
  }
]
```

Response Fields:

| Field | Type | Description |
|-------|------|-------------|
| `suggestion` | string | Code to insert at cursor |
| `description` | string | Human-readable description |
| `confidence` | integer | Confidence score (0-100) |
| `source` | string | Source of suggestion |

Status Codes:
- `200 OK`: Success
- `400 Bad Request`: Invalid request (empty code, etc.)
- `500 Internal Server Error`: Server error

Example using curl:
```bash
curl -X POST http://localhost:8080/api/complete \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function test() {",
    "cursorPosition": 17,
    "language": "javascript",
    "maxSuggestions": 5
  }'
```

---

## 🔌 WebSocket Protocol

### Connection Endpoint

URL: `ws://localhost:8080/ws`

Protocol: STOMP over WebSocket with SockJS fallback

### Connection Flow

1. Client connects to `ws://localhost:8080/ws`
2. STOMP handshake establishes connection
3. Client subscribes to `/topic/collaboration`
4. Client sends messages to `/app/collaborate`
5. Server broadcasts messages to all subscribers

### STOMP Frame Format

#### CONNECT Frame (Client → Server)
```
CONNECT
accept-version:1.2
heart-beat:10000,10000

^@
```

#### CONNECTED Frame (Server → Client)
```
CONNECTED
version:1.2
heart-beat:10000,10000

^@
```

#### SUBSCRIBE Frame (Client → Server)
```
SUBSCRIBE
id:sub-0
destination:/topic/collaboration

^@
```

#### SEND Frame (Client → Server)
```
SEND
destination:/app/collaborate
content-type:application/json

{"roomId":"room-123","userId":"user_abc","operation":"join",...}^@
```

#### MESSAGE Frame (Server → Client)
```
MESSAGE
destination:/topic/collaboration
content-type:application/json

{"roomId":"room-123","userId":"user_abc","operation":"join",...}^@
```

### Message Types

#### 1. JOIN Message

Sent when: User opens editor and connects

Format:
```json
{
  "roomId": "room-123",
  "userId": "user_abc",
  "content": "",
  "operation": "join",
  "timestamp": 1704067200000,
  "metadata": null
}
```

Backend Action: Increments room user count, broadcasts to others

---

#### 2. LEAVE Message

Sent when: User closes browser or disconnects

Format:
```json
{
  "roomId": "room-123",
  "userId": "user_abc",
  "content": "",
  "operation": "leave",
  "timestamp": 1704067201000,
  "metadata": null
}
```

Backend Action: Decrements user count, notifies others

---

#### 3. UPDATE Message

Sent when: User types/edits code

Format:
```json
{
  "roomId": "room-123",
  "userId": "user_abc",
  "content": "function test() { return 42; }",
  "operation": "update",
  "timestamp": 1704067202000,
  "metadata": null
}
```

Backend Action: Broadcasts code to all room members

---

#### 4. CURSOR Message

Sent when: User moves cursor

Format:
```json
{
  "roomId": "room-123",
  "userId": "user_abc",
  "content": "",
  "operation": "cursor",
  "timestamp": 1704067203000,
  "metadata": {
    "cursorPosition": 45
  }
}
```

Backend Action: Broadcasts cursor position to others

---

## 💻 Usage Examples

### Example 1: Testing AI Code Completion

Step 1: Start backend and frontend

Step 2: Open browser at `http://localhost:4200`

Step 3: Type incomplete code:
```javascript
function calculateSum(a, b) {
  return 
```

Step 4: Press `Ctrl+Space`

Step 5: See AI suggestions appear:
```
→ a + b;
→ 0;
→ null;
```

Step 6: Press `Tab` to accept suggestion

---

### Example 2: Real-time Collaboration

Step 1: Open first browser window:
```
http://localhost:4200?room=test-room
```

Step 2: Open second browser window:
```
http://localhost:4200?room=test-room
```

Step 3: Type in first window:
```javascript
function hello() {
  console.log("Hello World");
}
```

Step 4: See changes appear in second window instantly

Step 5: Check user count indicator:
```
👥 2 active
```

---

### Example 3: Testing Different Languages

Step 1: Select language from dropdown: Python

Step 2: Type Python code:
```python
def calculate():
    return 
```

Step 3: Press `Ctrl+Space`

Step 4: See Python-specific suggestions:
```
→ True
→ None
→ result
```

---

### Example 4: Using curl to Test Backend API

```bash
# Test health endpoint
curl http://localhost:8080/api/health

# Test code completion
curl -X POST http://localhost:8080/api/complete \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def test():\n    return ",
    "cursorPosition": 22,
    "language": "python",
    "maxSuggestions": 3
  }'
```

---

##  Project Structure

```
collaborativeEditor/
│
├── backend/                                    # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/editor/
│   │       │   ├── CollaborativeEditorApplication.java    # Main entry point
│   │       │   ├── config/
│   │       │   │   └── WebSocketConfig.java               # WebSocket configuration
│   │       │   ├── controller/
│   │       │   │   ├── CompletionController.java          # REST API endpoints
│   │       │   │   └── CollaborationController.java       # WebSocket handlers
│   │       │   ├── model/
│   │       │   │   ├── CompletionRequest.java             # DTO: AI request
│   │       │   │   ├── CompletionResponse.java            # DTO: AI response
│   │       │   │   └── CollaborationMessage.java          # DTO: WebSocket message
│   │       │   └── service/
│   │       │       └── GeminiService.java                 # Business logic
│   │       └── resources/
│   │           └── application.properties                 # Configuration
│   └── pom.xml                                            # Maven dependencies
│
└── frontend/                                   # Angular Frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   │   └── editor/
    │   │   │       ├── editor.component.ts                # Main editor logic
    │   │   │       ├── editor.component.html              # Editor template
    │   │   │       └── editor.component.css               # Editor styles
    │   │   ├── services/
    │   │   │   ├── completion.service.ts                  # AI completion service
    │   │   │   └── collaboration.service.ts               # WebSocket service
    │   │   ├── app.component.ts                           # Root component
    │   │   ├── app.config.ts                              # App configuration
    │   │   └── app.routes.ts                              # Routing config
    │   ├── index.html                                     # HTML entry point
    │   ├── main.ts                                        # TypeScript entry
    │   └── styles.css                                     # Global styles
    ├── angular.json                                       # Angular config
    ├── package.json                                       # npm dependencies
    └── tsconfig.json                                      # TypeScript config
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `CollaborativeEditorApplication.java` | Spring Boot main class, application entry point |
| `WebSocketConfig.java` | Configures STOMP over WebSocket |
| `CompletionController.java` | REST API for AI completions |
| `CollaborationController.java` | WebSocket message handlers |
| `GeminiService.java` | Integrates with Google Gemini API |
| `editor.component.ts` | Main editor UI and logic |
| `completion.service.ts` | HTTP client for AI requests |
| `collaboration.service.ts` | WebSocket/STOMP client |

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue 1: Backend Won't Start - Port Already in Use

Error:
```
Port 8080 already in use
```

Solution:
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change port in application.properties
server.port=8081
```

---

#### Issue 2: Gemini API Error 400/401

Error:
```
Gemini API error 401: API key not valid
```

Solutions:
1. Verify API key in `application.properties`
2. Check key format starts with `AIzaSy`
3. Generate new key at https://aistudio.google.com/app/apikey
4. Restart backend after changing key

---

#### Issue 3: Gemini API Error 429 - Rate Limit

Error:
```
Gemini API error 429: Rate limit exceeded
```

Solutions:
1. Wait 1 minute before trying again
2. Reduce completion request frequency
3. Check API quota at Google AI Studio
4. Consider upgrading API plan

---

#### Issue 4: WebSocket Connection Failed

Error in Browser Console:
```
WebSocket connection failed
```

Solutions:
1. Verify backend is running: `curl http://localhost:8080/api/health`
2. Check CORS configuration in `WebSocketConfig.java`
3. Verify WebSocket URL in `collaboration.service.ts`
4. Try disabling browser extensions
5. Check firewall settings

---

#### Issue 5: Frontend Won't Compile

Error:
```
Cannot find module '@codemirror/...'
```

Solution:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

#### Issue 6: Angular CLI Not Found

Error:
```
ng: command not found
```

Solution:
```bash
sudo npm install -g @angular/cli@20
```

---

#### Issue 7: Maven Not Found

Error:
```
mvn: command not found
```

Solution:
```bash
# Ubuntu/Debian
sudo apt install maven

# Or add to PATH
echo 'export PATH=/opt/maven/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

### Debug Logging

#### Enable Detailed Backend Logs

Edit `application.properties`:
```properties
logging.level.org.springframework.web.socket=TRACE
logging.level.org.springframework.messaging=TRACE
```

#### Enable Frontend Debug Logs

Edit `collaboration.service.ts`:
```typescript
debug: (str) => {
  console.log('STOMP:', str);
}
```

---

## 📊 Assumptions & Limitations

### Assumptions Made

1. Single Server Deployment
   - Application runs on single server instance
   - No distributed deployment or load balancing
   - All WebSocket connections to same server

2. In-Memory State
   - Room user counts stored in memory
   - No persistent storage of code or sessions
   - State lost on server restart

3. Simple Synchronization
   - Full document sync 
   
   - No conflict resolution beyond basic broadcast

4. Trusted Network
   - No authentication/authorization
   - No user verification
   - No access control on rooms

5. Limited File Size
   - WebSocket messages capped at 1MB
   - Only typical code files
   - Not designed for very large files

### Known Limitations

1.
   - Code is not saved to disk
   - No version history

2. Basic Conflict Resolution
   - Simultaneous edits may overwrite each other
   - No operational transform
   - Simple broadcast mechanism

3. No Authentication
   - Anyone can join any room
   - No user identity verification
   - No room passwords or access control

4. Single Region
   - No geographic distribution
   - High latency for distant users
   

5. API Rate Limits
   - Gemini API has free tier limits
   - 60 requests per minute
   

6. Browser Support
   - Requires modern browser with WebSocket
   - SockJS fallback for older browsers
   - Best on Chrome, Firefox, Edge



##  Future Enhancements

### Phase 1: Core Improvements

1. Operational Transform (OT)
   - Implement proper OT algorithm
   - Handle concurrent edits correctly
   - Integrate Yjs or similar CRDT library

2. User Authentication
   - JWT-based authentication
   - Session management

3. Persistent Storage
   - Save documents to database
   - Version history tracking
   - Auto-save functionality

4. Room Access Control
   - Password-protected rooms
   - Invite-only sessions
   

### Phase 2: Advanced Features

5. Video/Audio Chat
   - In-editor voice chat
   - Screen sharing

6. Code Execution
   -  code execution
   - Support multiple languages
   - Output display in editor

7. Multiple Files
   - File tree navigation
   - Multi-file editing
   - Project management

8. Enhanced AI Features
   - Code review suggestions
   - Bug detection
   - Refactoring recommendations
   - Documentation generation

### Phase 3: Enterprise Features

9. Team Management
   - Organization accounts
   - Project sharing

10. Analytics & Monitoring
    - Real-time collaboration metrics
    - User activity tracking
    - Performance monitoring
    - Error reporting 

11. Deployment & Scaling
    - Kubernetes deployment
    - Horizontal scaling
    - Redis for distributed state
    - Load balancing

12. IDE Integration
    - VS Code extension
    - IntelliJ plugin
    - API for third-party tools

### Technical Debt & Improvements

 Add comprehensive unit tests
Add integration tests
. Implement rate limiting
. Add request validation
. Improve error messages
. Add metrics/monitoring
. Optimize WebSocket performance
. Add compression for large documents
. Implement reconnection logic
. Add offline support
. Improve mobile responsiveness
. Add dark/light theme toggle
. Implement undo/redo
. Add keyboard shortcuts customization
. Add syntax error highlighting




 Please follow these steps:

1. Create A repository
2. Create a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. PUll




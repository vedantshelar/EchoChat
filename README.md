🟨 EchoChat-Backend

📌 Description
EchoChat Backend is the powerful server-side engine of the EchoChat application that handles all core operations including user authentication, real-time communication, and chat group management. Built with Node.js and Express.js, this backend provides a structured and scalable RESTful API that connects seamlessly with the frontend using Socket.IO for bi-directional real-time messaging.

It uses MongoDB as the primary database to store and manage users, messages, and group data securely and efficiently. The project follows a modular MVC architecture, making it easy to maintain, extend, and scale.

Whether it's sending a private message, creating a group chat, or authenticating users via JWT tokens, the backend ensures fast, secure, and reliable performance.

🚀 Features
🔐 Secure Authentication: Uses JWT and HttpOnly cookies to manage user sessions securely.

💬 Real-Time Messaging: Enables instant one-to-one and group chat via Socket.IO.

📁 Message Persistence: All messages and group metadata are stored in MongoDB.

📡 RESTful API: Clean endpoints for user, group, and message management.

🧩 Modular Structure: Clean separation of concerns using Controllers, Routes, Models, and Schemas.

🛡 Error Handling & Validation: Consistent error responses and request validations.

🌐 CORS Support: Enables secure communication with the frontend during development.

🛠 Tech Stack
Runtime: Node.js

Framework: Express.js

Database: MongoDB + Mongoose

Real-Time Communication: Socket.IO

Authentication: JWT + bcrypt.js

Environment Config: dotenv

Security & Middleware: CORS, cookie-parser, express.json()


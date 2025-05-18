📄 Documentation (README)

Demo Link https://www.loom.com/share/a58dc51b42354fb493dccd5cf91b615e?sid=562391ec-ef90-4398-b76f-f2c512500d3b

Tech stack used:  
🖥️ Frontend
React.js |
Vite |
Tailwind CSS / ShadCN 

🧠 Backend
Python |
Django or Django REST Framework (DRF)

🗃️ Database
PostgreSQL

🐳 Deployment
Docker |
Docker Compose 

🔒 Authentication
JWT

Run locally

❗️❗️❗️ Prerequisites
- Docker Desktop

Installation
  1. Clone the repository
  - git clone https://github.com/sipcoffee/movieapp.git

  3. Environment Variables
  - Use the exsiting environment variables or change it.

  3. Start Devlopment Server
  - docker-compose -f docker-compose.dev.yml up -d --build

  4. Open http://localhost:5175

🐛 Known bugs:
- When trying to logout someting it will error out to token already blacklist.

❌ Limitations
- No additional manual input of banner
- No Autogeneration of thumbnail

🔎 Missing Features
- Use Django background tasks (e.g., Celery + Redis) to process video or file handling or
thumbnail generation or HLS generation for streaming


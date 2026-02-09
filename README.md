# Gym Management System

## Overview
The Gym Management System is designed to efficiently manage gym operations, helping gym owners and staff streamline their tasks and improve customer satisfaction.

## Technology Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Containerization:** Docker

## Project Structure
```
├── client                # Frontend code
├── server                # Backend code
├── docker-compose.yml    # Docker compose file
└── README.md            # Project documentation
```

## Getting Started
1. **Clone the repository:**  
   ```bash
   git clone https://github.com/GiorgosThf/gym-management-sys.git
   cd gym-management-sys
   ```
2. **Setup Docker services:**  
   ```bash
   docker-compose up
   ```
3. **Access the application:**  
   Visit `http://localhost:3000` in your web browser.

## Docker Services
The project uses Docker to run services smoothly. Ensure you have Docker installed, then use:
```bash
docker-compose up
```
This command starts the following services:
- **Web Client:** Accessible on port 3000
- **API Server:** Accessible on port 5000
- **MongoDB:** Database service

## Configuration
Most configuration settings are available in the `config` directory. Ensure to adjust the connection strings and ports as needed.

## Features
- **User Management:** Register, login, and manage gym members.
- **Class Scheduling:** Create and manage workout schedules.
- **Payments and Billing:** Process payments and manage members' billing details.

## Contributing
Feel free to contribute to this project! Please refer to the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Special thanks to the contributors and the community for their support!
# Getting Started
## Backend Setup (Django & MySQL)
````Bash
cd backend
````
1. Open your terminal and navigate into the backend directory.
2. Install the required Python dependencies by running the following command:
````Bash
pip install -r requirements.txt
````
3. Set up your MySQL database. Make sure you have the correct connection details (username, password, and database name) configured in your Django settings.  
4. Run the database migrations to create the necessary tables:
```Bash
python manage.py migrate
```

## Frontend Setup (Angular)
````Bash
cd frontend
````
1. Open a new terminal window and navigate to the root directory of your project (where the package.json file is located).
2. Install the Angular dependencies by running this command:
```Bash
npm install
```
## Running the Project
1. In the terminal window where you set up the backend, start the Django development server:
```Bash
python manage.py runserver
```
This will launch the backend server, typically at http://127.0.0.1:8000.

2. In the terminal window where you set up the frontend, start the Angular development server:
```Bash
ng serve
```

This will compile the application and launch it on a local server, usually at http://localhost:4200.

## Screenshots
### 1 Login Page
<img width="1866" height="778" alt="image" src="https://github.com/user-attachments/assets/089d2c5d-3dde-4793-bb6f-747dc7dd34b9" />

### 2 Register Page
<img width="1755" height="766" alt="image" src="https://github.com/user-attachments/assets/db9e0f3f-2d5c-48e2-b1fb-12b7adb63b18" />

### 3 Pokemon Data Center
<img width="1665" height="887" alt="image" src="https://github.com/user-attachments/assets/d54f6d01-7071-4a37-85ca-133e0bdeb3ff" />

### 4 Pokemon Details
<img width="1883" height="896" alt="image" src="https://github.com/user-attachments/assets/fccddb11-5956-4297-b4ce-3c7c084aa4f5" />




# Getting Started
## Backend Setup (Django & MySQL)
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

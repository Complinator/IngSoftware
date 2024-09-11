# Chatbot project
## Backend Instructions
### Set Up
We are using [pipenv](https://pipenv.pypa.io/en/latest/installation.html) for the set up of the program. solves the problems of dependency management in Python projects by providing a unified and automated approach to handling dependencies, creating virtual environments, and resolving dependencies. It eliminates the need for manual dependency pinning by locking the dependencies of a project in a Pipfile. In order to set up the backend we have to set up the virtual environment using pipenv, for that we use:

```console
$ pipenv shell
```

That whill create a file called "Pipfile", that contains info about the virtual environment and its dependencies. Then, in order to add the dependencies to the Pipfile just run:

```console
$ pipenv install -r requirements.txt
```

(REMEMBER: Do that inside the backend file so the dependencies are installed there)

### Start server locally
For the server we are using [uvicorn](https://www.uvicorn.org/) which is a web server that handles network communication - receiving requests from client applications such as users' browsers and sending responses to them. It communicates with FastAPI using the Asynchronous Server Gateway Interface (ASGI), a standard API for Python web servers that run asynchronous code. To run the server just use:

```console
$ uvicorn main:app --reload
```

(we use `--reload` to run the server reloading it for every change without the need to disconnect from the app)

Good thing about using uvicorn and FastAPI is that it have swagger implemented, so you can see the endpoints of the app by going to the route `/docs` (`localhost:port/docs`)
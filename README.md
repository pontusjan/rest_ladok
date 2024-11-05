# Ladok REST Service

## Overview

**Ladok REST Service** is a simple RESTful API built with **Node.js**, **Express**, and **TypeScript**. It provides an endpoint to simulate registering results to Ladok.

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/ladok-rest-service.git
   cd ladok-rest-service
   ```

2. **Install Dependencies**

    Ensure you have node.js installed, then install the project dependencies:
    ```bash
    npm install
    ```

## Running the Server

1. **Build the project**

    Compile Typescript files to Javascript:
    ```bash
    npm run build
    ```

2. **Start the server**

    ```bash
    npm start
    ```

**Server url:** http://localhost:8000

## API Endpoints

**Register result (/reg_resultat)**

Send a JSON object to the endpoint /reg_resultat with the following fields:
| Field         | Type   | Description                                                      |
|---------------|--------|------------------------------------------------------------------|
| personnummer  | string | 10 or 12 digits, no dash                                         |
| kurskod       | string | Course code in format Letter, 4 numbers, Letter (eg. "D0031N")   |
| modul         | string | Module code, 4 digit string (eg. "0005")                         |
| datum         | string | Date in YYYY-MM-DD format                                        |
| betyg         | string | Grade, must be one of "U", "G", "G#" or "VG"                     |


**Example responses**

Success:

    ```bash
    {
    "status": "success",
    "message": "Transaction registered successfully.",
    "data": {
        "personnummer": "199001011234",
        "kurskod": "D0031N",
        "modul": "0005",
        "datum": "2023-10-15",
        "betyg": "G"
        }
    }
    ```


Failure:

    ```bash
    {
    "status": "error",
    "message": "Validation failed.",
    "errors": [
            {
            "id": 1,
            "message": "personnummer must be either 10 or 12 digits, no dash."
            },
            {
            "id": 2,
            "message": "kurskod must be in the format Letter, 4 numbers, Letter (e.g., \"D0031N\")."
            }
        ]
    }
    ```

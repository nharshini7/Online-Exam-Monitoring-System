# Requirements

VS Code: https://code.visualstudio.com/download

Visual Studio Community 2022: https://visualstudio.microsoft.com/vs/     You also need Visual Studio 2022 for C++ to run this file. So, kindly install that. You can refer here to install Visual Studio 2022 for C++. Download "Desktop Development with C++", and select "MSVC" and "Windows 10 SDK", as optional features to install.

Node: https://nodejs.org/en/download/prebuilt-installer

Python 3.9: https://apps.microsoft.com/detail/9p7qfqmjrfp7?hl=en-US&gl=US

# Steps:
Clone the repository in VS Code terminal. git clone https://github.com/avi212003/-Online-Exam-Monitoring-System.git

Change the location to the repository. 

Goes to the main folder ```cd -Online-Exam-Monitoring-System```

Goes to the Admin folder ``` cd admin   ```   

Goes to the Frontend folder ```cd frontend  ```

Install all the node modules for the frontend folder of the admin ```npm install ```

Goes back to the admin folder ```cd.. ```

Goes in the backend folder of the admin side ``` cd backend ```

install all the dependency ``` npm install ```

goes back to the admin folder ```cd..```

goes back to the main folder ```cd..```

Goes to the user folder ```cd user```

Goes to the Frontend for the of the user ``` cd frontend ```

Install the dependency for the frontend of the user side ``` npm install ```

Goes back to the user folder ```cd.. ```

Goes into the backend folder ```cd backend```

Install the virtual Environment ``` pip install virtualenv```
Create the virtual environement names a Exam ```python -m venv Exam ```
Activate the Virtual Envirnoment ``` exam\Scripts\Activate.ps1```

Install cmake library ```pip install cmake```
Install all the depenedency required  ```pip install -r requirements.txt```


Open 4 terminal simultaneously

# for Admin side 

backend => ``` cd admin\backend```

For running the server ```npm run dev ```


frontend => ``` cd admin\frontend ```

For running the server ```npm run dev ```

# for user side 
frontend  ==> ``` cd user\frontend ```

For running the server ```npm run dev ```

Run the backend for user side ==> activate the virtual enivronemnt by above steps 

Run the backend server for the user ``` python -m flask run```










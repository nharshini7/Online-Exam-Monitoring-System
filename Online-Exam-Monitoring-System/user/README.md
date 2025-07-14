# Instructions to run the project

### Requirements
1. VS Code: https://code.visualstudio.com/download
2. Visual Studio Community 2022: https://visualstudio.microsoft.com/vs/
3. Node: https://nodejs.org/en/download/prebuilt-installer
4. Python 3.9: https://apps.microsoft.com/detail/9p7qfqmjrfp7?hl=en-US&gl=US

### Steps:
1. Clone the repository in VS Code terminal. ```git clone https://github.com/avi212003/-Online-Exam-Monitoring-System.git```
2. Change the location to the repository. ```cd -Online-Exam-Monitoring-System```
3. Go to frontend. ```cd frontend```
4. Install node modules. ```npm install```
5. Run the frontend server: ```npm run dev```
6. Open Visual Studio Community 2022 and select 'open a local folder' and navigate to the colned repository folder '-Online-Exam-Monitoring-System'.
7. Right click on 'backend' folder in '-Online-Exam-Monitoring-System' and select 'open in integrated terminal'.
8. Run the following commands in the opened terminal:
   1) ```pip install virtualenv```
   2) ```python -m venv ven```
   3) ```.\ven\Scripts\Activate.ps1```
   4) ```pip install cmake```
   5) ```pip install -r requirements.txt```
9. Right click on the 'backend' folder again and open it in integrated terminal.
10. Run the backend server. ```python app.py```

    **NOTE: You will get many errors about module not found. Install the module it is telling to install and run backend server again from step 10.
    Keep installing the modules until you get the backend server running.**
11. Go to frontend server: http://localhost:5173/

# touristic_tandem

Functionality

Login Page
1. login page creation
2. Success - redirect to dashboard
3. Error - 
    1. show errors 
    2. Clean fields

Logout Page :
1. redirect to login page
2. log out page 

base page :
1. added navbar
2. Welcomes Username and Logout functionality

viewprofile : 
1. removed extra map adding issue

Sign up page
1. Success - redirect to login
2. Email Authentication
3. Welcome Message
4. Error
    1. Show required errors
    2. show password doesnt match
    3. gender selection 1
    4. username already exists

404 Page :
1. Page Creation 
2. Show error message not found
3. Take you to home

issue : 
1. cant hold values
2. cant verify weather data is actually stored or not - Done
3. stop new tab for every event - Done
4. duplicate maps issue - Done


important :
Show Errors
DEBUG = False
ALLOWED_HOST = ["*"]
python manage.py runserver --insecure

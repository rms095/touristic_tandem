# touristic_tandem


Steps to run project : 
1. install python 3.4 or above
2. install virtualenv
3. Go to your project folder
4. cmd> virtualenv env3 -p python3
5. cmd> source venv/bin/activate
6. cmd> pip install -r requirements.txt
7. cmd> python manage.py makemigrations
8. cmd> python manage.py migrate
9. Go to settings.py
10. find for EMAIL_HOST_USER, EMAIL_HOST_PASSWORD
11. add your gmail id and password
12. cmd> python manage.py runserver --insecure



Functionality :
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
2. navbar is fixed from top
3. welcomes Username and Logout functionality along with name of app
4. show header appropriately

models :
1. Deleted existing Users. creates confusions
2. Used django.auth User for all operations
3. Added One to One Mapping between all models

viewprofile : 
1. removed extra map adding issue
2. navigate to edit profile
3. Added identify person
4. UI allignment
5. Show self profile and search partner profile on MultiValueDictKeyError
5. chat Option

editprofile : 
1. removed extra map adding issue
2. navigate to view profile
3. UI allignment
4. Show friends, languages details after integration
5. Change or Remove Profile

Sign up page
1. Success - redirect to login
2. Email Authentication
3. Welcome Message
4. Page and Design creation
5. Support added for language to learn and wanted 
6. added Language types
7. Added Bio
8. Error
    1. Show required errors
    2. show password doesnt match
    3. gender selection 1
    4. username already exists

404 Page :
1. Page Creation 
2. Show error message not found
3. Take you to home

Search Partner :
1. integrate viewprofile

issue : 
1. cant hold values - still there
2. cant verify weather data is actually stored or not - Done
3. stop new tab for every event - Done
4. duplicate maps issue - Done
5. view profile by username - should be userId 

important :
Show Errors
DEBUG = False
ALLOWED_HOST = ["*"]
python manage.py runserver --insecure

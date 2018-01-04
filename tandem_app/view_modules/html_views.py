import os
from django.shortcuts import render
from django.contrib.auth.models import User
from tandem_app.models import Profile, Language, Favourite
from django.contrib.auth.decorators import login_required

# Serve the index page
def index(request):
    return render(request, 'index.html')

@login_required
def home(request):
    context = {}
    user_profile = Profile.objects.filter(user=request.user)
    user_language = Languages.objects.filter(user=request.user)
    if user_profile:
        context['profile'] = user_profile.get()
    if user_language:
        context['language'] = user_language.get()
    return render(request, 'viewprofile.html', context=context)


# Serve the 'edit profile' page (data will be requested through AJAX)
def editprofile(request):
    print("Request : ")
    print(request)
    print(request.user.get_full_name)
    print(request.user.first_name)
    return render(request, "editprofile.html")


# Serve the 'view profile page', and provide with content
def view_profile(request):
    user_id = int(request.GET["userId"]) \
        if "userId" in request.GET \
        else User.objects.get(user_name=request.GET['username']).id

    profile = Profile.objects.get(user_id=user_id)
    user = User.objects.get(id=user_id)
    languages = Language.objects.filter(user_id=user_id)

    profile_image = os.path.join("userfiles", str(user_id) + ".png")
    if os.path.exists(os.path.join("staticfiles", profile_image)):
        image_path = profile_image
    else:
        image_path = os.path.join("userfiles", "default.png")

    context = {
        "self": user_id == 1,  # TODO replace by real id of current user
        "already_friends": Favourite.objects.filter(friend_id=user_id, friend_of=1).exists(),  # TODO
        "profile_image": image_path,
        "user_name": user.user_name,
        "first_name": profile.first_name,
        "last_name": profile.last_name,
        "city": profile.city,
        "bio": profile.bio,
        "spoken_languages": [l.language for l in languages if l.language_type == "spoken"],
        "wanted_languages": [l.language for l in languages if l.language_type == "wanted"]
    }

    return render(request, "viewprofile.html", context=context)


def result(request):
    john = Profile.objects.get(user_id=1)

    first_name = request.GET["first_name"]
    last_name = request.GET["last_name"]
    city = request.GET["city"]
    bio = request.GET["bio"]
    mode = request.GET["mode"]

    john.first_name = first_name
    john.last_name = last_name
    john.city = city
    john.bio = bio
    john.mode = mode

    john.save()

    return render(request, "result.html")

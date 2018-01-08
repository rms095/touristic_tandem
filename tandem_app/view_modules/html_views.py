import os
from django.shortcuts import render,render_to_response
from django.contrib.auth.models import User
from tandem_app.models import Profile, Language, Favourite
from django.contrib.auth.decorators import login_required
from django.template import RequestContext

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
    print(request.GET)
    return render(request, "editprofile.html")


# Serve the 'view profile page', and provide with content
def view_profile(request):
    print("request")
    print(request)
    print(request.user)

    current_user = request.user
    print(current_user)
    print("*********************"+str(current_user.id))

    user_id = current_user.id 
    '''\
        if "userId" in request.GET \
        else User.objects.get(current_user.id)'''

    profile = Profile.objects.get(user_id=user_id)
    user = User.objects.get(id=user_id)
    print(user)
    
    languages = Language.objects.filter(user_id=user_id)

    print(languages)
    profile_image = os.path.join("userfiles", str(user_id) + ".png")
    print(profile_image)

    if os.path.exists(os.path.join("staticfiles", profile_image)):
        image_path = profile_image
    else:
        image_path = os.path.join("userfiles", "default.png")

    context = {
        "user_id": user_id,
        "already_friends": Favourite.objects.filter(friend_id=user_id, friend_of=1).exists(),  # TODO
        "profile_image": image_path,
        "user_name": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "city": profile.city,
        "bio": profile.bio,
        "spoken_languages": [l.language for l in languages if l.language_type == "spoken"],
        "wanted_languages": [l.language for l in languages if l.language_type == "wanted"]
    }

    return render_to_response('viewprofile.html',context)


def result(request):
    print("inside result Def")

    john = Profile.objects.get(1)

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

import os
from django.http import HttpResponse, JsonResponse

from tandem_app import utils
from tandem_app.models import Profile, Language, Favourite
from django.contrib.auth.models import User


def change_profile(request):
    user = Profile.objects.get(user_id=request.POST["userId"])

    first_name = request.POST["f_name"]
    last_name = request.POST["l_name"]
    city = request.POST["city"]
    bio = request.POST["bio"]

    if "picture" in request.FILES:
        utils.handle_picture(request.FILES["picture"], request.POST["userId"])

    user.first_name = first_name
    user.last_name = last_name
    user.city = city
    user.bio = bio

    user.save()

    return JsonResponse({"success": True})


def info(request):
    print("####### request - inside Info Json view")
    print(request)
    print(request.GET["userId"])
    print(request.POST["userId"])
    user_id = int(request.POST["user_id"]) if "user_id" in request.POST else request.POST["user_id"]
    profile = Profile.objects.get(user_id=user_id)
    user = User.objects.get(id=user_id)
    languages = Language.objects.filter(user_id=user_id)

    return JsonResponse({
        "userId": user_id,
        "userName": user.username,
        "firstName": profile.first_name,
        "lastName": profile.last_name,
        "city": profile.city,
        "bio": profile.bio,
        "spoken_languages": [l.language for l in languages if l.language_type == "spoken"],
        "wanted_languages": [l.language for l in languages if l.language_type == "wanted"]
    })


def add_language(request):
    languages = Language.objects.filter(user_id=request.GET["userId"])

    # Refuse language that already exists
    if request.GET["language"] in [l.language for l in language]:
        success = False
    else:
        new_lang = Language()
        new_lang.language = request.GET["language"]
        new_lang.user_id = request.GET["userId"]
        new_lang.language_type = request.GET["type"]

        new_lang.save()

        success = True

    return JsonResponse({"success": success})


def known_languages(request):
    exclude = request.GET["exclude"].split("%")
    languages = utils.collect_counts([l.language for l in Language.objects.all()], exclude)
    return JsonResponse({"languages": utils.get_most_frequent(languages, 100)})


def known_cities(request):
    cities = utils.collect_counts([p.city for p in Profile.objects.all()], [])
    return JsonResponse({"cities": utils.get_most_frequent(cities, 100)})


def remove_language(request):
    language = Language.objects.filter(user_id=request.GET["userId"]).get(language=request.GET["language"])
    language.delete()

    return JsonResponse({"success": True})


def get_profile_picture(request):
    user_id = request.GET["userId"]
    profile_path = os.path.join("staticfiles", "userfiles", user_id + ".png")

    if request.GET["action"] == "remove":
        if os.path.exists(profile_path):
            os.remove(profile_path)

    elif request.GET["action"] == "show":

        if os.path.exists(profile_path):
            image_path = profile_path
        else:
            image_path = os.path.join("staticfiles", "userfiles", "default.png")

        with open(image_path, "rb") as f:
            image = f.read()

        return HttpResponse(content=image, content_type="image/png", status=200)

    return HttpResponse(content="")


def edit_favourite(request):
    user = User.objects.get(id=request.GET["userId"])  # TODO: replace by real current user ID
    friend_name = request.POST["friend_name"]
    friend_id = User.objects.get(username=friend_name).id
    action = request.POST["action"]

    print(action)

    if action == "add":
        favourite = Favourite(friend_of=user, friend_id=User.objects.get(id=friend_id))
        favourite.save()
        return JsonResponse({"success": True})

    elif action == "remove":
        favourite = Favourite.objects.get(friend_id=friend_id, friend_of=user)
        favourite.delete()
        return JsonResponse({"success": True})

    elif action == "check_status":
        exists = Favourite.objects.filter(friend_id=friend_id, friend_of=user).exists()
        return JsonResponse({"success": True, "already_favourite": exists})

    return None


def get_friends(_):
    user = User.objects.get(id=request.GET["userId"])  # TODO Replace by real user
    friends = Favourite.objects.filter(friend_of=user)

    return JsonResponse({
        "favourites": [f.friend_id.user_name for f in friends]
    })

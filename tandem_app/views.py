from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render, redirect, render_to_response
from django.contrib.auth import login, authenticate, logout

from .models import Profile, Language
from .view_modules import html_views, json_views
from .forms import SignUpForm

from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import EmailMessage
from django.template import RequestContext

from braces.views import LoginRequiredMixin
from django.views import generic
from django.contrib.auth import get_user_model

def partnerlist(request):
    return render(request, "partnerlist.html")

def searchPartner(request):
    john = Profile.objects.get(user_id=1)
    city_list = Profile.city
    template = loader.get_template('searchPartner.html')
    # context = dict(mode=john.mode)
    context = dict(mode=john.mode, city_list=city_list)
    return HttpResponse(template.render(context, request))

def signup(request):
    print("inside signup")
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            first_name=form.cleaned_data.get('first_name')
            last_name=form.cleaned_data.get('last_name')
            email=form.cleaned_data.get('email')
            home_city=form.cleaned_data.get('home_city')
            country=form.cleaned_data.get('country')
            language_To_Learn=form.cleaned_data.get('language_To_Learn')
            language_to_speak=form.cleaned_data.get('language_to_speak')
            gender=form.cleaned_data.get('gender')
            bio=form.cleaned_data.get('bio')
            raw_password = form.cleaned_data.get('password1')


            user = authenticate(username=username, password=raw_password)
            user_profile = Profile.objects.create(
                user=user, bio=bio, mode='Mode', country=country,
                city=home_city, gender=gender
            )
            user_profile.save()
            user_language = Language.objects.create(
                user=user, language=language_To_Learn, language_type='wanted'
            )
            user_language.save()

            user_language = Language.objects.create(
                user=user, language=language_to_speak, language_type='spoken'
            )
            user_language.save()

            current_site = get_current_site(request)

            mail_subject = 'Warm welcome'
            message = render_to_string('act_active_email.html', {
                'user': user,
                'domain': current_site.domain,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            })
            to_email = form.cleaned_data.get('email')
            email = EmailMessage(
                        mail_subject, message, to=[to_email]
            )
            email.send()

            return redirect('logout')
        else:
            print("errors")
            print(form.errors)
    else:
        form = SignUpForm()

    return render(request, 'signup.html', {'form': form}) 

def handler404(request):
    response = render_to_response('404.html', {},
                                  context_instance=RequestContext(request))
    response.status_code = 404
    return response  

class UserListView(LoginRequiredMixin, generic.ListView):
    model = get_user_model()
    # These next two lines tell the view to index lookups by username
    slug_field = 'username'
    slug_url_kwarg = 'username'
    template_name = 'touristic_tandem/users.html'
    login_url = 'admin/'''


# Render pages
index = html_views.index
editprofile = html_views.editprofile
view_profile = html_views.view_profile
result = html_views.result

# Serve or receive data (through JSON)
info = json_views.info
add_language = json_views.add_language
change_profile = json_views.change_profile
remove_language = json_views.remove_language
known_languages = json_views.known_languages
known_cities = json_views.known_cities
get_profile_picture = json_views.get_profile_picture
edit_favourite = json_views.edit_favourite
get_friends = json_views.get_friends

InfoPartner=json_views.InfoPartner

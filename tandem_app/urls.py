from django.conf.urls import url
from django.contrib.auth import views as auth_views
from django.conf.urls import handler404

from . import views

urlpatterns = [
    url(r'^index', views.index, name='home'),
    url(r'^searchPartner', views.searchPartner),
    url(r'^partnerlist', views.partnerlist),
    url(r"viewprofile", views.view_profile, name='viewprofile'),
    url(r"editprofile", views.editprofile, name='editprofile'),
    url(r"info", views.info),
    url(r"add_language", views.add_language),
    url(r"result", views.change_profile),
    url(r"remove_language", views.remove_language),
    url(r"known_languages", views.known_languages),
    url(r"known_cities", views.known_cities),
    url(r"profile_picture", views.get_profile_picture),
    url(r"edit_favourite", views.edit_favourite),
    url(r"get_friends", views.get_friends),
    url(r'^login/$', auth_views.login, {'template_name': 'login.html'}, name='login'),
    url(r'^logout/$', auth_views.logout, {'template_name': 'logout.html'}, name='logout'),
    url(r'^signup/$', views.signup, name='signup'),
    url(r"InfoPartner", views.InfoPartner),
    url(r'^friends', views.UserListView.as_view(), name='user_list'),
]


handler404 = views.handler404
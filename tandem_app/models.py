from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models


class Language(models.Model):
    user = models.ForeignKey(User)
    language = models.CharField(max_length=50)
    language_type = models.CharField(max_length=6)


class Profile(models.Model):
    user = models.ForeignKey(User, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    bio = models.TextField()
    mode = models.CharField(max_length=50)

class Favourite(models.Model):
    friend_of = models.ForeignKey(User, related_name="friend_of")
    friend_id = models.ForeignKey(User, related_name="friend_id")

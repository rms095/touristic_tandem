from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

CHOICES=[('Male','Male'),('Female','Female'), ('other','other')]

class SignUpForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=True, help_text='* Required')
    last_name = forms.CharField(max_length=30, required=True, help_text='* Required')
    gender = forms.ChoiceField(choices=CHOICES, widget=forms.Select(attrs={'class': 'selector'}))
    email = forms.EmailField(max_length=254, required=True, help_text='* Required. Inform a valid email address.')
    home_city = forms.CharField(max_length=30, required=True, help_text='* Required')
    country = forms.CharField(max_length=30, required=True, help_text='* Required')
    language_To_Learn = forms.CharField(max_length=30, required=True, help_text='* Required')
    language_to_speak = forms.CharField(max_length=30, required=True, help_text='* Required')
    bio = forms.CharField(widget=forms.Textarea(attrs={'rows': 5, 'cols': 100}))
    

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email','home_city', 'country', 'language_To_Learn','language_to_speak', 'gender', 'password1', 'password2', 'bio', )

# -*- coding: utf-8 -*-
# Generated by Django 1.10.5 on 2018-01-04 10:58
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tandem_app', '0003_auto_20180102_1901'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='country',
            field=models.CharField(default='India', max_length=50),
        ),
    ]
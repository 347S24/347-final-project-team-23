# Generated by Django 4.2.11 on 2024-04-18 16:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0006_user_access_token_user_refresh_token"),
    ]

    operations = [
        migrations.AddField(
            model_name="playlist",
            name="contents",
            field=models.CharField(blank=True, max_length=20000, null=True),
        ),
        migrations.AddField(
            model_name="playlist",
            name="timestamp",
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
# Generated by Django 4.2.11 on 2024-04-24 08:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0009_playlist_spotify_id_playlist_timestamp_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="username",
            field=models.CharField(max_length=200, unique=True),
        ),
    ]
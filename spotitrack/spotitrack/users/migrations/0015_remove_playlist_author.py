# Generated by Django 4.2.11 on 2024-04-25 16:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0014_remove_playlist_spotify_id_remove_playlist_timestamp'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='playlist',
            name='author',
        ),
    ]

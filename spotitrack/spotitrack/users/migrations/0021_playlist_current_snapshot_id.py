# Generated by Django 4.2.11 on 2024-05-02 15:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0020_rename_tracks_playlist_number_of_tracks_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="playlist",
            name="current_snapshot_id",
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
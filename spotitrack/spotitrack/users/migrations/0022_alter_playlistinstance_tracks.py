# Generated by Django 4.2.11 on 2024-05-05 00:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0021_playlist_current_snapshot_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="playlistinstance",
            name="tracks",
            field=models.JSONField(blank=True, null=True),
        ),
    ]
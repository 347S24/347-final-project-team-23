# Generated by Django 4.2.11 on 2024-05-06 23:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0024_playlistinstance_date_added"),
    ]

    operations = [
        migrations.AlterField(
            model_name="playlist",
            name="current_snapshot_id",
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name="playlist",
            name="image",
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name="playlist",
            name="playlist_id",
            field=models.CharField(max_length=500, primary_key=True, serialize=False),
        ),
    ]

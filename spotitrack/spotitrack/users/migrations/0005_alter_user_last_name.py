# Generated by Django 4.2.11 on 2024-04-14 18:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0004_alter_user_last_name_alter_user_password_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="last_name",
            field=models.CharField(blank=True, null=True),
        ),
    ]

from django.contrib.auth.models import AbstractUser
from django.db.models import CharField
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.db import models


class User(AbstractUser):
    """
    Default custom user model for Ultimate TicTacToe.
    If adding fields that need to be filled at user signup,
    check forms.SignupForm and forms.SocialSignupForms accordingly.
    """

    # First and last name do not cover name patterns around the globe
    username = CharField(max_length=200)
    first_name = CharField(blank=True,null=True)  # type: ignore[assignment]
    last_name = CharField(blank=True,null=True)  # type: ignore[assignment]
    name = CharField(_("Name of User"), blank=True, max_length=255)
    password = CharField(max_length=200)
    access_token = CharField(max_length=500, blank=True, null=True)
    refresh_token = CharField(max_length=500, blank=True, null=True)

    def get_absolute_url(self) -> str:
        """Get URL for user's detail view.

        Returns:
            str: URL for user detail.

        """
        return reverse("users:detail", kwargs={"username": self.username})

class Playlist(models.Model):
    name = CharField(max_length=200)
    owner = models.ForeignKey('User', on_delete=models.RESTRICT, null=True)
    #timestamp = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    id = CharField(max_length=200, primary_key=True)
    #tracks = CharField(max_length=20000, blank=True, null=True)

    def get_absolute_url(self) -> str:
        """Get URL for playlist's detail view.

        Returns:
            str: URL for playlist detail.

        """
        return reverse("playlist:detail", kwargs={"name": self.name})

    # spotify identifier spotifyuri # e.g. spotify:playlist:sdfbjhsgkeawjesgrd

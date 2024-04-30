from ast import In
from django.contrib.auth.models import AbstractUser
from django.db.models import CharField
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.db import models
from traitlets import default
from django.db.models import IntegerField


class User(AbstractUser):
    """
    Default custom user model for Ultimate TicTacToe.
    If adding fields that need to be filled at user signup,
    check forms.SignupForm and forms.SocialSignupForms accordingly.
    """

    # First and last name do not cover name patterns around the globe
    username = CharField(max_length=200, unique=True)
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


    def set_access_token(self, access_token):
        self.access_token = access_token
        self.save()

    def set_refresh_token(self, refresh_token):
        self.refresh_token = refresh_token
        self.save()

    def get_access_token(self):
        return self.access_token
    
    def get_refresh_token(self):
        return self.refresh_token


class Playlist(models.Model):
    name = CharField(max_length=200)
    playlist_id = CharField(max_length=200, primary_key=True)
    owner = models.ForeignKey('User', on_delete=models.RESTRICT, null=True)
    author = CharField(max_length=200, blank=True, null=True)
    tracks = IntegerField(blank=True, null=True, default=0)
    image = CharField(max_length=200, blank=True, null=True)
    snapshot_id = CharField(max_length=200, blank=True, null=True)

    def get_absolute_url(self) -> str:
        """Get URL for user's detail view.

        Returns:
            str: URL for user detail.

        """
        return reverse("playlist:detail", kwargs={"name": self.name})
    
    def get_playlist_id(self):
        return self.playlist_id



    # spotify identifier spotifyuri # e.g. spotify:playlist:sdfbjhsgkeawjesgrd

from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.generic import DetailView
from django.views.generic import RedirectView
from django.views.generic import UpdateView

from spotitrack.users.models import User, Playlist, PlaylistInstance


class UserDetailView(LoginRequiredMixin, DetailView):
    model = User
    slug_field = "username"
    slug_url_kwarg = "username"


user_detail_view = UserDetailView.as_view()


class UserUpdateView(LoginRequiredMixin, SuccessMessageMixin, UpdateView):
    model = User
    fields = ["name"]
    success_message = _("Information successfully updated")

    def get_success_url(self):
        # for mypy to know that the user is authenticated
        assert self.request.user.is_authenticated
        return self.request.user.get_absolute_url()

    def get_object(self):
        return self.request.user


user_update_view = UserUpdateView.as_view()


class UserRedirectView(LoginRequiredMixin, RedirectView):
    permanent = False

    def get_redirect_url(self):
        return reverse("users:detail", kwargs={"username": self.request.user.username})


user_redirect_view = UserRedirectView.as_view()

class PlaylistDetailView(LoginRequiredMixin, DetailView):
    model = Playlist
    slug_field = "name"
    slug_url_kwarg = "name"


playlist_detail_view = PlaylistDetailView.as_view()


class PlaylistUpdateView(LoginRequiredMixin, SuccessMessageMixin, UpdateView):
    model = Playlist
    fields = ["name"]
    success_message = _("Information successfully updated")

    def get_success_url(self):
        # for mypy to know that the user is authenticated
        assert self.request.playlist.is_authenticated
        return self.request.playlist.get_absolute_url()

    def get_object(self):
        return self.request.playlist


playlist_update_view = PlaylistUpdateView.as_view()


class PlaylistRedirectView(LoginRequiredMixin, RedirectView):
    permanent = False

    def get_redirect_url(self):
        return reverse("playlist:detail", kwargs={"name": self.request.playlist.name})


playlist_redirect_view = PlaylistRedirectView.as_view()


class PlaylistInstanceView(LoginRequiredMixin, DetailView):
    model = PlaylistInstance
    slug_field = "playlist"
    slug_url_kwarg = "playlist"

playlist_detail_view = PlaylistInstanceView.as_view()

class PlaylistInstanceUpdateView(LoginRequiredMixin, SuccessMessageMixin, UpdateView):
    model = PlaylistInstance
    fields = ["playlist"]
    success_message = _("Playlist Instance: SUCCESS")

    def get_success_url(self):
        assert self.request.playlistinstance.is_authenticated
        return self.request.playlistinstance.get_absolute_url()
    
    def get_object(self):
        return self.request.playlistinstance

playlist_instnace_update_view = PlaylistUpdateView.as_view()

class PlaylistInstanceRedirectView(LoginRequiredMixin, RedirectView):
    permanent = False

    def get_redirect_url(self):
        return reverse("playlistinstance:detail", kwargs={"playlist": self.request.playlistinstance.playlist})
    
playlistinstance_rediriect_view = PlaylistInstanceRedirectView.as_view()

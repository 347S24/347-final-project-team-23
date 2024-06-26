from http.client import HTTPException
import json
from django.shortcuts import get_object_or_404, redirect
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import requests
from ninja import NinjaAPI, Router, Schema
import base64
from .models import User, Playlist, PlaylistInstance
from typing import List
from django.http import JsonResponse
from config.settings import base
from functools import wraps
from django.http import JsonResponse
from django.contrib.auth import logout, login, authenticate
import json
from typing import List


### CLIENT AND SECRET KEYS ARE NOW STORED IN THE .env FILE ###
client_id = base.SPOTIFY_CLIENT_ID
client_secret = base.SPOTIFY_CLIENT_SECRET


### API ###
api = NinjaAPI()
router = Router()


#########################################################################
#
#
#                           DECORATORS
#
#########################################################################


# DECORATOR FOR API CALLS THAT REQUIRE AUTHENTICATION (THAT A USER EXISTS) ###
def require_authentication(f):
    @wraps(f)
    def decorated_function(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({"isAuthenticated": False}, status=200)
        return f(request, *args, **kwargs)

    return decorated_function


#########################################################################
#
#
#                           USER API
#
#########################################################################
class UserIn(Schema):
    username: str
    first_name: str = ""
    last_name: str = ""
    password: str = ""
    email: str = ""


class LoginSchema(Schema):
    username: str
    password: str


@api.post("/create_user")
def create_user(request, payload: UserIn):
    user = User(
        username=payload.username,
        email=payload.email,
        first_name=payload.first_name,
        last_name=payload.last_name,
    )
    user.set_password(
        payload.password
    )  # This hashes the password and stores it securely
    user.save()
    return {"users name": user.username}


@api.post("/update_spotify_id")
def update_spotify_id(request, payload: UserIn):
    user = get_object_or_404(User, username=payload.username)
    user.set_spotify_id(payload.spotify_id)
    return {"spotify_id": user.spotify_id}


@api.get("/users")
def get_users(request, username: str):
    users = User.objects.all()
    return users


@api.post("/login")
def login_user(request, data: LoginSchema):
    print(
        f"Attempting to log in with username: {data.username} and password: {data.password}"
    )
    user = authenticate(request, username=data.username, password=data.password)
    if user is not None:
        login(request, user)
        print(f"Login successful for user: {user.username}")
        return {
            "user": {
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "access_token": user.access_token,
                "refresh_token": user.refresh_token,
                # Include any other user details here
            }
        }
    else:
        print("Login failed. Invalid credentials provided.")
        return JsonResponse({"error": "Invalid credentials"}, status=401)


@api.get("/logout")
@require_authentication
def logout_user(request):
    logout(request)
    return JsonResponse({"message": "Logged out"}, content_type="application/json")


#########################################################################
#
#
#                           SPOTIFY API
#
#########################################################################


@api.get("/about")
def get_artist_info(request, artist_name):
    # Replace these with your own client ID and client secret

    client_id = "e4991986fa1e43369b4a732ebc1aea45"
    client_secret = "a6bb2acb683b4e7b9894edd80fc4ac60"
    # Authenticate with Spotify API
    client_credentials_manager = SpotifyClientCredentials(
        client_id=client_id, client_secret=client_secret
    )
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    # Search for the artist
    results = sp.search(q="artist:" + artist_name, type="artist")
    items = results["artists"]["items"]

    if len(items) > 0:
        artist = items[0]
        return {
            "name": artist["name"],
            "popularity": artist["popularity"],
            "followers": artist["followers"]["total"],
            "genres": artist["genres"],
        }
    else:
        return None


@api.get("/playlist")
def get_user_playlists(request):

    user = request.user
    access_token = user.access_token

    headers = {"Authorization": "Bearer " + access_token}
    response = requests.get("https://api.spotify.com/v1/me/playlists", headers=headers)

    if response.status_code == 200:
        playlist_data = response.json()
        # Loop over the json and get out the specific items we need for the playlist model
        playlist_info = []
        for playlist in playlist_data["items"]:
            image_url = (
                playlist["images"][0]["url"]
                if playlist["images"]
                else "https://via.placeholder.com/150"
            )
            author = playlist["owner"]["display_name"]
            playlist_id = playlist["id"]
            playlist_name = playlist["name"]
            tracks = playlist["tracks"]["total"]
            snapshot_id = playlist["snapshot_id"].replace("/", "-")

            playlist_info.append(
                {
                    "author": author,
                    "playlist_id": playlist_id,
                    "playlist_name": playlist_name,
                    "number_of_tracks": tracks,
                    "owner": user.username,
                    "image": image_url,
                    "snapshot_id": snapshot_id,
                }
            )

            # UPDATING IF THERE IS A PLAYLISY
            try:
                db_playlist = get_object_or_404(Playlist, playlist_id=playlist_id)
                if db_playlist.current_snapshot_id != snapshot_id:
                    playlist_instance = PlaylistInstance(
                        playlist=db_playlist,
                        snapshot_id=snapshot_id,
                        # WORK IN PROGRESS
                        tracks=get_playlist_tracks(request.user, playlist_id),
                    )
                    playlist_instance.save()
                    db_playlist.current_snapshot_id = snapshot_id
                    db_playlist.save()
            # IF NO PLAYLIST CREATE A PLAYLIST AND ITS INSTANCE
            except:
                owner, _ = User.objects.get_or_create(username=user.username)
                playlist = Playlist(
                    owner=owner,
                    playlist_id=playlist_id,
                    name=playlist_name,
                    number_of_tracks=tracks,
                    author=author,
                    image=image_url,
                    current_snapshot_id=snapshot_id,
                )
                playlist.save()

                playlist_instance = PlaylistInstance(
                    playlist=playlist,
                    snapshot_id=snapshot_id,
                    # WORK IN PROGRESS
                    tracks=get_playlist_tracks(request.user, playlist_id),
                )
                playlist_instance.save()

        return playlist_info
    else:

        return response.status_code, {"error": "Failed to fetch user playlists"}


@api.get("/tracks/")
def get_playlist_tracks(request, playlist_id: str):
    client_credentials_manager = SpotifyClientCredentials(
        client_id=client_id, client_secret=client_secret
    )
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
    results = sp.playlist_tracks(playlist_id)

    tracks_info = []
    for item in results["items"]:
        track = item.get("track")
        if track:  # Check if track is not None
            minutes = track["duration_ms"] // 60000
            seconds = (track["duration_ms"] % 60000) // 1000
            duration_formatted = f"{minutes}:{seconds:02}"

            track_info = {
                "name": track["name"],
                "id": track["id"],
                "artists": [artist["name"] for artist in track["artists"]],
                "album": track["album"]["name"],
                "album_art_url": (
                    track["album"]["images"][0]["url"]
                    if track["album"]["images"]
                    else None
                ),
                "preview_url": track.get("preview_url"),
                "duration": duration_formatted,
            }
            tracks_info.append(track_info)

    return tracks_info


from ninja import ModelSchema
from typing import List


# Schema for printing out playlist instances for the playlistInstance API endpoint
class PlaylistInstanceSchema(ModelSchema):
    class Meta:
        model = PlaylistInstance
        fields = "__all__"


@api.get("/playlistInstances/", response=List[PlaylistInstanceSchema])
def get_playlist_instances(request, playlist_id: str):
    db_playlist = get_object_or_404(Playlist, playlist_id=playlist_id)
    playlist_instances = []
    for pi in PlaylistInstance.objects.all():
        if pi.playlist_id == db_playlist.playlist_id:
            playlist_instances.append(pi)
        print("here")
        print(playlist_instances)
    return playlist_instances


@api.post("/playlists/{playlist_id}/add-track")
def add_track_to_playlist(request, playlist_id):
    """
    Add tracks to a user's Spotify playlist.
    """
    user = request.user
    track_uris = request.data.get("uris", [])

    if not track_uris:
        return {"error": "No track URIs provided"}

    spotify_api_url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    headers = {
        "Authorization": f"Bearer {user.access_token}",
        "Content-Type": "application/json",
    }
    data = {"uris": track_uris.split(",")}

    response = requests.post(spotify_api_url, headers=headers, json=data)

    if response.status_code == 201:
        return {
            "message": "Tracks added successfully",
            "snapshot_id": response.json().get("snapshot_id"),
        }
    else:
        return {
            "error": "Failed to add tracks to the playlist",
            "details": response.json(),
        }


@api.get("/playlists/{playlist_id}/history")
def get_playlist_history(request, playlist_id: str):
    playlist = get_object_or_404(Playlist, playlist_id=playlist_id)
    instances = PlaylistInstance.objects.filter(playlist=playlist).order_by(
        "date_added"
    )
    history = []
    previous_instance = None

    for instance in instances:
        if previous_instance:
            changes = previous_instance.compare_to(instance)
            history.append(
                {
                    "instance_id": instance.id,
                    "snapshot_id": instance.snapshot_id,
                    "date_added": instance.date_added.strftime("%Y-%m-%d %H:%M:%S"),
                    "changes": changes,
                    "tracks": [
                        track["id"] for track in instance.tracks
                    ],  # Optionally list track IDs only
                }
            )
        previous_instance = instance

    return {"playlist_name": playlist.name, "history": history}


@api.get("/playlistInstance/{snapshot_id}/")
def get_playlist_instance(request, snapshot_id: str):
    instance = get_object_or_404(PlaylistInstance, snapshot_id=snapshot_id)
    return {
        "snapshot_id": instance.snapshot_id,
        "tracks": instance.tracks,
        "date_added": instance.date_added.strftime("%Y-%m-%d %H:%M:%S"),
    }


#########################################################################
#
#
#                           OAUTH API
#
#########################################################################


# THIS REQUESTS AN AUTHORAZATION TOKEN TO TURN INTO AN ACCESS TOKEN
@api.get("/authorization")
@require_authentication
def request_user_authorization(request):
    """
    Requests authorization from thze user to access Spotify resources.

    Parameters:
    - client_id (str): The Client ID generated after registering your application.
    - redirect_uri (str): The URI to redirect to after the user grants or denies permission.
    - state (str, optional): A random string used for protection against attacks.
    - scope (str, optional): A space-separated list of scopes.

    Returns:
    - str: The authorization URL to redirect the user to.
    """
    redirect_uri = "http://spotitrack.tech/users/api/callback/"
    scope = """
    user-read-private
    user-read-email
    playlist-read-private
    playlist-read-collaborative
    user-read-recently-played
    user-top-read
    user-library-modify
    user-library-read
    user-follow-modify
    playlist-modify-public
    playlist-modify-private
    """
    scope = scope.replace("\n", "")

    # Construct query parameters
    params = {
        "response_type": "code",
        "client_id": client_id,
        "scope": scope,
        "redirect_uri": redirect_uri,
    }
    # if state:
    #     params['state'] = state

    # Construct authorization URL
    authorization_url = "https://accounts.spotify.com/authorize?" + "&".join(
        [f"{key}={value}" for key, value in params.items()]
    )

    return authorization_url


# THIS IS THE CALLBACK FUNCTION TO TURN A AUTH CODE INTO AN ACCESS TOKEN
@api.get("/callback/")
def handle_callback(request, code: str):
    """
    Handles the callback after the user authorizes the app and returns the authorization code.

    Parameters:
    - code (str): The authorization code returned from the Spotify authorization request.
    - state (str): The value of the state parameter supplied in the request.

    Returns:
    - dict: JSON response containing access token information.
    """
    redirect_uri = "https://spotitrack.tech/users/api/callback/"  # Make sure this matches the redirect URI used in authorization request

    # Exchange authorization code for access token
    token_url = "https://accounts.spotify.com/api/token"
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": redirect_uri,
    }
    headers = {
        "Authorization": f'Basic {base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()}',
        "Content-Type": "application/x-www-form-urlencoded",
    }
    response = requests.post(token_url, data=payload, headers=headers)

    # Parse response and return access token information
    if response.status_code == 200:

        print("THE USER", request.user)
        token_data = response.json()
        request.user.set_access_token(token_data["access_token"])
        request.user.set_refresh_token(token_data["refresh_token"])
        request.user.save()
        return redirect("https://spotitrack.tech/complete_signup")
        return token_data
    else:
        return {
            "error": "Failed to exchange authorization code for access token."
        }, response.status_code


# THIS API CALL REFRESHES THE ACCESS TOKEN
@api.get("/refresh")
def refresh_token(request):
    refresh_token = request.user.refresh_token

    # Construct request payload
    auth_payload = {"grant_type": "refresh_token", "refresh_token": refresh_token}

    # Construct headers with basic authentication
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic "
        + base64.b64encode((client_id + ":" + client_secret).encode()).decode(),
    }

    # Make POST request to Spotify API
    response = requests.post(
        "https://accounts.spotify.com/api/token", data=auth_payload, headers=headers
    )

    # Check if request was successful
    if response.status_code == 200:
        token_data = response.json()
        access_token = token_data["access_token"]
        refreshed_refresh_token = token_data.get("refresh_token", refresh_token)
        request.user.set_access_token(access_token)
        request.user.set_refresh_token(refreshed_refresh_token)
        return {"access_token": access_token, "refresh_token": refreshed_refresh_token}
    else:
        return {"error": "Failed to refresh access token"}

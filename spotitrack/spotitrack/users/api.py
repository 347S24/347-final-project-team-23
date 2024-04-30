from http.client import HTTPException
from django.shortcuts import get_object_or_404
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import requests
from ninja import NinjaAPI
import requests
import base64
from .models import User, Playlist
from ninja import Schema, Query
from typing import List
from django.http import JsonResponse
from config.settings import base
from functools import wraps
from django.http import JsonResponse
from django.contrib.auth import logout
from django.contrib.auth import login
from django.contrib.auth import authenticate
from spotitrack.users.models import Playlist
from ninja import Router
from django.shortcuts import redirect

from .models import User
from ninja import Schema
from typing import List




### CLIENT AND SECRET KEYS ARE NOW STORED IN THE .env FILE ###
client_id = base.SPOTIFY_CLIENT_ID
client_secret = base.SPOTIFY_CLIENT_SECRET
# client_id = "e4991986fa1e43369b4a732ebc1aea45"
# client_secret = "a6bb2acb683b4e7b9894edd80fc4ac60"


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
            return JsonResponse({'isAuthenticated': False}, status=200)
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
    first_name: str = ''
    last_name: str = ''
    password: str = ''
    email: str = ''

class LoginSchema(Schema):
    username: str
    password: str


# @api.post("/user")
# def create_user(request, payload: UserIn):
#     print(payload.username)
#     print(payload.first_name)
#     print(payload.last_name)
#     print(payload.password)
#     print(payload.email)
#     user = User.objects.create(**payload.dict())
#     return {"users name": user.name}


@api.post("/create_user")
def create_user(request, payload: UserIn):
    user = User(username=payload.username, email=payload.email, first_name=payload.first_name, last_name=payload.last_name)
    user.set_password(payload.password)  # This hashes the password and stores it securely
    user.save()
    return {"users name": user.username}


@api.post("/login")
def login_user(request, data: LoginSchema):
    print(f"Attempting to log in with username: {data.username} and password: {data.password}")
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



@api.get("/logout/")
@require_authentication
def logout_user(request):
    logout(request)
    return JsonResponse({"message": "Logged out"})



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


    print("\n")
    print("USER: ", user.username)
    print("\n")

    print("\n")
    print("USER ACCESS TOKEN: ", access_token)
    print("\n")

    headers = {
            "Authorization": 'Bearer ' + access_token
        }
    response = requests.get('https://api.spotify.com/v1/me/playlists', headers=headers)
    print("\n\n\nresponse.status_code")
    print(response.status_code)
    if response.status_code == 200:
        playlist_data = response.json()
        # Loop over the json and get out the specific items we need for the playlist model
        playlist_info = []
        for playlist in playlist_data['items']:
            author = playlist['owner']['display_name']
            playlist_id = playlist['id']
            playlist_name = playlist['name']
            tracks = playlist['tracks']['total']
            #image = playlist['images'][0]['url']
            snapshot_id = playlist['snapshot_id']

            #image_url = playlist_data.get('images', [{'url': None}])[0]['url']


            playlist_info.append({
                'author': author,
                'playlist_id': playlist_id,
                'playlist_name': playlist_name,
                'tracks': tracks,
                'owner': user.username,
                #'image': image,
                'snapshot_id': snapshot_id
            })

            #SHOULD ONLY DO THIS IF THE USER'S SOMETHING IS UNIQUE
        # loop over the list items from the last for loop and add them to the playlist model
            owner, _ = User.objects.get_or_create(username=user.username)
            playlist_instance = Playlist(
                owner = owner,
                playlist_id=playlist_id,
                name = playlist_name,
                tracks = tracks,
                author = author,
                #image = image,
                snapshot_id = snapshot_id
            )
            playlist_instance.save()

        return playlist_info
    else:
        print(response.text)
        # request.user.access_token = None
        # request.user.save()
        # request_user_authorization(request)
        return response.status_code, {"error": "Failed to fetch user playlists"}



@api.get("/tracks/")
def get_playlist_tracks(request, playlist_id: str):

    # Retrieve the playlist from the database using the provided playlist_id



    # Replace these with your own client ID and client secret
    client_id = "e4991986fa1e43369b4a732ebc1aea45"
    client_secret = "a6bb2acb683b4e7b9894edd80fc4ac60"
    # Authenticate with Spotify API
    client_credentials_manager = SpotifyClientCredentials(
        client_id=client_id, client_secret=client_secret
    )
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    # Get tracks from the playlist
    results = sp.playlist_tracks(playlist_id)

    # Extract relevant information from tracks
    tracks_info = []
    for item in results["items"]:
        track = item["track"]
        tracks_info.append(
            {
                "name": track["name"],
                "id": track["id"],
                "artists": [artist["name"] for artist in track["artists"]],
                "album": track["album"]["name"],
                "preview_url": track["preview_url"] if "preview_url" in track else None,
            }
        )

    return tracks_info


#########################################################################
#
#
#                        INTERNAL PLAYLIST API
#
#########################################################################






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
    # client_id = "e4991986fa1e43369b4a732ebc1aea45"
    redirect_uri = "http://127.0.0.1:8000/users/api/callback/"
    scope = "user-read-private user-read-email playlist-read-private playlist-read-collaborative"

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
    redirect_uri = "http://127.0.0.1:8000/users/api/callback/"  # Make sure this matches the redirect URI used in authorization request

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

        print('THE USER', request.user)
        token_data = response.json()
        request.user.set_access_token(token_data['access_token'])
        # User.set_access_token(request.user, token_data['access_token'])
        request.user.set_refresh_token(token_data['refresh_token'])
        # User.set_refresh_token(request.user, token_data['refresh_token'])
        request.user.save()
        return redirect("http://127.0.0.1:8000/complete_signup")
        return token_data
    else:
        return {
            "error": "Failed to exchange authorization code for access token."
        }, response.status_code



# THIS API CALL REFRESHES THE ACCESS TOKEN
@api.get("/refresh/")
def refresh_token(request):
    refresh_token = request.user.refresh_token

    # Construct request payload
    auth_payload = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }

    # Construct headers with basic authentication
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + base64.b64encode((client_id + ':' + client_secret).encode()).decode()
    }

    # Make POST request to Spotify API
    response = requests.post('https://accounts.spotify.com/api/token', data=auth_payload, headers=headers)

    # Check if request was successful
    if response.status_code == 200:
        token_data = response.json()
        access_token = token_data['access_token']
        refreshed_refresh_token = token_data.get('refresh_token', refresh_token)
        return {
            'access_token': access_token,
            'refresh_token': refreshed_refresh_token
        }
    else:
        return {
            'error': 'Failed to refresh access token'
        }


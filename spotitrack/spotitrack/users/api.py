from http.client import HTTPException
from django.shortcuts import get_object_or_404
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import requests
from ninja import NinjaAPI
import requests
import base64
from .models import User, Playlist
from ninja import Schema
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
from .models import User
from ninja import Schema
from typing import List

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


@api.get("/user/{username}-{password}", response=UserIn)
def get_user(request, username: str, password: str):
    user = get_object_or_404(User, username=username, password=password)
    return user

from ninja import Schema, ModelSchema
from typing import List
from .models import Playlist  # Import the Playlist model

class PlaylistIn(Schema):
    id: str
    name: str
    owner: str
    tracks: int

class PlaylistPayload(Schema):
    playlists: List[PlaylistIn]


# @api.post("/create_user")
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


@api.post("/login/")
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
                # Include any other user details here
            }
        }
    else:
        print("Login failed. Invalid credentials provided.")
        return JsonResponse({"error": "Invalid credentials"}, status=401)


# @api.get("/get_auth_token/{username}", response=UserIn)
# @require_authentication
# def get_auth_token(request, username: str):
#     request.user.get_access_token(request.user)


# @api.get("/get_refresh_token/{username}", response=UserIn)
# @require_authentication
# def get_user(request, username: str):
#     return request.user.get_refresh_token(request.user)



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


@api.get("/playlist/{username}")
@require_authentication
def get_user_playlists(request, username: str):

    # Authenticate with Spotify API
    client_credentials_manager = SpotifyClientCredentials(
        client_id=client_id, client_secret=client_secret
    )
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
    try:
        playlists = sp.user_playlists(username, limit=50)
        playlist_info = [
            {
                "name": playlist["name"],
                "id": playlist["id"],
                "owner": playlist["owner"]["display_name"],
                "tracks": playlist["tracks"]["total"],
            }
            for playlist in playlists["items"]
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return playlist_info



@api.get("/tracks/{username}/{playlist_id}")
def get_playlist_tracks(request, username: str, playlist_id: str):
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

from ninja import Schema, ModelSchema
from typing import List
from .models import Playlist  # Import the Playlist model

class PlaylistIn(Schema):
    id: str
    name: str
    owner: str
    tracks: int

class PlaylistPayload(Schema):
    playlists: List[PlaylistIn]

@api.post("/user/{username}/load_playlists")
def load_playlists(request, username: str, payload: PlaylistPayload):
    user = get_object_or_404(User, username=username)
    for pl_data in payload.playlists:
        Playlist.objects.update_or_create(
            spotify_id=pl_data.id,
            defaults={
                'name': pl_data.name,
                'owner': user,
                'tracks': pl_data.tracks
            }
        )
    return {"status": "Playlists loaded successfully"}


### EXPERIMENTAL INTERNAL API FOR PLAYLIST MANAGEMENT ###

@api.post("/user/{username}/load_playlists")
def load_playlists(request, username: str, payload: PlaylistPayload):
    user = get_object_or_404(User, username=username)
    for pl_data in payload.playlists:
        Playlist.objects.update_or_create(
            id=pl_data.id,
            defaults={
                'name': pl_data.name,
                'id': pl_data.id,
                'owner': user.username,
                'author': pl_data.owner, # assuming owner is a CharField with the username
                'tracks': pl_data.tracks
            }
        )
    return {"status": "Playlists loaded successfully"}




#########################################################################
#
#
#                           OAUTH API
#
#########################################################################

# THIS REQUESTS AN AUTHORAZATION TOKEN TO TURN INTO AN ACCESS TOKEN
@api.get("/authorization")
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

        # TEST EXAMPLE OF MAKING A CALL USING USER ACCESS TOKEN
        #print('\n\n\n\n\ntoken_data')
        #print(token_data)
        #test_headers = {
        #    "Authorization": 'Bearer ' + token_data['access_token']
        #}
        #test_response = requests.get('https://api.spotify.com/v1/me',headers=test_headers)
        #print(test_response.json())
        request.user.set_access_token(token_data['access_token'])
        # User.set_access_token(request.user, token_data['access_token'])
        request.user.set_refresh_token(token_data['refresh_token'])
        # User.set_refresh_token(request.user, token_data['refresh_token'])
        request.user.save()
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
    # Replace these with your own client ID and client secret
    # client_id = "e4991986fa1e43369b4a732ebc1aea45"
    # client_secret = "a6bb2acb683b4e7b9894edd80fc4ac60"

    # # Authenticate with Spotify API
    # client_credentials_manager = SpotifyClientCredentials(
    #     client_id=client_id, client_secret=client_secret
    # )
    # sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    user = request.user
    access_token = user.access_token

    headers = {
            "Authorization": 'Bearer ' + access_token
        }
    response = requests.get('https://api.spotify.com/v1/me/playlists', headers=headers)
    if response.status_code == 200:
        playlist_data = response.json()
        # Loop over the json and get out the specific items we need for the playlist model
        playlist_info = []
        for playlist in playlist_data['items']:
            owner = playlist['owner']['display_name']
            playlist_id = playlist['id']
            playlist_name = playlist['name']
            #tracks = playlist_data['tracks']['total']
        
            
            playlist_info.append({
                'owner': owner,
                'playlist_id': playlist_id,
                'playlist_name': playlist_name,
                #'tracks': tracks
            })

            # playlist_instance = Playlist(
            #     owner = owner,
            #     id=playlist_id,
            #     name = playlist_name
            # )
            # playlist_instance.save()
        # loop over the list items from the last for loop and add them to the playlist model
        # for items in playlist_info:
        #     request.playlist.name = items['playlist_name']
        #     request.playlist.id = items['playlist_id']
        #     request.playlist.owner = items['owner']
        #     request.playlist.save()
        return playlist_data
    else:
        return response.status_code, {"error": "Failed to fetch user playlists"}



@api.get("/tracks/{username}/{playlist_id}")
def get_playlist_tracks(request, username: str, playlist_id: str):
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


from .models import User
from ninja import Schema
from typing import List


class UserIn(Schema):
    username: str
    first_name: str = ''
    last_name: str = ''
    password: str = ''
    email: str = ''


@api.post("/user")
def create_user(request, payload: UserIn):
    print(payload.username)
    print(payload.first_name)
    print(payload.last_name)
    print(payload.password)
    print(payload.email)
    user = User.objects.create(**payload.dict())
    return {"users name": user.name}


@api.get("/user/{username}-{password}", response=UserIn)
def get_user(request, username: str, password: str):
    user = get_object_or_404(User, username=username, password=password)
    return user

from ninja import Schema, ModelSchema
from typing import List
from .models import Playlist  # Import the Playlist model

class PlaylistIn(Schema):
    id: str
    name: str
    owner: str
    tracks: int

class PlaylistPayload(Schema):
    playlists: List[PlaylistIn]

@api.post("/user/{username}/load_playlists")
def load_playlists(request, username: str, payload: PlaylistPayload):
    user = get_object_or_404(User, username=username)
    for pl_data in payload.playlists:
        Playlist.objects.update_or_create(
            spotify_id=pl_data.id,
            defaults={
                'name': pl_data.name,
                'owner': user,
                'tracks': pl_data.tracks
            }
        )
    return {"status": "Playlists loaded successfully"}

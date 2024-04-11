import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import requests
from ninja import NinjaAPI
import requests
import base64

api = NinjaAPI()

@api.get("/authorization")
def request_user_authorization(request):
    """
    Requests authorization from the user to access Spotify resources.
    
    Parameters:
    - client_id (str): The Client ID generated after registering your application.
    - redirect_uri (str): The URI to redirect to after the user grants or denies permission.
    - state (str, optional): A random string used for protection against attacks.
    - scope (str, optional): A space-separated list of scopes.

    Returns:
    - str: The authorization URL to redirect the user to.
    """
    client_id = "e4991986fa1e43369b4a732ebc1aea45"
    redirect_uri = "http://127.0.0.1:8000/about/"
    scope = "user-read-private user-read-email"

    # Construct query parameters
    params = {
        'response_type': 'code',
        'client_id': client_id,
        'scope': scope,
        'redirect_uri': redirect_uri,
    }
    # if state:
    #     params['state'] = state

    # Construct authorization URL
    authorization_url = 'https://accounts.spotify.com/authorize?' + '&'.join([f'{key}={value}' for key, value in params.items()])

    return authorization_url



@api.get("/callback")
def handle_callback(request, code: str, state: str):
    """
    Handles the callback after the user authorizes the app and returns the authorization code.
    
    Parameters:
    - code (str): The authorization code returned from the Spotify authorization request.
    - state (str): The value of the state parameter supplied in the request.

    Returns:
    - dict: JSON response containing access token information.
    """
    client_id = "e4991986fa1e43369b4a732ebc1aea45"
    client_secret = 'a6bb2acb683b4e7b9894edd80fc4ac60'
    redirect_uri = "http://127.0.0.1:8000/about/"  # Make sure this matches the redirect URI used in authorization request

    # Exchange authorization code for access token
    token_url = "https://accounts.spotify.com/api/token"
    payload = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri,
    }
    headers = {
        'Authorization': f'Basic {base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()}',
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    response = requests.post(token_url, data=payload, headers=headers)

    # Parse response and return access token information
    if response.status_code == 200:
        token_data = response.json()
        return token_data
    else:
        return {"error": "Failed to exchange authorization code for access token."}, response.status_code



@api.get("/about")
def get_artist_info(request, artist_name):
    # Replace these with your own client ID and client secret
    
    client_id = 'e4991986fa1e43369b4a732ebc1aea45'
    client_secret = 'a6bb2acb683b4e7b9894edd80fc4ac60'
    # Authenticate with Spotify API
    client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    # Search for the artist
    results = sp.search(q='artist:' + artist_name, type='artist')
    items = results['artists']['items']

    if len(items) > 0:
        artist = items[0]
        return {
            'name': artist['name'],
            'popularity': artist['popularity'],
            'followers': artist['followers']['total'],
            'genres': artist['genres']
        }
    else:
        return None
    


@api.get("/playlist")
def get_user_playlists(request, username: str):
    # Replace these with your own client ID and client secret
    client_id = 'e4991986fa1e43369b4a732ebc1aea45'
    client_secret = 'a6bb2acb683b4e7b9894edd80fc4ac60'

    # Authenticate with Spotify API
    client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    # Get user's playlists
    playlists = sp.user_playlists(username)
    
    # Extract relevant information from playlists
    playlist_info = []
    for playlist in playlists['items']:
        playlist_info.append({
            'name': playlist['name'],
            'id': playlist['id'],
            'owner': playlist['owner']['display_name'],
            'tracks': playlist['tracks']['total']
        })
    
    return playlist_info




@api.get("/tracks/{username}/{playlist_id}")
def get_playlist_tracks(request, username: str, playlist_id: str):
    # Replace these with your own client ID and client secret
    client_id = 'e4991986fa1e43369b4a732ebc1aea45'
    client_secret = 'a6bb2acb683b4e7b9894edd80fc4ac60'

    # Authenticate with Spotify API
    client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    # Get tracks from the playlist
    results = sp.playlist_tracks(playlist_id)

    # Extract relevant information from tracks
    tracks_info = []
    for item in results['items']:
        track = item['track']
        tracks_info.append({
            'name': track['name'],
            'id': track['id'],
            'artists': [artist['name'] for artist in track['artists']],
            'album': track['album']['name'],
            'preview_url': track['preview_url'] if 'preview_url' in track else None
        })

    return tracks_info

from models import User 
from ninja import Schema
from typing import List
class UserIn(Schema):
    username: str
    first_name: str
    last_name: str

@api.post("/user")
def create_user(request, palyoad: UserIn):
    user = User.objects.create(**palyoad.dict())
    return {"username": user.name}

@api.get("/user/{username}", response=UserIn)
def get_user(request, username: str):
    user = get_object_or_404(User, name=username)
    return user


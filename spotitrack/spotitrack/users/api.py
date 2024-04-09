import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import requests
from ninja import NinjaAPI
from ninja import Router

api = NinjaAPI()
router = Router()

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

@api.get("/tracks")
def get_playlist_tracks(request, username: str, playlist_id: str):
    # Replace these with your own client ID and client secret
    client_id = 'e4991986fa1e43369b4a732ebc1aea45'
    client_secret = 'a6bb2acb683b4e7b9894edd80fc4ac60'

    # Authenticate with Spotify API
    client_credentials_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
    sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

    # Get tracks from the playlist
    results = sp.playlist_tracks(username, playlist_id)

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
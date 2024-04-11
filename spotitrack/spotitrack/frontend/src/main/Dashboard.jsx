import { useEffect } from "react";


function Dashboard() {

  // using the playlist api to get the user's playlists
  useEffect (async () => {
    const username = 'Sacr3d'
    const res = await fetch(`/users/api/playlist?username=${username}`)
    const data = await res.json()
    console.log(data)
  }, [])

  useEffect (async () => {
    const username = 'Sacr3d'
    const playlist_id = '7AqyxOJ8sodMKovIVWqvDV'
    const res = await fetch(`/users/api/tracks/${username}/${playlist_id}?username=${username}/playlist_id=${playlist_id}`)
    const data = await res.json()
    console.log(data)
  }, [])
  return (
    <div>
      <h1>Dashboard</h1>
      <div>

      </div>
    </div>
  );
}

export default Dashboard;

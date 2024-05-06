import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../UserProvider";

function PlaylistHistory() {
  const { playlistId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    async function fetchHistory() {
      const res = await fetch(`/users/api/playlists/${playlistId}/history`);
      const json = await res.json();
      setData(json);
      setLoading(false);
    }

    fetchHistory();
  }, [playlistId]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No history available.</div>;

  return (
    <div>
      <h1>{data.playlist_name} History</h1>
      {data.history.map((instance, index) => (
        <div key={instance.instance_id}>
          <h2>{`Revision from ${instance.date_added}`}</h2>
          <p>{`Added: ${instance.changes.added.length}, Removed: ${instance.changes.removed.length}, Reordered: ${instance.changes.reordered.length}`}</p>
        </div>
      ))}
    </div>
  );
}

export default PlaylistHistory;

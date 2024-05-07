import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Box, Button } from "@mui/material";
import ChangeAlertCard from "../CustomComponents/ChangeAlertCard";
import TrackComparisonModal from "./TrackComparisonModal";

function PlaylistHistory() {
  const { playlistId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [firstTracksIds, setfirstTracksIds] = useState(null);
  const [secondTracksIds, setsecondTracksIds] = useState(null);
  const [firstSnapIndex, setFirstSnapIndex] = useState(null);
  const [secondSnapIndex, setSecondSnapIndex] = useState(null);

  const handleOpenComparison = async (
    firstSnapshotId,
    secondSnapshotId,
    index1,
    index2
  ) => {
    const fetchInstanceTracks = async (snapshotId) => {
      const encodedSnapshotId = encodeURIComponent(snapshotId); // Encode the snapshot ID
      const response = await fetch(
        `/users/api/playlistInstance/${encodedSnapshotId}/`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data.tracks;
    };

    try {
      const tracks1 = await fetchInstanceTracks(firstSnapshotId);
      const tracks2 = await fetchInstanceTracks(secondSnapshotId);
      setfirstTracksIds(tracks1);
      setFirstSnapIndex(index1);
      setsecondTracksIds(tracks2);
      setSecondSnapIndex(index2);
      setComparisonOpen(true);
    } catch (error) {
      console.error("Error fetching track data:", error);
    }
  };

  const handleCloseComparison = () => {
    setComparisonOpen(false);
  };

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
  if (!data || !data.history.length) return <div>No history available.</div>;
  return (
    <>
      <Box sx={{ width: "100%", marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          {data.playlist_name} History
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column-reverse",
            padding: 2,
          }}
        >
          {data.history.map((instance, index, array) => {
            const versionNumber = index + 1;
            const dateUTC = new Date(instance.date_added + "Z");
            const formattedDate = dateUTC.toLocaleString("en-US", {
              timeZone: "America/New_York",
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <React.Fragment key={instance.instance_id}>
                <Card
                  sx={{
                    minWidth: 500,
                    maxWidth: 500,
                    marginBottom: 2,
                    alignSelf: "center",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" component="div">
                      Version {versionNumber}
                    </Typography>
                    <Typography variant="caption" color="primary">
                      {instance.tracks.length} tracks
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Revised on {formattedDate}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {instance.snapshot_id}
                    </Typography>
                    {index === 0 ? (
                      <>
                        <Typography variant="body2">
                          Initial revision
                        </Typography>
                        <ChangeAlertCard
                          type="added"
                          count={instance.changes.added.length}
                        />
                        <ChangeAlertCard
                          type="removed"
                          count={instance.changes.removed.length}
                        />
                        <ChangeAlertCard
                          type="reordered"
                          count={instance.changes.reordered.length}
                        />
                      </>
                    ) : (
                      <Typography variant="body2">
                        See transition card for changes
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                {index < array.length - 1 && (
                  <Box
                    sx={{
                      display: "flex",
                      direction: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ArrowUpwardIcon sx={{ fontSize: 40 }} />
                    <Card
                      variant="outlined"
                      sx={{
                        minWidth: 150,
                        padding: 1,
                      }}
                    >
                      <CardContent>
                        <ChangeAlertCard
                          type="added"
                          count={array[index + 1].changes.added.length}
                        />
                        <ChangeAlertCard
                          type="removed"
                          count={array[index + 1].changes.removed.length}
                        />
                        <ChangeAlertCard
                          type="reordered"
                          count={array[index + 1].changes.reordered.length}
                        />
                      </CardContent>
                    </Card>
                    <ArrowUpwardIcon sx={{ fontSize: 40 }} />
                    <Button
                      onClick={() =>
                        handleOpenComparison(
                          instance.snapshot_id,
                          array[index + 1].snapshot_id,
                          index + 1,
                          index + 2
                        )
                      }
                      sx={{ mt: 1 }}
                    >
                      Compare Versions
                    </Button>
                  </Box>
                )}
              </React.Fragment>
            );
          })}
        </Box>
      </Box>
      <TrackComparisonModal
        open={comparisonOpen}
        onClose={handleCloseComparison}
        trackIds1={firstTracksIds}
        trackIds2={secondTracksIds}
        index1={firstSnapIndex}
        index2={secondSnapIndex}
        playlistId={playlistId}
      />
    </>
  );
}

export default PlaylistHistory;

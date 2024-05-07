import { useState, useEffect } from "react";
import PlaylistVersionDetails from "./PlaylistVersionDetails";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

PlaylistComparisonContainer.propTypes = {
  trackIds1: PropTypes.array.isRequired,
  trackIds2: PropTypes.array.isRequired,
  index1: PropTypes.number.isRequired,
  index2: PropTypes.number.isRequired,
  playlistId: PropTypes.string.isRequired,
};

function PlaylistComparisonContainer({
  trackIds1,
  trackIds2,
  index1,
  index2,
  playlistId,
}) {
  const [changes, setChanges] = useState({ added: [], removed: [], moved: [] });

  useEffect(() => {
    // Assuming trackIds1 and trackIds2 are arrays of track objects
    const ids1 = trackIds1.map((track) => track.id);
    const ids2 = trackIds2.map((track) => track.id);

    const added = trackIds2.filter((track) => !ids1.includes(track.id));
    const removed = trackIds1.filter((track) => !ids2.includes(track.id));
    const moved = trackIds1.filter(
      (track) =>
        ids2.includes(track.id) &&
        ids1.indexOf(track.id) !== ids2.indexOf(track.id)
    );

    setChanges({
      added: added.map((track) => track.id),
      removed: removed.map((track) => track.id),
      moved: moved.map((track) => track.id),
    });
  }, [trackIds1, trackIds2]);

  return (
    <Box
      direction="column"
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        gap: 2,
      }}
    >
      <PlaylistVersionDetails
        tracks={trackIds1}
        version={index1}
        changes={{ removed: changes.removed }}
        playlistId={playlistId}
      />
      <PlaylistVersionDetails
        tracks={trackIds2}
        version={index2}
        changes={{
          added: changes.added,
          moved: changes.moved,
        }}
        playlistId={playlistId}
      />
    </Box>
  );
}

export default PlaylistComparisonContainer;

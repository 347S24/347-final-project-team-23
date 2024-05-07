import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import PlaylistComparisonContainer from "./PlaylistComparisonContainer";
import PropTypes from "prop-types";

TrackComparisonModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  trackIds1: PropTypes.array.isRequired,
  trackIds2: PropTypes.array.isRequired,
  index1: PropTypes.number.isRequired,
  index2: PropTypes.number.isRequired,
  playlistId: PropTypes.string.isRequired,
};

function TrackComparisonModal({
  open,
  onClose,
  trackIds1,
  trackIds2,
  index1,
  index2,
  playlistId,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Track Comparison</DialogTitle>
      <DialogContent>
        <PlaylistComparisonContainer
          trackIds1={trackIds1}
          trackIds2={trackIds2}
          index1={index1}
          index2={index2}
          playlistId={playlistId}
        />
      </DialogContent>
    </Dialog>
  );
}

export default TrackComparisonModal;

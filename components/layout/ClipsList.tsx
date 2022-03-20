import ClipsListItem from "@components/clips/ClipListItem";
import { IClip } from "@interfaces";
import _Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const Box = styled(_Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "360px",
  maxHeight: "900px",
  backgroundColor: theme.palette.background.paper,
  "clips-list-item-button": {},
}));

type Props = {
  clips?: IClip[];
  selectedClipId?: IClip["uid"];
  onSelectChange: (clipId: IClip) => void;
  onClipEdit: (clip: IClip) => void;
  isLoading?: boolean;
};

const ClipsList = ({
  clips,
  selectedClipId,
  onSelectChange,
  onClipEdit,
  isLoading,
}: Props) => {
  return (
    <Box>
      <List
        aria-labelledby="clips-list-subheader"
        subheader={
          <ListSubheader component="div" id="clips-list-subheader">
            Liste des clips
          </ListSubheader>
        }
      >
        {isLoading || !clips ? (
          <>
            <ClipsListItem isLoading />
            <ClipsListItem isLoading />
            <ClipsListItem isLoading />
            <ClipsListItem isLoading />
          </>
        ) : clips.length ? (
          clips.map((clip) => {
            const isSelected = clip.uid === selectedClipId;

            return (
              <ClipsListItem
                key={clip.uid}
                clip={clip}
                isSelected={isSelected}
                onItemClick={onSelectChange}
                onItemEdit={onClipEdit}
              />
            );
          })
        ) : (
          <Typography>Il n&apos;y a pas de clip pour l&apos;instant</Typography>
        )}
      </List>
    </Box>
  );
};

export default ClipsList;

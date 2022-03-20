import { IClip } from "@interfaces";
import MovieIcon from "@mui/icons-material/Movie";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import EditIcon from "@mui/icons-material/Edit";

type LoadingProps = {
  isLoading: true;
};

type LoadedProps = {
  clip: IClip;
  isLoading?: false;
  isSelected: boolean;
  onItemClick: (clip: IClip) => void;
  onItemEdit: (clip: IClip) => void;
};

type Props = LoadingProps | LoadedProps;

const ClipsListItem = (props: Props) => {
  if (props.isLoading) {
    return (
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton disabled>
            <EditIcon />
          </IconButton>
        }
      >
        <ListItemButton
          sx={{ borderRadius: 1 }}
          className="clips-list-item-button-loading"
          disabled
        >
          <ListItemIcon>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText
            primary={<Skeleton width="80%" />}
            secondary={<Skeleton width="45%" />}
          />
        </ListItemButton>
      </ListItem>
    );
  } else {
    const { clip, isSelected, onItemClick, onItemEdit } = props;

    return (
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton onClick={() => onItemEdit(clip)}>
            <EditIcon />
          </IconButton>
        }
      >
        <ListItemButton
          selected={isSelected}
          onClick={() => onItemClick(clip)}
          sx={{ borderRadius: 1 }}
          className="clips-list-item-button"
        >
          <ListItemIcon>
            <MovieIcon />
          </ListItemIcon>
          <ListItemText
            primary={clip.title}
            secondary={`${clip.endTime - clip.startTime} secondes`}
          />
        </ListItemButton>
      </ListItem>
    );
  }
};

export default ClipsListItem;

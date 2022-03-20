import { IClip } from "@interfaces";
import Pause from "@mui/icons-material/Pause";
import PlayArrow from "@mui/icons-material/PlayArrow";
import SkipNext from "@mui/icons-material/SkipNext";
import SkipPrevious from "@mui/icons-material/SkipPrevious";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/system";
import Fab from "@mui/material/Fab";
import SaveIcon from "@mui/icons-material/Save";
import secondsToTime from "@utils/secondsToTime";
import {
  ComponentPropsWithRef,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";
import { Typography } from "@mui/material";
import { buildClipUrl } from "@utils/buildClipUrl";
import { Timestamp } from "firebase/firestore";

const ToolBarStack = styled(Stack)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
  ".video-player-volume-button": {
    marginTop: 0,
  },
}));

const TimeStack = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",

  ".current-time-label": {
    color: theme.palette.primary.main,
    cursor: "default",
  },

  ".range-time-label": {
    color: theme.palette.secondary.main,
    marginLeft: theme.spacing(2),
    cursor: "default",
  },
}));

const resetUrl = (range: number[], url: string) => {
  const newValue = `${range[0]},${range[1]}`;
  const baseUrl = url.split("t=")[0];

  return `${baseUrl}t=${newValue}`;
};

type Props = {
  clip: IClip;
  onNext: () => void;
  onPrevious: () => void;
  onRangeEdit: (range: IClip) => void;
  canPreviousClick: boolean;
  canNextClick: boolean;
} & ComponentPropsWithRef<"video">;

const VideoPlayer = ({
  clip,
  onNext,
  onPrevious,
  canNextClick,
  canPreviousClick,
  onRangeEdit,
  ...videoProps
}: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isSounded, setIsSounded] = useState(false);
  const [range, setRange] = useState<number[]>([clip.startTime, clip.endTime]);
  const [currentTime, setCurrentTime] = useState(clip.startTime);
  const [url, setUrl] = useState(clip.url);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  // when clip or range references have changed
  // we update the url state
  useEffect(() => {
    setCurrentTime(range[0]);
    setUrl(resetUrl(range, clip.url));
  }, [clip, range]);

  // when the clip reference has changed we store clip's range into the state
  // and reload the video
  useEffect(() => {
    setRange([clip.startTime, clip.endTime]);

    setIsPlaying(false);
    videoRef.current?.load();
  }, [clip]);

  // when url reference has changed
  // we set the updated url into the video component src props
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = url;
      videoRef.current.load();
    }
  }, [url]);

  // watch isSounded state -> mute or unmute sound from the video component
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isSounded ? 1 : 0;
    }
  }, [isSounded]);

  const roundedDuration = Math.round(duration);
  const isEditable = !(
    clip.startTime === range[0] && clip.endTime === range[1]
  );

  const handleRangeChange = () => {
    const payload = {
      ...clip,
      startTime: range[0],
      endTime: range[1],
      url: buildClipUrl(range[0], range[1]),
      lastUpdate: Timestamp.now(),
    };

    onRangeEdit(payload);
  };

  return (
    <Box>
      <Box position="relative">
        <video
          {...videoProps}
          ref={videoRef}
          width={640}
          height={360}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onCanPlay={(event) => setDuration(event.currentTarget.duration)}
        >
          <source src={url} type="video/mp4" />
        </video>
        {isEditable && (
          <Tooltip title="Sauvegarder ce clip">
            <Fab
              size="medium"
              aria-label="Sauvegarder ce clip"
              onClick={() => handleRangeChange()}
              sx={{ position: "absolute", bottom: "24px", right: "12px" }}
            >
              <SaveIcon />
            </Fab>
          </Tooltip>
        )}
      </Box>
      <Slider
        min={0}
        max={roundedDuration}
        value={currentTime}
        onChange={(_, value) => {
          videoRef.current?.pause();
          setIsPlaying(false);
          setCurrentTime(value as number);
        }}
      />
      <Slider
        color="secondary"
        value={range}
        onChangeCommitted={(_, value) => {
          videoRef.current?.pause();
          setIsPlaying(false);
          setRange(value as number[]);
          setCurrentTime(range[0]);
        }}
        valueLabelFormat={(value) => secondsToTime(value)}
        valueLabelDisplay="auto"
        min={0}
        max={roundedDuration}
      />
      <nav>
        <ToolBarStack spacing={2}>
          <div>
            {isPlaying ? (
              <Tooltip title="Mettre la vidéo en pause">
                <IconButton
                  color="primary"
                  onClick={() => videoRef.current?.pause()}
                  aria-label="Mettre en pause"
                >
                  <Pause />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Lire la vidéo">
                <IconButton
                  color="primary"
                  onClick={() => videoRef.current?.play()}
                  aria-label="Lire la vidéo"
                >
                  <PlayArrow />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Passer au clip précédent">
              {/** forced to add span here, because Tooltip throw an error if his child is disabled */}
              <span className="video-player-volume-button">
                <IconButton
                  disabled={!canPreviousClick}
                  color="primary"
                  onClick={() => onPrevious()}
                >
                  <SkipPrevious />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Passer au clip suivant">
              {/** forced to add span here, because Tooltip throw an error if his child is disabled */}
              <span className="video-player-volume-button">
                <IconButton
                  disabled={!canNextClick}
                  color="primary"
                  onClick={() => onNext()}
                >
                  <SkipNext />
                </IconButton>
              </span>
            </Tooltip>
          </div>
          <TimeStack style={{ margin: 0 }}>
            <Tooltip title="Temps de lecture">
              <Typography className="current-time-label">
                {secondsToTime(currentTime)}
              </Typography>
            </Tooltip>
            <Tooltip title="Temps du clip">
              <Typography className="range-time-label">
                [{secondsToTime(range[0])} - {secondsToTime(range[1])}]
              </Typography>
            </Tooltip>
          </TimeStack>
          <Tooltip title={isSounded ? "Couper le son" : "Activer le son"}>
            <IconButton
              className="video-player-volume-button"
              onClick={() => setIsSounded(!isSounded)}
              sx={{ justifySelf: "flex-end" }}
            >
              {isSounded ? <VolumeUpIcon /> : <VolumeOffIcon />}
            </IconButton>
          </Tooltip>
        </ToolBarStack>
      </nav>
    </Box>
  );
};

export default memo(VideoPlayer);

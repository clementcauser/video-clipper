import { ClipForm } from "@components/forms";
import { defaultClipDuration } from "@constants";
import useAuth from "@hooks/useAuth";
import { useClipCreate, useClipDelete, useClipUpdate } from "@hooks/useClip";
import { IClip } from "@interfaces";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import { serverTimestamp, Timestamp } from "firebase/firestore";

const ModalBox = styled(Box)(({ theme }) => ({
  maxWidth: 600,
  borderRadius: theme.shape.borderRadius,
  margin: `48px auto`,
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(3),
}));

type Feedback = {
  type: "error" | "success";
  message: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  defaultValues?: IClip;
  onSubmit: (feeback: Feedback) => void;
};

const CreationModal = ({ open, onClose, onSubmit, defaultValues }: Props) => {
  const { user } = useAuth();

  const { createClip } = useClipCreate(onSubmit);
  const { deleteClip } = useClipDelete(onSubmit);
  const { updateClip } = useClipUpdate(onSubmit);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="clip-creation-modal-title"
      aria-describedby="clip-creation-modal-description"
    >
      <ModalBox>
        <Typography id="clip-creation-modal-title" variant="h6" component="h2">
          Créer un nouveau clip
        </Typography>
        <Typography id="clip-creation-modal-description" sx={{ mt: 2, mb: 3 }}>
          Définissez le titre et les tags de votre nouveau clip.
        </Typography>
        <ClipForm
          onClipCreate={({ tags, title }) => {
            const { end, start } = defaultClipDuration;

            return createClip({
              title,
              ...(tags && { tags }),
              authorId: user?.uid,
              startTime: 0,
              endTime: 183,
              url: `assets/video-surf.mp4#t=${start},${end}`,
              lastUpdate: Timestamp.now(),
            });
          }}
          onClipEdit={(clip) =>
            updateClip({ ...clip, lastUpdate: Timestamp.now() })
          }
          onClipDelete={deleteClip}
          defaultValues={defaultValues}
          onCancel={onClose}
        />
      </ModalBox>
    </Modal>
  );
};

export default CreationModal;

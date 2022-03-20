import CreationModal from "@components/clips/CreationModal";
import VideoPlayer from "@components/clips/VideoPlayer";
import AuthenticatedLayout from "@components/layout";
import ClipsList from "@components/layout/ClipsList";
import { db } from "@firebase/client";
import clipConverter from "@firebase/converters/clipConverter";
import { IClip } from "@interfaces";
import AddIcon from "@mui/icons-material/Add";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import { getUserFromCookie, withPrivateServerSideProps } from "@utils/auth";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { collection } from "firebase/firestore";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

const LoadingBox = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  height: "500px",
  width: "640px",
  backgroundColor: theme.palette.background.default,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

type ModalState = {
  show: boolean;
  defaultValues?: IClip;
};

type Feedback = {
  type: "error" | "success";
  message: string;
};

type Props = {
  user: DecodedIdToken;
};

const Homepage = ({ user }: Props) => {
  const [modal, setModal] = useState<ModalState>({ show: false });
  const [selectedClipIndex, setSelectedClipIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [value, loading, error] = useCollection(
    collection(db, "clips").withConverter(clipConverter)
  );

  const clips = value?.docs.map((doc) => ({
    ...doc.data(),
    uid: doc.id,
  }));

  const onPrevious = () => setSelectedClipIndex(selectedClipIndex - 1);

  const onNext = () => {
    return setSelectedClipIndex(selectedClipIndex + 1);
  };

  const selectedClip = clips?.[selectedClipIndex];

  return (
    <AuthenticatedLayout>
      <Typography textAlign="right">
        Bienvenue{" "}
        <Typography component="span" fontWeight="bold">
          {user?.email}
        </Typography>{" "}
        !
      </Typography>
      <Stack direction="row" marginBottom={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setModal({ show: true })}
        >
          Créer un nouveau clip
        </Button>
      </Stack>
      <Stack direction="row">
        <Stack flex={1} minWidth={300}>
          <ClipsList
            isLoading={loading}
            clips={clips}
            selectedClipId={selectedClip?.uid}
            onSelectChange={(selected) =>
              !!clips &&
              setSelectedClipIndex(
                clips.findIndex((clip) => clip.uid === selected.uid)
              )
            }
            onClipEdit={(editedClip) => {
              setModal({ show: true, defaultValues: editedClip });
            }}
          />
        </Stack>
        <div>
          {selectedClip ? (
            <VideoPlayer
              clip={selectedClip}
              onPrevious={onPrevious}
              onNext={onNext}
              canPreviousClick={!!selectedClipIndex && selectedClipIndex > 0}
              canNextClick={!!clips && selectedClipIndex !== clips.length - 1}
              onRangeEdit={(range) => console.log(range) /** TODO: */}
            />
          ) : (
            <LoadingBox>
              <CircularProgress color="secondary" size={64} />
            </LoadingBox>
          )}
        </div>
      </Stack>
      <CreationModal
        onClose={() => setModal({ show: false })}
        open={modal.show}
        defaultValues={modal.defaultValues}
        onSubmit={(feedback) => {
          setFeedback(feedback);
          feedback.type === "success" && setModal({ show: false });
        }}
      />
      <Snackbar
        open={!!feedback?.type}
        autoHideDuration={6000}
        onClose={() => setFeedback(null)}
      >
        <Alert onClose={() => setFeedback(null)} severity={feedback?.type}>
          {feedback?.message}
        </Alert>
      </Snackbar>
    </AuthenticatedLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Partial<Props>> =
  withPrivateServerSideProps(async (ctx) => {
    const user = await getUserFromCookie(ctx);

    return { props: { user } };
  });

export default Homepage;

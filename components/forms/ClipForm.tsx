import { yupResolver } from "@hookform/resolvers/yup";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import clipFormValidationSchema, {
  ClipFormValues,
} from "@validation/clipCreation";
import { IClip } from "interfaces";
import { Controller, useForm } from "react-hook-form";
import TagsPicker from "./TagsPicker";

type Props = {
  onClipCreate: (values: ClipFormValues) => void;
  onClipEdit: (values: ClipFormValues) => void;
  onClipDelete: (clipId: IClip["uid"]) => void;
  onCancel: () => void;
  defaultValues?: IClip;
  isLoading?: boolean;
};

const ClipForm = ({
  onClipCreate,
  onClipEdit,
  onClipDelete,
  onCancel,
  isLoading = false,
  defaultValues,
}: Props) => {
  const { control, handleSubmit } = useForm<ClipFormValues>({
    resolver: yupResolver(clipFormValidationSchema),
    defaultValues,
  });

  const onSubmit = (values: ClipFormValues) => {
    defaultValues
      ? onClipEdit({ ...defaultValues, ...values })
      : onClipCreate({ title: values.title, tags: values.tags ?? [] });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ width: "450px" }}>
        <Controller
          control={control}
          name="title"
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Titre du clip"
              placeholder="Mon nouveau clip..."
              error={!!error?.message}
              helperText={error?.message}
              disabled={isLoading}
              sx={{ mb: 2 }}
            />
          )}
        />

        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagsPicker onChange={field.onChange} value={field.value} />
          )}
        />
      </Stack>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={() => onCancel()} variant="outlined" color="primary">
          Annuler
        </Button>
        <Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={defaultValues ? <EditIcon /> : <AddIcon />}
          >
            {defaultValues ? "Modifier ce clip" : "Créer ce clip"}
          </Button>
          {defaultValues && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => onClipDelete(defaultValues.uid)}
              sx={{ ml: 1 }}
            >
              Supprimer ce clip
            </Button>
          )}
        </Box>
      </Box>
    </form>
  );
};

export default ClipForm;

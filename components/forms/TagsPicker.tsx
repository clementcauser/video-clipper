import { ITag } from "@interfaces";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { useRef, useState } from "react";
import { v4 as uuid } from "uuid";

type Props = {
  value?: ITag[];
  onChange: (value: ITag[]) => void;
};

const TagsPicker = ({ value = [], onChange }: Props) => {
  const [textFieldValue, setTextFieldValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const onSubmit = () => {
    onChange([...value, { name: textFieldValue, uid: uuid() }]);
    // clean up text field
    setTextFieldValue("");
    // auto focus tag input after adding one
    inputRef.current?.focus();
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction="row"
        spacing={1}
        component="ul"
        sx={{ padding: 0, mb: 2 }}
      >
        {value.length > 0 &&
          value.map(({ name, uid }: ITag) => (
            <Chip
              component="li"
              label={name}
              key={uid}
              onDelete={() => onChange(value.filter((tag) => tag.uid !== uid))}
            />
          ))}
      </Stack>

      <TextField
        inputRef={inputRef}
        value={textFieldValue}
        onChange={(event) => setTextFieldValue(event.currentTarget.value)}
        label="Ajouter un tag"
        placeholder="Océan..."
        InputProps={{
          endAdornment: (
            <Tooltip title="Ajouter ce tag">
              <IconButton
                onClick={() => onSubmit()}
                disabled={!textFieldValue.length}
                color="primary"
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          ),
        }}
        fullWidth
      />
    </Box>
  );
};

export default TagsPicker;

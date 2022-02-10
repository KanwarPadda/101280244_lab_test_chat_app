import { FC, FormEvent, ChangeEvent } from "react";
import { FormControl, FilledInput } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    justifyContentSelf: "flex-end",
    marginTop: 15,
  },
  input: {
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginBottom: 20,
  },
};

interface InputProps {
  text: string;
  handleSubmitMessage: (event: FormEvent) => void;
  handleInputChange: (event: ChangeEvent) => void;
  classes: {
    root: string;
    input: string;
  };
}

const Input: FC<InputProps> = (props) => {
  const { classes, handleSubmitMessage, handleInputChange, text } = props;
  return (
    <form className={classes.root} onSubmit={handleSubmitMessage}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
          disableUnderline
          placeholder="Type something..."
          value={text}
          name="text"
          onChange={handleInputChange}
        />
      </FormControl>
    </form>
  );
}

export default withStyles(styles)(Input);

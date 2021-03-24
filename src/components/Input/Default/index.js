import { TextField, withStyles } from "@material-ui/core";
import theme from "../../../assets/theme";

const DefaultInput = withStyles({
  root: {
    '& label.Mui-focused': {
      color: theme.palette.primaryGreen,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: theme.palette.primaryGreen,
    },
  },
})(TextField);

export default DefaultInput;
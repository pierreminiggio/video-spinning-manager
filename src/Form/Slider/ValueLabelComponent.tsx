import ValueLabelComponentProps from "./ValueLabelComponentProps";
import {Tooltip} from "@material-ui/core";

export default function ValueLabelComponent(props: ValueLabelComponentProps) {
  const { children, index, lastChangedIndex, open, value } = props;

  const popperProps: {style?: Object} = {
  }

  if (index === lastChangedIndex) {
    popperProps.style = {zIndex: 1501}
  }

  return (
    <Tooltip
      PopperProps={popperProps}
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={value}
    >
      {children}
    </Tooltip>
  );
}
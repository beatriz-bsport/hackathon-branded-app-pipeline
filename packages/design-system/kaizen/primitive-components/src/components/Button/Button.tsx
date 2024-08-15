import React from "react";
import "./Button.css";

type ButtonProps = {
  children: string;
};

const Button: React.FC<ButtonProps> = (props) => {
  return <button>{props.children}</button>;
};

export default Button;

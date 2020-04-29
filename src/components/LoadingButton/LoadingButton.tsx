import React from "react";
import { Button } from "react-bootstrap";
import { FaSpinner } from "react-icons/fa";
import "./LoadingButton.css";

export default function LoadingButton({
  isLoading = false,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <Button className={`LoaderButton ${className}`} disabled={disabled || isLoading} {...props}>
      {isLoading && <FaSpinner className="spinning" />}
      {props.children}
    </Button>
  );
}

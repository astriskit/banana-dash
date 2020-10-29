import React from "react";

interface ErrorProps {
  error: {
    message: string;
  };
}
export const Error = (props: ErrorProps) => {
  return <div className="alert error">{props.error.message}</div>;
};

import React from "react";
import { Error as ShowError } from "../components/Error";

export const NotFound = () => (
  <ShowError error={{ message: "The page you are looking for is not there" }} />
);

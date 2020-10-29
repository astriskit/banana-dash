import React from "react";
import { Switch, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { NotFound } from "./pages/NotFound";
import { Rooms } from "./pages/Rooms.jsx";
import { ModelRoot } from "./model";
import "./App.css";

function App() {
  return (
    <ModelRoot>
      <Layout>
        <Switch>
          <Route exact path="/" component={Rooms} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </ModelRoot>
  );
}

export default App;

import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, hashHistory, IndexRedirect} from "react-router";

import Layout from "./components/Layout";
import Home from "./components/Home";
import Database from "./components/Database";
import Replication from "./components/Replication";
import Journaling from "./components/Journaling";

const rootElement = document.getElementById('root');

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={Layout}>
            <IndexRedirect to="/home"/>
            <Route path="home" component={Home}/>
            <Route path="database" component={Database}/>
            <Route path="journaling" component={Journaling}/>
            <Route path="replication" component={Replication}/>
        </Route>
    </Router>, rootElement);
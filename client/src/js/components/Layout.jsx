import React from "react";
import Navigation from "./Navigation";

export default class Layout extends React.Component {

    constructor() {
        
        super();

        this.state = {
            appName: "GT.M Administrative Dashboard"
        };

    }

    render() {
        const activeRoute = this.props.routes[this.props.routes.length - 1].path;
        
        return(
            <div>
                <Navigation title={this.state.appName} activeRoute={activeRoute} />
                <div class="app-container">
                    {this.props.children}
                </div>
            </div>
        );

    }

}
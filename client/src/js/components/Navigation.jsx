import React from "react";
import {Link} from "react-router";

export default class Navigation extends React.Component {

    constructor() {
        super();

        this.state = {
            collapsed: true
        };

        this.navLinkClasses = {
            home: "active",
            about: "",
            contact: ""
        };
    }

    toggleCollapse() {
        const collapsed = !this.state.collapsed;
        this.setState({collapsed});
    }

    render() {   

        const {collapsed} = this.state;
        const navClass = collapsed ? "collapse" : "";     

        for(var property in this.navLinkClasses) {
            if(this.navLinkClasses.hasOwnProperty(property)) {
                if(property === this.props.activeRoute) {
                    this.navLinkClasses[property] = "active";
                }
                else {
                    this.navLinkClasses[property] = "";
                }
            }
        }

        return(
            <nav class="navbar navbar-inverse navbar-fixed-top">
                <div class="container">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle" onClick={this.toggleCollapse.bind(this)}>
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <a class="navbar-brand" href="#">{this.props.title}</a>
                    </div>
                    <div id="navbar" class={"navbar-collapse " + navClass}>
                        <ul class="nav navbar-nav">
                            <li class={this.navLinkClasses.home}><Link to="home">Home</Link></li>
                            <li class={this.navLinkClasses.database}><Link to="database">Database</Link></li>
                            <li class={this.navLinkClasses.journaling}><Link to="journaling">Journaling</Link></li>
                            <li class={this.navLinkClasses.replication}><Link to="replication">Replication</Link></li>

                        </ul>
                    </div>
                </div>
            </nav>
        );
    
    }

}
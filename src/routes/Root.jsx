import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

import UserContext from "context/UserContext"

import App from "routes/app/App";
import Login from "routes/login/Login";
import Page404 from "routes/404/Page404";

import "assets/css/material-dashboard-react.css?v=1.4.1";

class Root extends React.Component{
    constructor(props){
        super(props)

        this.updateUser = (user)=>{
            this.setState({
                user:user
            })
        }
    
        this.state = {
            user: null,
            updateUser: this.updateUser
        }
    }

    /** 
     * check user and update context 
    */
    componentWillMount(){
        let user = JSON.parse(localStorage.getItem('user'));
        this.setState({user:user})
    }


    
    render(){
        return(
            <UserContext.Provider value={this.state}>
                <Switch>
                    <Route path="/app" component={App}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/404" component={Page404}/>
                    <Redirect from="/" to="/login" />
                </Switch>   
            </UserContext.Provider>            
        )
    }
}

export default withRouter(Root);
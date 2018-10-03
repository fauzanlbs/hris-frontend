/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";

import dashboardStyle from "assets/jss/material-dashboard-react/layouts/dashboardStyle";

import image from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";

// page
import DashboardPage from "./routes/dashboard/Dashboard";
import UserProfile from "views/UserProfile/UserProfile";
import TableList from "views/TableList/TableList";
import Typography from "views/Typography/Typography";
import Icons from "views/Icons/Icons";
import NotificationsPage from "views/Notifications/Notifications";
import UserContext from "context/UserContext";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false
    };
    this.resizeFunction = this.resizeFunction.bind(this);
  }
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  }

  getRoute() {
    return this.props.location.pathname !== "/maps";
  }

  resizeFunction() {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  }

  componentDidMount() {
    const { match } = this.props;
    // console.log(match);

    if (navigator.platform.indexOf("Win") > -1) {
      const ps = new PerfectScrollbar(this.refs.mainPanel);
    }
    window.addEventListener("resize", this.resizeFunction);
  }

  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeFunction);
  }

  render() {
    const { classes, match, user, updateUser,  ...rest } = this.props;
    console.log(user);

    // if(user){
    //   if(user){ //admin doesnt have dashboard yet
    //     // return <Redirect to='/app/dashboard'/> 
    //     this.props.history.push('/app/dashboard');
    //   }
                      
    // }else{
    //   console.log('you are not authorized to see this page')        
    //   return <Redirect to='/login'/>                           
    // }


    return (
      <div className={classes.wrapper}>
        <Sidebar
          logoText={"Koperasi Izora"}
          logo={logo}
          image={image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color="blue"
          {...rest}
        />
        <div className={classes.mainPanel} ref="mainPanel">
          <Header
            // routes={dashboardRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            {...rest}
          />
          <div className={classes.content}>
            <div className={classes.container}>
            <Switch>
              <Route path={`${match.url}/dashboard`} component={DashboardPage} />
              <Route path={`${match.url}/master`} component={UserProfile} />
              <Route path={`${match.url}/user`} component={UserProfile} />
              <Route path={`${match.url}/table`} component={TableList} />
              <Route path={`${match.url}/typography`} component={Typography} />
              <Route path={`${match.url}/icons`} component={Icons} />
              <Route path={`${match.url}/notifications`} component={NotificationsPage} />

              <Redirect from={`${match.url}/`} to={`${match.url}/dashboard`} />
            </Switch>
            </div>
          </div>
          
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

const Page = withStyles(dashboardStyle)(withRouter(App));

export default props =>{
  return(
    <UserContext.Consumer>
      {({user,updateUser}) => <Page user={user} updateUser={updateUser}/>}
    </UserContext.Consumer>
  )
}
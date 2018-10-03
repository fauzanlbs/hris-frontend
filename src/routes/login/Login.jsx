import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';

import UserContext from "context/UserContext";

import { withRouter } from 'react-router-dom';

import { Api } from 'helpers/api';

const styles = theme => ({
  layout: {
    width: 'auto',
    height: '100vh',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },

  progressWrapper:{
    alignItems:'center',
    display:'flex',
    flexDirection:'column',
    padding:10,
  }
});

class Login extends React.Component {
  constructor(){
    super()
    this.state = {
      email:'',
      password:'',
      error:'',
      errorEmail:'',
      errorPassword:'',
    }
  }

  signIn(){
    const { email, password } = this.state
    const { updateUser } = this.props

    //validating email & password
    this.setState({
      errorEmail: email ? '' : 'This field is required',
      errorPassword: password ? '' : 'This field is required'
    });

    if(email && password){
      this.setState({loading:true})
      let api = new Api().create();

      api.post('/user/login',{
          email: this.state.email,
          password: this.state.password
      }).then((response)=>{
        this.setState({loading:false})
          console.log('response ',response)
          let data = response.data;
          if(response.status === 200){ //OK
            try{
                let user = data
                let token = user.token
                // Remove Token
                delete user.token
                
                localStorage.setItem('user',JSON.stringify(user));
                localStorage.setItem('api_token', token);

                updateUser(user);

                this.props.history.push('/app/dashboard');
            }catch(error){
                console.log('Error save user data',error)
            }
        }
      }).catch((error) => {
          this.setState({loading:false})
          console.log('login error',error.response)
          //set error message
          if(error.response){
            let data = error.response.data
            this.setState({error:data.message})
            if(data.errors){
              this.setState({
                errorEmail : data.errors.email ? data.errors.email.join(', ') : '',
                errorPassword : data.errors.password ? data.errors.password.join(', ') : '',
              })
            }
          }
      });
    }
    
  }

  componentDidMount(){
    if(this.props.user){
      this.props.history.push('/app/dashboard')
    }
  }

  render(){
    const { classes } = this.props;

    const { error, errorEmail, errorPassword } = this.state;
    return (
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography variant="headline">Sign in</Typography>

            <span style={{color:'red'}}>{error}</span>
            <form className={classes.form}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <Input 
                  id="email" 
                  name="email" 
                  autoComplete="email" 
                  autoFocus
                  onChange={(e)=>{this.setState({email:e.target.value})}}
                  error={errorEmail ? true : false }
                />
                <span style={{color:'red'}}>{errorEmail}</span>
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={errorPassword ? true : false }
                  onChange={(e)=>{this.setState({password:e.target.value})}}
                />
                <span style={{color:'red'}}>{errorPassword}</span>                
              </FormControl>
              <br/><br/>
              
                {this.state.loading ? <div className={classes.progressWrapper}><CircularProgress /></div> : null}
              
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  this.signIn();
                }}>
                Sign In
              </Button>
            </form>
          </Paper>
        </main>
    )
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

const Page = withStyles(styles)(withRouter(Login));

export default props =>{
  return(
    <UserContext.Consumer>
      {({user,updateUser}) => <Page user={user} updateUser={updateUser}/>}
    </UserContext.Consumer>
  )
}
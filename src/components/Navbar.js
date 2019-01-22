import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { withAlert } from 'react-alert';
import ListModal from '../components/ListModal';

class ButtonAppBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false
        }
    }

    componentDidUpdate = () => {
        if(this.state.redirect === true) {
            this.setState({
                redirect: false
            })
        }
    }

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }

    renderRedirect = () => {
        if(this.state.redirect) {
            return <Redirect to='/' />
        }
    }

    handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch('/api/users/signout');
        const body = await response.text();
        this.props.alert.show(body);
        this.props.setUser(undefined);
        this.setRedirect();
    }

    isLogged() {
        if(this.props.user === undefined) {
            return (
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit">
                            Gorcery List
                        </Typography>
                        <Button component={ Link } to="/user/signin" color="inherit">
                            Sign in
                        </Button>
                        <Button component={ Link } to="/" color="inherit">
                            Home
                        </Button>
                    </Toolbar>
                </AppBar>

            )
        } else {
            return (
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit">
                            Gorcery List
                        </Typography>
                        <Button color="inherit">
                            {this.props.user.username}
                        </Button>
                        <form className="signupForm" onSubmit={ (e) => this.handleSubmit(e) }>
                            <Button type="submit" color="inherit">
                                Sign out
                            </Button>
                        </form>
                        <Button component={ Link } to="/" color="inherit">
                            Home
                        </Button>
                        <ListModal
                            user={this.props.user}
                        />
                    </Toolbar>
                </AppBar>
            )
        }
    }

    render() {
        return (
            <div>
                {this.renderRedirect()}
                {this.isLogged()}
            </div>
        );
    }
}

// function ButtonAppBar(props) {
//     const { classes } = props;
//     return (
//         <div className={classes.root}>
//             <AppBar position="static">
//                 <Toolbar>
//                     <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
//                         <MenuIcon />
//                     </IconButton>
//                     <Typography variant="h6" color="inherit" className={classes.grow}>
//                         Gorcery List
//                     </Typography>
//                         <Button component={ Link } to="/user/signin" color="inherit">
//                             Sign in
//                         </Button>
//                         <Button component={ Link } to="/" color="inherit">
//                             Home
//                         </Button>
//                 </Toolbar>
//             </AppBar>
//         </div>
//     );
// }

export default withAlert(ButtonAppBar);
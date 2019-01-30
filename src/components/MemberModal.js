import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import { withAlert } from 'react-alert';
import io from 'socket.io-client';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { TextField, InputLabel, Button } from '@material-ui/core';
import './item.css';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${25}%`,
        left: `${50}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
    },

    input: {
        marginBottom: '30px'
    }
});

class MemberModal extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            open: false,
            username: ''
        }

        this.socket = io('localhost:5000');
        this.socket.open();
    };

    componentWillUnmount() {
        this.socket.close();
    }

    handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch(`/api/lists/${this.props.list.id}/members/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username
            })
        })
        const body = await response.json();
        if(body.message === 'Member successfully added'){
            this.socket.emit('ADD_MEMBER', body.member);
        }
        this.setState({
            username: '',
            open: false
        });
        this.props.alert.show(body.message);
    }

    handleUsernameChange(event) {
        this.setState({ username: event.target.value });
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;

    return (
        <Fragment>
            <Fab onClick={this.handleOpen} size="small" color="primary">
                <AddIcon />
            </Fab>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open}
                onClose={this.handleClose}
            >
                <div style={getModalStyle()} className={classes.paper}>
                    <Typography variant="headline" id="modal-title" gutterBottom align="center">
                        Add a new Member
                    </Typography>
                    <form className="signupForm" onSubmit={ (e) => this.handleSubmit(e) }>
                        <InputLabel htmlFor="username">Name</InputLabel>
                        <TextField
                            className="username itemInput"
                            type="text"
                            placeholder="Enter a username"
                            value={this.state.name}
                            InputProps={{
                                className: classes.input
                            }}
                            onChange={ (e) => this.handleUsernameChange(e) }>
                        </TextField>
                        <Button type="submit" fullWidth value="Submit" color="primary" variant="contained">Add Member</Button>
                    </form>
                </div>
            </Modal>
        </Fragment>
        );
    }
}

MemberModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withAlert(withStyles(styles)(MemberModal));
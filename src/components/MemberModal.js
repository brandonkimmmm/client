import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { withAlert } from 'react-alert';

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
});

class MemberModal extends React.Component {
    state = {
        open: false,
        username: ''
    };

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
        <div>
            <Button onClick={this.handleOpen} color="primary">Add new member</Button>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open}
                onClose={this.handleClose}
            >
                <div style={getModalStyle()} className={classes.paper}>
                    <Typography variant="h6" id="modal-title">
                        Add a new Member
                    </Typography>
                    <Typography variant="subtitle1" id="simple-modal-description">
                        <form className="signupForm" onSubmit={ (e) => this.handleSubmit(e) }>
                            <label htmlFor="username">Name</label>
                            <input className="username signupInput"
                                type="text"
                                placeholder="Enter a username"
                                value={this.state.name}
                                onChange={ (e) => this.handleUsernameChange(e) }>
                            </input>
                            <input className="handleSubmit signupInput" type="submit" value="Submit"></input>
                        </form>
                    </Typography>
                </div>
            </Modal>
        </div>
        );
    }
}

MemberModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withAlert(withStyles(styles)(MemberModal));
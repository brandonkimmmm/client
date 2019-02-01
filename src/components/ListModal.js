import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { withAlert } from 'react-alert';
import { TextField, InputLabel } from '@material-ui/core';
import './item.css';
import io from 'socket.io-client';

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
    },
});

class ListModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            redirect: false,
            name: '',
            list: undefined
        };

        this.socket = io('localhost:5000');
        this.socket.open();

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
            return <Redirect to={`/lists/${this.state.list.id}`} />
        }
    }

    handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch('/api/lists/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.name,
                userId: this.props.user.id
            })
        })
        const body = await response.json();
        this.socket.emit('ADD_LIST', body.list);
        this.setState({
            name: '',
            open: false,
            list: body.list
        });
        this.props.alert.show(body.message);
        this.setRedirect();
    }

    componentWillUnmount() {
        this.socket.close();
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value });
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
            {this.renderRedirect()}
            <Button onClick={this.handleOpen} color="primary" variant="contained">Create New List</Button>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open}
                onClose={this.handleClose}
            >
                <div style={getModalStyle()} className={classes.paper}>
                    <Typography variant="headline" id="modal-title" align="center" gutterBottom>
                        Create a New List
                    </Typography>
                    <form className="signupForm" onSubmit={ (e) => this.handleSubmit(e) }>
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <TextField className="name itemInput"
                            type="text"
                            placeholder="Enter a name"
                            value={this.state.name}
                            onChange={ (e) => this.handleNameChange(e) }
                            InputProps={{
                                className: classes.input
                            }}
                        >
                        </TextField>
                        <Button type="submit" fullWidth value="Submit" color="primary" variant="contained">Create List</Button>
                    </form>
                </div>
            </Modal>
        </Fragment>
        );
    }
}

ListModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withAlert(withStyles(styles)(ListModal));
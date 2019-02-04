import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import { withAlert } from 'react-alert';
import io from 'socket.io-client';
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

class NewItemModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            name: '',
            amount: 1,
            list: undefined
        };

        this.socket = io('localhost:5000');
        this.socket.open();
    }

    componentDidUpdate(prevProps) {
        if(this.props.list !== prevProps.list) {
            this.setState({
                list: this.props.list
            })
        }
    }

    handleSubmit = async e => {
        e.preventDefault();
        const response = await fetch(`/api/lists/${this.props.list.id}/items/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: this.props.userId,
                name: this.state.name,
                amount: this.state.amount,
                listId: this.props.list.id
            })
        })
        const body = await response.json();
        if(body.item) {
            this.socket.emit('ADD_ITEM', body.item);
        }
        this.setState({
            name: '',
            amount: 0,
            open: false,
        });
        this.props.alert.show(body.message);
    }

    componentWillUnmount() {
        this.socket.close();
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value });
    }

    handleAmountChange(event) {
        this.setState({ amount: event.target.value });
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
            <Typography>
                <Button onClick={this.handleOpen} color="primary" variant="contained">
                    <AddIcon /> Item
                </Button>
            </Typography>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open}
                onClose={this.handleClose}
            >
                <div style={getModalStyle()} className={classes.paper}>
                    <Typography variant="headline" align="center" id="modal-title" gutterBottom>
                        Create a New Item
                    </Typography>
                    <form className="signupForm" onSubmit={ (e) => this.handleSubmit(e) }>
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <TextField
                            className="name itemInput"
                            type="text"
                            placeholder="Enter a name"
                            value={this.state.name}
                            onChange={ (e) => this.handleNameChange(e) }
                            InputProps={{
                                className: classes.input
                            }}
                        />
                        <InputLabel htmlFor="amount">Amount</InputLabel>
                        <TextField
                            className="amount itemInput"
                            type="number"
                            inputProps={{
                                min: '1',
                                max: '100',
                                step: '1',
                            }}
                            InputProps={{
                                className: classes.input
                            }}
                            placeholder="Enter the amount"
                            value={this.state.amount}
                            onChange={ (e) => this.handleAmountChange(e) }>
                        </TextField>
                        <Button type="submit" fullWidth value="Submit" color="primary" variant="contained">Create Item</Button>
                    </form>
                </div>
            </Modal>
        </Fragment>
        );
    }
}

NewItemModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withAlert(withStyles(styles)(NewItemModal));
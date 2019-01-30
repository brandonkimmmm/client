import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { withAlert } from 'react-alert';
import { TextField, InputLabel } from '@material-ui/core';
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
    },

    button: {
        marginRight: '20px'
    }
});

class UpdateItemModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            name: '',
            amount: 0,
            purchased: false,
            item: undefined
        };

    }

    componentDidMount() {
        this.setState({
            item: this.props.item,
            name: this.props.item.name,
            amount: this.props.item.amount,
            purchased: this.props.item.purchased
        })
    }

    componentDidUpdate(prevProps) {
        if(this.props.item !== prevProps.item) {
            this.setState({
                item: this.props.item,
                name: this.props.item.name,
                amount: this.props.item.amount,
                purchased: this.props.item.purchased
            })
        }
    }

    handleSubmit = async e => {
        e.preventDefault();
        let item = {
            name: this.state.name,
            amount: this.state.amount,
            purchased: this.state.purchased,
            id: this.state.item.id
        }
        await this.props.handleUpdate(item);
        this.setState({
            open: false,
            // name: '',
            // amount: 0,
            // purchased: false,
            // item: undefined
        })
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
            <Button
                onClick={this.handleOpen}
                variant="contained"
                size="small"
                className={classes.button}
            >
                Update
            </Button>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open}
                onClose={this.handleClose}
            >
                <div style={getModalStyle()} className={classes.paper}>
                    <Typography variant="headline" align="center" gutterBottom>Update Item</Typography>
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
                        <Button type="submit" fullWidth value="Submit" color="primary" variant="contained">Update Item</Button>
                    </form>
                </div>
            </Modal>
        </Fragment>
        );
    }
}

UpdateItemModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withAlert(withStyles(styles)(UpdateItemModal));
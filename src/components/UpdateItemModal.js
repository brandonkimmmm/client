import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import { withAlert } from 'react-alert';
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

        this.socket = io('localhost:5000');
        // this.socket.open();
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
            name: '',
            amount: 0,
            purchased: false,
            item: undefined
        })
    }

    // componentWillUnmount() {
    //     this.socket.close();
    // }

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
        <span>
            <Button onClick={this.handleOpen} color="inherit">Update</Button>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open}
                onClose={this.handleClose}
            >
                <div style={getModalStyle()} className={classes.paper}>
                    <Typography variant="h6" id="modal-title">
                        Update Item
                    </Typography>
                    <Typography variant="subtitle1" id="simple-modal-description">
                        <form className="signupForm" onSubmit={ (e) => this.handleSubmit(e) }>
                            <label htmlFor="name">Name</label>
                            <input className="name signupInput"
                                type="text"
                                placeholder="Enter a name"
                                value={this.state.name}
                                onChange={ (e) => this.handleNameChange(e) }>
                            </input>
                            <label htmlFor="amount">Amount</label>
                            <input className="amount signupInput"
                                type="number"
                                step="1"
                                min="1"
                                placeholder="Enter the amount"
                                value={this.state.amount}
                                onChange={ (e) => this.handleAmountChange(e) }>
                            </input>
                            <input className="handleSubmit signupInput" type="submit" value="Submit"></input>
                        </form>
                    </Typography>
                </div>
            </Modal>
        </span>
        );
    }
}

UpdateItemModal.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withAlert(withStyles(styles)(UpdateItemModal));
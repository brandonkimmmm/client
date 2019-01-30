import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { Grid, Typography, Button } from '@material-ui/core';
import UpdateItemModal from './UpdateItemModal';
import { withAlert } from 'react-alert';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
    root: {
        width: '100%',
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

class ShowItems extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            checked: [],
            items: undefined
        };
    }

    componentDidUpdate(prevProps) {
        if(this.props.items !== prevProps.items) {
            this.setState({
                items: this.props.items
            })
        }
    }

    handleDelete(e, id) {
        e.preventDefault();
        this.props.handleDelete(id);
    }

    itemsTable = () => {
        if(this.state.items) {
            const { classes } = this.props;
            return (
                <Grid container>
                    <Grid item xs={12}>
                        <List className={classes.root}>
                            {this.props.items.map((item, i) => (
                                <ListItem key={i} role={undefined} dense button>
                                    <Checkbox
                                        checked={item.purchased}
                                        tabIndex={-1}
                                        disableRipple
                                        onClick={this.props.handleToggle(item)}
                                    />
                                    <ListItemText><Typography variant="display2">{item.name}</Typography></ListItemText>
                                    <ListItemText><Typography variant="display2">{item.amount}</Typography></ListItemText>
                                    <UpdateItemModal item={item} handleUpdate={(item) => this.props.handleUpdate(item)}/>
                                    <Button onClick={ (e, id) => this.handleDelete(e, item.id) } color="secondary" variant="contained" size="small">
                                        <DeleteIcon />
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            )
        }
    }



    render() {
        return (
            <Fragment>
                {this.itemsTable()}
            </Fragment>
        )
    }
}

ShowItems.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withAlert(withStyles(styles)(ShowItems));

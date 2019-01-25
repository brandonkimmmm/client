import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import io from 'socket.io-client';
import UpdateItemModal from './UpdateItemModal';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
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

    componentDidMount() {
        this.socket = io('localhost:5000');
        this.socket.open();
    }

    componentWillUnmount() {
        this.socket.close();
    }

    componentDidUpdate(prevProps) {
        if(this.props.items !== prevProps.items) {
            this.setState({
                items: this.props.items
            })
        }
    }

    itemsTable = () => {
        if(this.state.items) {
            const { classes } = this.props;
            return (
                <List className={classes.root}>
                    {this.state.items.map((item, i) => (
                        <ListItem key={i} role={undefined} dense button onClick={this.props.handleToggle(item)}>
                            <Checkbox
                                checked={item.purchased}
                                tabIndex={-1}
                                disableRipple
                            />
                            <ListItemText primary={item.name} secondary={item.amount} />
                            <ListItemSecondaryAction>
                                <UpdateItemModal item={item} handleUpdate={(item) => this.props.handleUpdate(item)}/>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            )
        }
    }



    render() {
        return (
            <div>
                {this.itemsTable()}
            </div>
        )


        // return (
        //     <List className={classes.root}>
        //         {[0, 1, 2, 3].map(value => (
        //             <ListItem key={value} role={undefined} dense button onClick={this.handleToggle(value)}>
        //                 <Checkbox
        //                     checked={this.state.checked.indexOf(value) !== -1}
        //                     tabIndex={-1}
        //                     disableRipple
        //                 />
        //                 <ListItemText primary={`Line item ${value + 1}`} />
        //                 <ListItemSecondaryAction>
        //                 <IconButton aria-label="Comments">
        //                     <CommentIcon />
        //                 </IconButton>
        //                 </ListItemSecondaryAction>
        //             </ListItem>
        //         ))}
        //     </List>
        // );
    }
}

ShowItems.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ShowItems);

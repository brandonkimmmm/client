// import React from 'react';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import Divider from '@material-ui/core/Divider';
// import InboxIcon from '@material-ui/icons/Inbox';
// import DraftsIcon from '@material-ui/icons/Drafts';

// const styles = theme => ({
//     root: {
//         width: '100%',
//         maxWidth: 800,
//         backgroundColor: theme.palette.background.paper,
//         position: 'relative',
//         overflow: 'auto',
//         maxHeight: 600,
//         margin: '50px auto'
//     },
//     listSection: {
//         backgroundColor: 'inherit',
//     },
//     ul: {
//         backgroundColor: 'inherit',
//         padding: 0,
//     },
// });

// function ListItemLink(props) {
//     return <ListItem button component="a" {...props} />;
// }

// function SimpleList(props) {
//     const { classes } = props;
//     return (
//         <div className={classes.root}>
//             <List component="nav">
//                 <ListItem button>
//                     <ListItemIcon>
//                         <InboxIcon />
//                     </ListItemIcon>
//                     <ListItemText primary="Inbox" />
//                 </ListItem>
//                     <ListItem button>
//                     <ListItemIcon>
//                         <DraftsIcon />
//                     </ListItemIcon>
//                     <ListItemText primary="Drafts" />
//                 </ListItem>
//             </List>
//             <Divider />
//                 <List component="nav">
//                     <ListItem button>
//                         <ListItemText primary="Trash" />
//                     </ListItem>
//                     <ListItemLink href="#simple-list">
//                     <ListItemText primary="Spam" />
//                 </ListItemLink>
//             </List>
//         </div>
//     );
// }

// SimpleList.propTypes = {
//     classes: PropTypes.object.isRequired,
// };

// export default withStyles(styles)(SimpleList);

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

class ShowLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userLists: [],
            userMemberships: []
        }

        this.socket = io();

        this.socket.open();

        this.socket.on('LIST_ADDED', (data) => {
            if(this.props.user.id === data.userId) {
                this.addList(data);
            }
        })

        this.socket.on('MEMBER_ADDED', (data) => {
            if(this.props.user.id === data.userId) {
                this.addMembership(data);
            }
        })

    }

    componentDidMount() {
        if(this.props.user) {
            this.callApi()
            .then(res => {
                this.setState({
                    userLists: res.userLists,
                    userMemberships: res.userMemberships
                });
            })
            .catch(err => console.log(err));
        }
    }

    componentWillUnmount() {
        this.socket.close();
    }

    callApi = async () => {
        const response = await fetch(`/api/users/${this.props.user.id}/lists`);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    addList = data => {
        this.setState({
            userLists: [...this.state.userLists, data],
            userMemberships: [...this.state.userMemberships, data]
        });
    }

    addMembership = data => {
        this.setState({
            userMemberships: [...this.state.userMemberships, data]
        });
    }

    showUserLists() {
        if(this.state.userLists.length === 0) {
            return <li>Nothing here...</li>
        } else {
            return this.state.userLists.map((list, i) => {
                return (
                    <Link to={`/lists/${list.id}`} key={i}>
                        <li>
                            {list.name}
                        </li>
                    </Link>
                )
            })
        }
    }

    showUserMemberships() {
        if(this.state.userMemberships.length === 0) {
            return <li>Nothing here...</li>
        } else {
            let list ;
            return this.state.userMemberships.map((membership, i) => {
                list = membership.List || membership;
                return (
                    <Link to={`/lists/${list.id}`} key={i}>
                        <li>
                            {list.name}
                        </li>
                    </Link>
                )
            })
        }
    }

    render() {
        return (
            <div>
                <h1>My Lists</h1>
                <ul>
                    {this.showUserLists()}
                </ul>

                <h1>My Memberships</h1>
                <ul>
                    {this.showUserMemberships()}
                </ul>
            </div>
        )
    }
}

export default ShowLists;
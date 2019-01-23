import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import './landing.css';
import ShowLists from './ShowLists';

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined
        }
    }

    componentDidMount() {
        this.setState({
            user: this.props.user
        })
    }

    componentDidUpdate(prevProps) {
        if(this.props.user !== prevProps.user) {
            this.setState({
                user: this.props.user
            })
        }
    }

    showLanding() {
        if(!this.props.user) {
            return (
                <section className='landing'>
                    <section className="mainSection">
                        <h1>Welcome to Grocery List!</h1>
                        <h4>Sign-up for a new account</h4>
                        <Button component={ Link } to="/user/signup" variant="contained" color="primary">
                            Sign up
                        </Button>
                    </section>
                    <section className="selling-points">
                        <h1>Grocery list give you the ability to share a list with anyone -- from todo lists to grocery shopping, collaborate with others to get something done.</h1>
                        <div className="point">
                            <img src="https://static.adweek.com/adweek.com-prod/wp-content/uploads/sites/2/2016/04/twitter-list.jpg" alt="Create" />
                            <h2 className="point-title">Create</h2>
                            <p className="point-description">Create a list where you can add, check off, and remove items.</p>
                        </div>
                        <div className="point">
                            <img src="https://www.barco.com/~/media/images/products/a%20-%20d/clickshare/meeting%20room%20shots/meetingroom_2625%20projection_s%20jpg.jpg?mw=700&mh=456" alt="Collaborate"/>
                            <h2 className="point-title">Collaborate</h2>
                            <p className="point-description">Share your list with other users so they can add, check off, and remove items as well.</p>
                        </div>
                        <div className="point">
                            <img src="http://www.healthcare-informatics.com/sites/healthcare-informatics.com/files/imagecache/570x360/CircleOfCoordination_14989377_SMALLER.jpg" alt="Coordinate" />
                            <h2 className="point-title">Coordinate</h2>
                            <p className="point-description">Use your list to accomplish goals with your group members efficiently and effectively.</p>
                        </div>
                    </section>
                </section>
            )
        } else {
            return (
                <ShowLists user={this.props.user}/>
            )
        }
    }

    render() {
        return (
            <div>
                {this.showLanding()}
            </div>
        )
    }
}

export default Landing;
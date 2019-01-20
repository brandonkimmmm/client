import React, { Component } from 'react';

class List extends Component {
    render() {
        return (
            <section className="list">
                {this.props.match.params.listId} List will go here;
            </section>
        )
    }
}

export default List;
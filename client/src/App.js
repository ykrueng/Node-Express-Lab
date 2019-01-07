import React, { Component } from 'react';
import { Segment, Header } from 'semantic-ui-react'
import axios from 'axios';

class App extends Component {
  state = {
    posts: []
  }

  componentDidMount() {
    axios.get('http://localhost:5000/api/posts')
      .then(res => {
        this.setState({
          posts: res.data
        })
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div className="App">
        <Segment>
          <Header textAlign="center" as="h1">Post List</Header>
          {
            this.state.posts.map((post, id) => (
              <Segment style={{ maxWidth: "50rem", margin: "1rem auto" }}
                color="black" key={id}>
                <Header as="h3">{post.title}</Header>
                <p>{post.contents}</p>
              </Segment>
            ))
          }
        </Segment>
      </div>
    );
  }
}

export default App;

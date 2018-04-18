import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import NewMessage from './NewMessage.js';
import MessageList from './MessageList.js';
import UserList from './UserList.js';
import './index.css';

class App extends React.Component {
  state = {
    entered: false,
    sender: '',
    receiver: 'All',
    message: '',
    type: 'public',
  };
  componentWillMount(){
    var config = {
      apiKey: "AIzaSyAMrh3H6MgOl_-55mwNoOrLRfRqWefODtA",
      authDomain: "react-chat-85cfe.firebaseapp.com",
      databaseURL: "https://react-chat-85cfe.firebaseio.com",
      projectId: "react-chat-85cfe",
      storageBucket: "react-chat-85cfe.appspot.com",
      messagingSenderId: "327769935844"
    };
    firebase.initializeApp(config);
  }
  onNameClick(name, type) {
    this.setState({
      receiver: name,
      message: name + ', ',
      type
    })
  }
  render() {
    return (
      <div className="app">
        <div className="info">
          <UserList db={firebase}
            setReceiver={receiver => this.setState({receiver})}
            onNameClick={this.onNameClick.bind(this)}
          />
          <MessageList db={firebase}
            sender={this.state.sender}
            entered={this.state.entered}
            setReceiver={receiver => this.setState({receiver})}
            onNameClick={this.onNameClick.bind(this)}
          />
        </div>
        <NewMessage db={firebase}
          state={this.state}
          setReceiver={receiver => this.setState({receiver})}
          setSender={sender => this.setState({sender})}
          setEntered={entered => this.setState({entered})}
          setMessage={message => this.setState({message})}
          setType={type => this.setState({type})}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

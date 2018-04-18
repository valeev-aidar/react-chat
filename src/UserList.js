import React from 'react';
import _ from 'lodash';
import './UserList.css';

class Message extends React.Component {
  render(){
    return (
      <div className="username"
        onClick={() => this.props.onClick(this.props.sender, 'private')}>
        {this.props.sender}
      </div>
    )
  }
}

class UserList extends React.Component {
  state = {
    messages: []
  };

  componentWillMount(){
    let app = this.props.db.database().ref('users');
    app.on('value', snapshot => {
      let messages = _(snapshot.val())
                        .keys()
                        .map(messageKey => snapshot.val()[messageKey])
                        .value();
        this.setState({
          messages
        });
    });
  }

  render() {
    let messageNodes = this.state.messages
    .filter(message => new Date() - new Date(message.date) < 7500)
    .map(message => {
      return (
        <Message
          sender = {message.user}
          onClick = {this.props.onNameClick}
        />
      )
    });
    return (
      <div className="userlist">
        <div className='title'><b>Users:</b></div>
        {messageNodes}
      </div>
    );
  }
}

export default UserList;

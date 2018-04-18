import React, {Component} from 'react';
import _ from 'lodash';
import './MessageList.css';

class Message extends Component {
  receiverPart() {
    let { sender, receiver, type } = this.props.message;
    if(receiver !== 'All')
      return (
        <div className="messtitle">
          <div className="name"
            onClick={() => this.props.onClick(sender, type)}>
             {sender}
          </div>
          <div className="to"> to </div>
          <div className="name"
            onClick={() => this.props.onClick(receiver, type)}>
             {receiver}
          </div>
        </div>
      );
    return (
      <div className="messtitle">
        <div className="name"
          onClick={() => this.props.onClick(sender, type)}>
           {sender}
        </div>
      </div>
    );
  };
  render() {
    return (
      <div className="message">
        {this.receiverPart()}
        <div className="messagecontent">
          <div className="text">
            {this.props.message.message}
          </div>
        </div>
      </div>
    )
  }
}

class MessageList extends React.Component {
  state = {
    messages: []
  };
  componentWillMount() {
    const app = this.props.db.database().ref('messages');
    app.on('value', snapshot => {
      const messages = _(snapshot.val())
                        .keys()
                        .map(messageKey => snapshot.val()[messageKey])
                        .value();
      this.setState({
        messages
      });
    });
  }
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "instant" });
  }
  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }
  render() {
    let messageNodes = this.state.messages
      .filter(message => (message.type === 'public'
      || (message.sender === this.props.sender && this.props.entered)
      || (message.receiver === this.props.sender && this.props.entered)))
      .slice(-10)
      .map((message) => {
        return (
          <div>
            <Message
              message = {message}
              onClick = {this.props.onNameClick} />
          </div>
        )
    });
    return (
      <div className="messagelist">
        {messageNodes}
        <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
        </div>
      </div>
    );
  }
}

export default MessageList;

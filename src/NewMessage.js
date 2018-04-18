import React, {Component} from 'react';
import _ from 'lodash';
import './NewMessage.css';

const Field = ({ title, onClick = () => {} }) => (
  <div className="field"
        onClick={onClick}>
    <div className="txt">
      {title}
    </div>
  </div>
);

class NewMessage extends Component {
  state = {
    placeholder: 'Type your name...'
  };
  login(e){
    if(e.keyCode === 13 && this.props.state.sender !== ''){
      e.preventDefault();
      let dbCon = this.props.db.database().ref('/users');
      let key = '';
      dbCon.once('value').then(snapshot => {
        let users = _(snapshot.val())
                          .keys()
                          .map(key => snapshot.val()[key])
                          .value()
                          .filter(obj => obj.user === this.props.state.sender);
        if(users.length > 0) {
          key = _(snapshot.val()).keys()
            .filter(key => _(snapshot.val()[key]).value().user === this.props.state.sender)
            .toString();
          if(new Date() - new Date(users[0].date) < 7500) {
            this.props.setSender('');
            this.setState({
              placeholder: 'This name is already in use.'
            });
          } else {
            dbCon.child(key).update({
              user: this.props.state.sender,
              date: (new Date()).toString(),
            });
            this.props.setEntered(true);
            this.props.setReceiver('All');
            setInterval(() => {
              dbCon.child(key).update({
                user: this.props.state.sender,
                date: (new Date()).toString(),
              });
            }, 5000);
          }
        } else {
          let a = dbCon.push({
            user: this.props.state.sender,
            date: (new Date()).toString(),
          });
          key = a.toString().substring(a.toString().indexOf('/users/') + 7).toString();
          this.props.setEntered(true);
          this.props.setReceiver('All');
          setInterval(() => {
            dbCon.child(key).update({
              user: this.props.state.sender,
              date: (new Date()).toString(),
            });
          }, 10000);
        }
      });
    }
  }
  send(e){
    if(e.keyCode === 13 && !e.shiftKey){
      e.preventDefault();
      let dbCon = this.props.db.database().ref('/messages');
      dbCon.push({
        sender: this.props.state.sender,
        receiver: this.props.state.receiver,
        message: this.props.state.message,
        type: this.props.state.type,
        date: (new Date()).toString(),
      });
      this.props.setMessage('');
    }
  }
  render() {
    if(!this.props.state.entered)
      return (
        <div className="newmessage">
          <input
              className="input"
              placeholder={this.state.placeholder}
              spellcheck="false"
              onChange={e => this.props.setSender(e.target.value)}
              onKeyUp={this.login.bind(this)}
              value={this.props.state.sender}>
          </input>
          <textarea
            className="textarea"
            placeholder="Type a message..."
            disabled />
        </div>
      );
    else
      return (
        <div className="newmessage">
          <div className="control">
            <div className="fromto">
              <Field title={this.props.state.sender} />
              <div className="txt">
                to
              </div>
              <Field title={this.props.state.receiver}
                onClick={e => {
                  this.props.setReceiver('All');
                  this.props.setType('public');
                  this.props.setMessage('');
                }}/>
            </div>
            <Field title={this.props.state.type}
              onClick={e => {
                if(this.props.state.receiver !== 'All'
                && this.props.state.type === 'public')
                  this.props.setType('private')
                else if (this.props.state.receiver !== 'All'
                && this.props.state.type === 'private') {
                  this.props.setType('public');
                }
              }}/>
          </div>
          <textarea
            className="textarea"
            placeholder="Type a message..."
            spellcheck="false"
            onChange={e => this.props.setMessage(e.target.value)}
            onKeyUp={this.send.bind(this)}
            value={this.props.state.message} />
        </div>
      );
  }
}

export default NewMessage;

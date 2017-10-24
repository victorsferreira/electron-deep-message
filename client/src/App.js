import React, { Component } from 'react';

import Message from './components/Message';
import Field from './components/Field';
import moment from 'moment';
import axios from 'axios';

import './App.css';

const Faye = window.Faye;

class App extends Component {
    constructor(){
        super();

        this.state = {
            code: '',
            message: '',
            messages: []
        };

        this.client = null;
        this.messages_element;
        this.is_loading = false;
        this.last_id = null;
    }

    componentDidMount(){
        this.client = new Faye.Client('http://localhost:8000/faye');
        this.messages_element = document.getElementById('messages');
    }

    sendMessage(){
        var publication = this.client.publish('/'+this.state.code, {text: this.state.message});

        publication.then(()=>{
            var messages = this.state.messages;

            messages.push({
                message: this.state.message,
                datetime: Date.now()
            });

            this.setState({
                messages: messages
            })

            this.scrollToBottomOfMessages();
        }, (error)=>{
            console.log('There was a problem: ' + error.message);
        });
    }

    scrollToBottomOfMessages(){
        this.messages_element.scrollTop = this.messages_element.scrollHeight;
    }

    listenToCode(){
        var code = this.state.code;
        console.log('listening to', this.state.code)
        var subscription = this.client.subscribe('/'+code, (message)=>{
            console.log('listening to code', code, message)
        });

        subscription.then(()=>{
            this.getMessages(code);
            // axios.get('http://localhost:8090/'+code+'?last_id='+(this.last_id || ''))
            // .then((response)=>{
            //     var result = response.data;
            //     this.last_id = result[0];
            //
            //     this.setState({messages: result});
            //
            //     this.scrollToBottomOfMessages();
            // }).catch(()=>{
            //     this.setState({messages: []});
            // })
        });
    }

    getMessages(code){
        this.is_loading = true
        ;
        axios.get('http://localhost:8090/'+code+'?last_id='+(this.last_id || ''))
        .then((response)=>{
            var result = response.data;
            this.last_id = result[0]._id;

            this.setState({messages: result});
            this.scrollToBottomOfMessages();

            this.is_loading = false;
        }).catch(()=>{
            this.setState({messages: []});
        })
    }

    render() {
        var messages = this.state.messages.map((message_item, i)=>{
            return (
                <Message key={i} message={message_item.message} datetime={message_item.datetime} />
            );
        })

        return (
            <div className="App">

                <div>
                    <label>Code</label>
                    <input onChange={
                            (el)=>{
                                this.setState({
                                    code: el.target.value
                                }, function(){
                                    this.listenToCode();
                                });
                            }
                        } />
                        <button>Generate code</button>
                    </div>

                    <div>
                        <label>Message</label>
                        <textarea onChange={(el)=>{
                                this.setState({
                                    message: el.target.value
                                });
                            }
                        } ></textarea>
                        <button onClick={()=>{
                                this.sendMessage();
                            }}>
                            Send
                        </button>
                    </div>

                    <div id="messages" onScroll={
                            (e)=>{
                                if(this.messages_element.scrollTop < 10 && !this.is_loading){
                                    this.getMessages(this.state.code);
                                }
                            }
                        }>
                        {messages}
                    </div>
                </div>
            );
        }
    }

    export default App;

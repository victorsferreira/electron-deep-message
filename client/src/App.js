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

        this.channel_timer = null;
        this.client = null;
        this.messages_element;
        this.is_loading = false;
        this.last_id = null;
        this.keep_loading = true;
        this.is_on_bottom = false;
        this.text_box_focused = false;
    }

    componentDidMount(){
        this.client = new Faye.Client('http://localhost:8000/faye');

        this.messages_element = document.getElementById('messages');
    }

    sendMessage(){
        var publication = this.client.publish('/'+this.state.code, {text: this.state.message});

        publication.then(()=>{
            // var messages = this.state.messages;

            // messages.push({
            //     message: this.state.message,
            //     datetime: Date.now()
            // });

            this.setState({
                // messages: messages,
                message: ''
            });

        }, (error)=>{
            console.log('There was a problem: ' + error.message);
        });
    }

    scrollToBottomOfMessages(){
        this.messages_element.scrollTop = this.messages_element.scrollHeight;
        // this.is_on_bottom = true;
    }

    listenToCode(){
        var code = this.state.code;

        var subscription = this.client.subscribe('/'+code, (message)=>{
            // console.log('received', message)
            var messages = this.state.messages;
            messages.push({
                message: message.text,
                datetime: Date.now()
            });

            // console.log('messages', messages)

            var is_on_bottom = this.is_on_bottom;

            this.setState({
                messages: messages
            }, ()=>{
                if(is_on_bottom) this.scrollToBottomOfMessages();
            });
        });

        subscription.then(()=>{
            this.keep_loading = true;
            this.getMessages(code, this.getInitialMessages);
        });
    }

    getMessages(code, callback){
        this.is_loading = true;

        axios.get('http://localhost:8090/'+code+'?last_id='+(this.last_id || ''))
        .then((response)=>{
            var result = response.data;
            if(result.length) this.last_id = result[0]._id;

            callback.call(this,result);

            this.is_loading = false;
        }).catch((err)=>{
            console.log('err',err)
            this.setState({messages: []});
        })
    }

    getInitialMessages(messages,on_finish){
        this.setState({messages: messages},on_finish);
        this.scrollToBottomOfMessages();
    }

    getMoreMessages(messages, on_finish){
        if(!messages.length) this.keep_loading = false;
        this.setState({messages: messages.concat(this.state.messages)},on_finish);
    }

    generateCode(){
        axios.post('http://localhost:8090?salt='+Date.now())
        .then((response)=>{
            if(response.status == 201){
                console.log(response.data.code)
                this.setState({code: response.data.code}, ()=>{
                    this.listenToCode();
                });
            }
        }).catch(()=>{

        })
    }

    render() {
        var messages = this.state.messages.map((message_item, i)=>{
            return (
                <Message key={i} message={message_item.message} datetime={message_item.datetime} />
            );
        })

        return (
            <div className="App" id="app">

                <div id='chat-code'>
                    <input value={this.state.code} onChange={
                            (el)=>{
                                clearTimeout(this.channel_timer);

                                this.setState({
                                    code: el.target.value
                                }, ()=>{
                                    this.channel_timer = setTimeout(()=>{
                                        this.listenToCode();
                                    },1500);
                                });
                            }
                        } />
                        <button className='inline-button generate-code' onClick={()=>{
                                this.generateCode();
                            }}>Generate code
                        </button>
                    </div>

                    <div id="messages" onScroll={
                            (e)=>{
                                if(this.messages_element.scrollTop < 120 && !this.is_loading && this.keep_loading){
                                    this.getMessages(this.state.code, this.getMoreMessages);
                                }

                                if(this.messages_element.scrollTop + this.messages_element.offsetHeight >= this.messages_element.scrollHeight){
                                    this.is_on_bottom = true;
                                }else {
                                    this.is_on_bottom = false;
                                }
                            }
                        }>
                        {messages}
                    </div>

                    <div id='text-box'>

                        <textarea
                            onFocus={()=>{
                                this.text_box_focused = true;
                            }}

                            onBlur={()=>{
                                this.text_box_focused = false;
                            }}

                            onKeyDown={(event)=>{
                                var key_code = event.keyCode;
                                if(key_code == 16) this.shift_pressed = true;
                                else if(key_code == 13 && !this.shift_pressed) this.sendMessage();
                            }}

                            onKeyUp={(event)=>{
                                var key_code = event.keyCode;
                                if(key_code == 16) this.shift_pressed = false;
                            }}

                            onChange={(el)=>{
                                this.setState({
                                    message: el.target.value
                                });
                            }}
                            value={this.state.message} />
                        <button className='button send-message' onClick={()=>{
                                this.sendMessage();
                            }}>
                            Send
                        </button>
                    </div>
                </div>
            );
        }
    }

    export default App;

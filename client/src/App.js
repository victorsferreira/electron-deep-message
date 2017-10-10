import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const Faye = window.Faye;

class App extends Component {
    componentDidMount(){
        console.log('Faye',Faye)

    }

    render() {
        return (
            <div className="App">

                <div>
                    <label>Code</label>
                    <input />
                    <button>Generate code</button>
                </div>

                <div>
                    <label>Message</label>
                    <textarea></textarea>                    
                    <button>Send</button>
                </div>

                <div id="messages">
                    <ul>
                        <li>1</li>
                        <li>2</li>
                        <li>3</li>
                        <li>4</li>
                        <li>5</li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default App;

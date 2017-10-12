import React, { Component } from 'react';

class App extends Component {
    componentDidMount(){

    }

    render() {
        var field_element = null;

        switch(this.props.type){
            case 'input':
                return (<input value={this.props.value} />);
            case 'textarea':
                return (<textarea>{this.props.value}</textarea>);
            default:
                return (<input value={this.props.value} />);
        }

        return (
            <div className="Field">
                {field_element}
            </div>
        );
    }
}

export default App;

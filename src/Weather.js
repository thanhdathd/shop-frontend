import React, { Component } from 'react'
import axios from 'axios'

export default class Weather extends Component {
    constructor(){
        super()
        this.state = {
            weather: "not yet gotten",
        };
    }

    componentDidMount = () => {
        axios.get("http://localhost:5000/api/product/list").then(res => {
            console.log('status: '+res.status);
            console.log("data:"+JSON.stringify(res.data));
            this.setState({weather: res.data.items.length})
        }).catch(err => {
            console.log('Loi roi:'+JSON.stringify(err))
        })
    }

    render() {
        return (
            <div>
                <button>Get Weather in the </button>
                <h1> This is the page </h1>
                <h2>The wheather:{this.state.weather}</h2>
            </div>
        )
    }
}

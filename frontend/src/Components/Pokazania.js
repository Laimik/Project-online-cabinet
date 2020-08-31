import React, { Component } from 'react'
import PropTypes from 'prop-types'
//import { Link } from '@material-ui/core'
import { Link } from 'react-router-dom'

class Pokazania extends Component {
    
    constructor() {
        super()
        this.state = {
            hotWater: "",
            coldWater: ""            
        }
        
    }


    handleChange(event) {

        const { name, value } = event.target
        this.setState({
            [name]: value 
        })
    }
    

    render() {
        return (
            <div>    
            <Link to='/'>
                
                <button>Вернутся в кабинет</button>
                </Link>
            <form>
                <input
                type="text"
                value={this.state.hotWater}
                name="hotWater"                
                placeholder="Hot Water"
                onChange={this.handleChange}
                />
                <br />
                <input 
                type="text"
                value={this.state.coldWater}
                name="coldWater"                
                placeholder="Cold Water"
                onChange={this.handleChange}          
                />    
                <br />  
                <button type='submit'>Отправить данные</button>         
            </form>
            </div>
        )
    }
}

export default Pokazania

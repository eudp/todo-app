import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

class TodoAdd extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text: ''
    }
  }

  handleInputChanged = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmitAdd = (event) => {
    event.preventDefault(); 

    const { text } = this.state;
    
    this.props.handleAdd(text);

    this.setState({
      text: ''
    });

  }

  render() {

    const { text } = this.state;

    return (

      <form onSubmit={this.handleSubmitAdd}>
        <Grid container spacing={8} justify="center">
       
          <Grid item xs={10}>
            <TextField
              name="text"
              label="What needs to be done?"
              type="text"
              fullWidth
              margin="normal"
              onChange={this.handleInputChanged}
              value={text}
            />
          </Grid>

        </Grid>
      </form>

    );
  }
}

export default TodoAdd;

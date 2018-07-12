import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { update } from '../services/withUser';

const styles = {
  button: {
    margin: '25px 0px',
  },
};

class LoginPage extends Component {
	state = {
		email: null,
		password: null
	}

	handleInputChanged = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	handleLogin = (event) => {
		event.preventDefault();

		const { email, password } = this.state;
		const { history } = this.props;

		axios.post('/api/auth', {
			email, 
			password
		})
			.then(user => {
				update(user.data);
				history.push('/');
			})
			.catch(err => {
				this.setState({
					error: err.response.status === 401 ? 'Invalid email or password.' : err.message
				});
			});
	}

	render() {
		const { classes } = this.props;
		const { error } = this.state;

		return (

			<Grid container justify="center">
				<Grid item md={2} sm={4} xs={8}>

					<form onSubmit={this.handleLogin}>

						<Grid container>
							<Grid item xs={12}>
								<Typography variant="title" color="inherit" align="center">
									Log In to Your Account
								</Typography>
								{error &&
									<Typography paragraph color="error" align="center">
										{error}
									</Typography>
								}
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									id="email"
									label="Email"
									name="email"
									type="email"
									margin="dense"
									onChange={this.handleInputChanged}
									fullWidth	
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									id="password"
									label="Password"
									name="password"
									type="password"
									margin="dense"
									onChange={this.handleInputChanged}
									fullWidth
								/>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Button variant="raised" color="primary" type="submit" fullWidth className={classes.button}>
								Let's go!
							</Button>
						</Grid>
						<Grid item xs={12}>
							<Typography paragraph color="inherit" align="center">
									or <Link to="/create">Register</Link>
							</Typography>
						</Grid>

					</form>
					
				</Grid>
			</Grid>
		);
	}
}

export default withStyles(styles)(LoginPage);
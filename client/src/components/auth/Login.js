import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';


const Login = ({ login, isAuthenticated }) => {
const [formData, setFormData] = useState({
    name: '',
    password: ''
});

const { name, password } = formData;
const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
const onSubmit = async e => {
    e.preventDefault();
    login(name, password);
}

//Redirect
if(isAuthenticated){
  return <Redirect to="/me" />
}
return <Fragment>
  <section className="login">

      
    <h1 className="large text-primary">Sign In <i className="fas fa-user"></i></h1>
    
    <form className="form" onSubmit={e=>onSubmit(e)}>
      <div className="form-group">
        <input type="text" placeholder="Name" 
        name="name" 
        value={name} 
        onChange={e => onChange(e)} 
        required/>
      </div>
      <div className="form-group">
        <input
          type="password"
          placeholder="Password"
          name="password"
          minLength="5"
          value={password} 
          onChange={e => onChange(e)}
        />
      </div>
      <input type="submit" className="btn btn-primary" value="Login" />
    </form>
    <p className="my-1">
      Don't have an account? <Link to='/signup'>Sign Up</Link>
    </p>
    
      </section>
</Fragment>
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
}); 

export default connect(mapStateToProps, { login })(Login);
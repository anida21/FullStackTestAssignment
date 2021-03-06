import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'



const Landing = ({ isAuthenticated }) => {
  if(isAuthenticated){
    return <Redirect to='/me' />
  }
  
  return (
        <div>
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">BALKON</h1>
          <p className="lead">
            FullStack test assignment
          </p>
          <div className="buttons">
            <Link to='/signup' className="btn btn-primary">Sign Up</Link>
            <Link to='/login' className="btn btn-light">Login</Link>
          </div>
        </div>
      </div>
    </section>
        </div>
    )
}

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps)(Landing);
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { addLike, removeLike } from '../../actions/auth'


const ProfileItem = ({auth:{ addLike, removeLike}, showActions, profile: {
    user: { _id, name, avatar, likes }
} }) => {
    return (
        <div className="profile bg-light">
        <img src={avatar} alt="" className="round-img"/>
        <div>
            <h2>{name}</h2>
            
                {showActions && <Fragment>
              <button onClick={e=>addLike(_id)} type="button" className="btn btn-light">
              <i className="fas fa-thumbs-up"></i>{' '}
              <span>{likes > 0 && (
                  <span>{likes}</span>
              )}</span>
            </button>
            <button onClick={e=>removeLike(_id)} type="button" className="btn btn-light">
              <i className="fas fa-thumbs-down"></i>
            </button>
            </Fragment>}
            
            
            <Link to={`/profile/${_id}`} className="btn btn-primary">View Profile</Link>
        </div>
        </div>
    )
}
ProfileItem.defaultProps = {
    showActions: true
  }

ProfileItem.propTypes = {
    profile: PropTypes.object.isRequired,
    addLike: PropTypes.func.isRequired,
    removeLike: PropTypes.func.isRequired
    
}
const mapStateToProps = state => ({
    auth: state.auth
})


export default connect(mapStateToProps, { addLike, removeLike })(ProfileItem)


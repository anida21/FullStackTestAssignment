import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteAccount, getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import { Link } from 'react-router-dom';
import DashboardActions from './DashboardActions';


const Dashboard = ({ getCurrentProfile, deleteAccount, auth: { user }, profile: { profile, loading } }) => {
    useEffect(()=>{
        getCurrentProfile();
    }, [getCurrentProfile])
    
    return loading && profile === null ? <Spinner /> : <Fragment>
        <h1 className="dashboard">My profile</h1>
        <p className="dashboard"><i className="fas fa-user"></i>Welcome { user && user.name }</p>
        {profile !== null ? (
        <Fragment>
            <DashboardActions />
            <div className="dashboard">
                <button className="btn btn-danger" onClick={()=>deleteAccount()}><i className="fas fa-user-minus"></i> Delete Account</button>
            </div>
        </Fragment>
        ) : ( 
        <Fragment> 
                        <div className="dashboard">

            <p>You have not yet setup a profile, please add some info</p>
            <Link to='/create-profile' className="btn btn-primary my-1">Create profile</Link>
            </div>

        </Fragment>)}
    </Fragment>;
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);

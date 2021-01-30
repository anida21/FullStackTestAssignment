const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const request = require('request');
const config = require('config');
const {check, validationResult} = require('express-validator');

//GET profile/me
//Get current users profile
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id }).populate('user',['name', 'avatar']);
        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for this user'});
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//POST api/profile
//Create/update profile
router.post('/', [auth, [
    check('bio', 'Bio is required')
    .not()
    .isEmpty()
    
]
], async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    const{
        bio,
        githubusername,
        facebook,
        instagram,
        linkedin
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;

    if(bio) profileFields.bio = bio;
    if(githubusername) profile.githubusername = githubusername;
    
    profileFields.social = {}
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try{
        let profile = await Profile.findOne({user: req.user.id});
        if(profile){
            //Update
            profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true, upsert: true, setDefaultsOnInsert: true} );
            return res.json(profile);
        }

        // Create
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }



});

//GET api/profile
//Get all users profile
router.get('/', async (req,res)=>{
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//GET api/profile/user/:user_id
//Get profile by user id
router.get('/user/:user_id', async (req,res)=>{
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        
        if(!profile) return res.status(400).json({msg: 'There is no profile for this user'});
        
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'Profile not found'});

        }
        res.status(500).send('Server Error');
    }
});

//DELETE api/profile
//Delete profile, user and post
router.delete('/', auth, async (req,res)=>{
    try {
        //Remove users posts
        await Post.deleteMany({ user: req.user.id });
        //Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        //Remove user
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({msg: 'User deleted'});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});




module.exports = router;
const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');

const User = require('../../models/User');




//POST api/users
//Register
router.post('/', [check('name', 'Name is required').not().isEmpty(), check('email', 'Please enter valid email').isEmail(), check('password', 'Please enter a password with 5 or more characters').isLength({min: 5})], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    
    const {name, email, password} = req.body;
    
    try {
     
        //If user exist
        let user = await User.findOne({email});
        if (user){
            return res.status(400).json({errors: [{msg: 'User already exists'}]});
        }
        //Gravatar
        const avatar = gravatar.url(email,{
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });
        //Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        //Return JWT
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload, 
            config.get('jwtSecret'),
            { expiresIn: 360000 }, 
            (err, token)=>{
            if(err) throw err;
            res.json({ token })
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

});

router.put('/like/:id', auth, async (req, res)=>{
    try {
        const post = await User.findById(req.params.id);

        //Check if the post has already been liked
        if(user.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({ msg: 'Post already liked'});
        }

        post.likes.unshift({ user: req.user.id });
        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//PUT api/users/unlike/:id
//Like a post
router.put('/unlike/:id', auth, async (req, res)=>{
    try {
        const post = await Post.findById(req.params.id);

        //Check if the post has already been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({ msg: 'Post is not liked yet'});
        }

        //Get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex,1 );

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
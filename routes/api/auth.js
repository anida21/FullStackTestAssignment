const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');


//GET api/auth
router.get('/', auth, async (req, res) => {
    
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user); 
          
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//POST api
//Authenticate user and get token
router.post('/', [check('name', 'Please enter valid name').isString(), check('password', 'Password is required').exists()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    
    const {name, password} = req.body;
    
    try {
     
        //If user exist
        let user = await User.findOne({name});
        if (!user){
            return res.status(400).json({errors: [{msg: 'Invalid credentials'}]});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch){
            return res.status(400).json({errors: [{msg: 'Invalid credentials'}]});
        }
7
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

module.exports = router;
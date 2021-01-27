const router = require('express').Router();


router.route('/').get((req, res)=>{
    res.send('route working')
});

module.exports = router;


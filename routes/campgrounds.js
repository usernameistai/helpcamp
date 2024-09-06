const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, validateCampground, isAuthor  } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const multer  = require('multer');
const { storage } = require('../cloudinary'); // node automatically looks for an index.js file
const upload = multer({ storage });

const Campground = require('../models/campground');

// Alternative Way of Routing
router.route('/') // this is an express function
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
    // .post(upload.array('image'), (req, res, next) => {
    //     console.log(req.files, req.body);
    //     // res.send({body:req.body,file:req.file});
    //     res.send('Keep trying');
    // })

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// CAMPGROUND ROUTES
// owing to app.use('/campgrounds', campgrounds) => have removed the /campgrounds from the app.get etc.
// router.get('/', catchAsync(campgrounds.index));
// router.get('/new', isLoggedIn, campgrounds.renderNewForm);
// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));
// router.get('/:id', catchAsync(campgrounds.showCampground));
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));
module.exports = router;
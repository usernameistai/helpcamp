const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken});
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds: campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
  // if(!req.bod.campground) throw new ExpressError('Invalid campground data', 400);
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send();
  // res.send(geoData.body.features[0].geometry); // just look at the docs as to the methods etc.
  const campground =  new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map(f => ({ url: f.path, filename: f.filename })); // url cloudinary urllink to image, plus specific filename
  campground.author = req.user._id;
  await campground.save();
  console.log(campground.geometry.coordinates);
  req.flash('success', 'successfully made a new campground')
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground
      .findById(req.params.id)
      .populate({ path: 'reviews', populate: {path: 'author'}})
      .populate('author');
  if(!campground) {
      req.flash('error','Cannot find said campground');
      res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground: campground });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if(!campground) {
      req.flash('error','Cannot find said campground');
      res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit', { campground: campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  const imgs =  req.files.map(f => ({ url: f.path, filename: f.filename }));
  campground.images.push(...imgs);
  await campground.save();
  console.log(campground);
  if(req.body.deleteImages) {
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({ $pull: {images: { filename: { $in: req.body.deleteImages}}}});
    console.log(campground);
  }
  req.flash('success', 'successfully updated the campground')
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'successfully deleted campground')
  res.redirect('/campgrounds');
};
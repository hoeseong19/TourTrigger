var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TourTrigger' });
});

const aws = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET;
const { v4: uuidv4 } = require('uuid');

router.get('/s3', function(req, res, next) {
  const s3 = new aws.S3({region: 'ap-northeast-2'});
  const filename = req.query.filename;
  const type = req.query.type;
  const uuid = uuidv4();
  const params = {
    Bucket: S3_BUCKET,
    Key: uuid + '/' + filename,
    Expires: 900,
    ContentType: type,
    ACL: 'public-read'
  };
  console.log("params???", params);
  s3.getSignedUrl('putObject', params, function(err, data) {
    if (err) {
      console.log("err???", err);
      return res.json({err: err});
    }
    res.json({
      signedRequest: data,
      // 403 error solved by unabling first and second option in Block public access
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${uuid}/${filename}`
    });
  });
});

module.exports = router;

var express = require('express');
var cors = require('cors');
require('dotenv').config()
var app = express();
const bodyParser = require('body-parser')
const process = require('process');
const multer  = require('multer')



//set up multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload/')
  },
  filename: function (req, file, cb) {
    console.log(file);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = file.originalname.slice(file.originalname.lastIndexOf('.'));
    cb(null, file.fieldname + '-' + uniqueSuffix+ext);
  }
})

const fileupload = multer({storage:storage}).single('upfile');

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
/*
app.use(fileUpload({    
    useTempFiles : true,
    tempFileDir : __dirname + '/tmp/',
    safeFileNames : true,
    preserveExtension: true,
    uploadTimeout: 300000 //5 minutes
    }));
*/
app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});




const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});


const postfileanalyse = (req,res,next) => {
  let message;
  
  fileupload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log('fileupload multererror', err)
      // A Multer error occurred when uploading.
      res.send('MulterError', err);
    } else if (err) {
      console.log('fileupload Error', err)
      // An unknown error occurred when uploading.
      res.send('Fileupload Error', err);
    }  
  });  
  if (!req.file) {
        console.log("No file received");          
        res.sendFile(process.cwd() + '/views/index.html');
    
    } else {
      const upfile = req.file;
      console.log('file received');
      console.log(req.file);            
      res.json({name: upfile.originalname, type: upfile.mimetype, size: upfile.size}); 

    }
  /*

  */
}

//upfile name input field inside the form for upload
app.post('/api/fileanalyse',fileupload,postfileanalyse)
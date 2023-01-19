const mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);

const pageSchema = new mongoose.Schema({
    video_id:{
        type: Number,
    },
    video_title:{
        type: String,
        required: 'Yes'
    },
    video_thumbnail:{
        type: String,
    },
    video_content:{
        type: String
    },
    video_keyword:{
        type:String
    },
    video_description:{
        type:String
    },
    video_url:{
        type:String
    },
    update_date:{
        type:String
    }

});

pageSchema.plugin(AutoIncrement, {id:'video_id',inc_field: 'video_id'});
module.exports = mongoose.model('videos', pageSchema);
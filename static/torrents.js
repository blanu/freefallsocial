var TCNDDU = TCNDDU || {};

var uploadUrl=null;
var files=[];
var blobids=[];
var myPlayList = [];
var started=false;

function deleteItem(blobid)
{
  log('deleteItem: '+blobid);
  $.post('/gadget/attachment/delete/'+gadget.gadgetid+'/'+blobid);
}

function displayPlayList() {
    $("#jplayer_playlist ul").empty();
    for (i=0; i < myPlayList.length; i++) {
      var listItem = (i == myPlayList.length-1) ? "<li class='jplayer_playlist_item_last'>" : "<li>";
      listItem += "<a href='"+myPlayList[i].mp3+"' id='jplayer_playlist_item_"+i+"' tabindex='1'>"+ myPlayList[i].name +'</a><button id="deleteButton_'+i+'" class="deleteButton">X</button></li>';
      $("#jplayer_playlist ul").append(listItem);

      $("#deleteButton_"+i).data("index", i).click(function() {
        var index = $(this).data("index");
        log("index: "+index+" "+myPlayList.length);

        log(myPlayList[index]);
        var parts=myPlayList[index].mp3.split('/');
        deleteItem(parts[parts.length-1]);

        myPlayList.splice(index, 1); // Remove
        displayPlayList();

        if(playItem==index)
        {
          if(index>myPlayList.length)
          {
            playListChange(0); // Deleted last song, start first song
          }
          else
          {
            playListChange(index); // Play next song
          }
        }

        return false;
      });
    }
}

function makeId(data)
{
  return 'id_'+string2hex(hash(data)).slice(0,6);
}

function uploadUrlResults(data)
{
  log('uploadUrl:');
  log(data);
  blobids.push(data);

  var file=files.pop();
  var blobid=blobids.pop();
  $("#listing").append('<li>'+file.fileName+'<span id="'+blobid+'"></span></li>');
  TCNDDU.processXHR(file, blobid);
}

function gotState()
{
  log('gotState');
  log('gadget:');
  log(gadget);
  $("#uploading").empty();
  var shards=gadget.getState().getShards();
  for(var x=0; x<shards.length; x++)
  {
    var shard=shards[x];
    var uploading=shard.get('uploading', []);
    for(var y=0; y<uploading.length; y++)
    {
      var file=uploading[y];
      $("#uploading").append('<li>'+file.name+'<span id="'+makeId(file.name+file.id)+'" class="progress"></span></li>');
    }
  }
}

function gotAttachment(as)
{
  log('got attachment');
  log(as);

  var shard=gadget.getState().getShard();
  var uploading=shard.get('uploading', []);

  myPlayList=[];
  for(var x=0; x<as.length; x++)
  {
    myPlayList.push({'name': as[x].name, 'mp3': 'http://wavetabs.appspot.com/gadget/attachment/'+gadget.gadgetid+'/'+as[x].id});

    for(var y=0; y<uploading.length; y++)
    {
      log('checking: '+uploading[y].name+' '+as[x].name+' '+uploading[y].id+' '+as[x].id);
      if(uploading[y].name==as[x].name) // FIXME: Will fail if two files with the same name are being uploaded simultaneously
      {
        log('deleting '+uploading[x]);
        uploading.splice(y, 1);
      }
    }
  }

  shard.submitValue('uploading', uploading);

  displayPlayList();

  if(!started)
  {
    started=true;
    playListInit(true);
  }
}

function noop()
{
  return false;
}

(function(){
  var dropListing;
  var dropArea;
  var reader;

  TCNDDU.setup = function()
  {
    gadget.setStateCallback(gotState);
    gadget.setAttachmentsCallback(gotAttachment);

    $("#file").click(noop);
    $("#file").change(TCNDDU.handleDrop);
  };

  TCNDDU.handleDrop = function(evt)
  {
    for(var i = 0, len = evt.target.files.length; i < len; i++)
    {
      var file=evt.target.files[i];
      files.push(file);
      $("#uploading").append('<li>'+file.fileName+'</li>');
    }

    TCNDDU.uploadFiles();
  }

  TCNDDU.uploadFiles=function()
  {
    for(var x=0; x<files.length; x++)
    {
      if(files.length>0)
      {
        if(blobids.length>0)
        {
          TCNDDU.processXHR(files.pop(), blobids.pop());
        }
        else
        {
          $.getJSON('/gadget/blob/'+gadget.gadgetid, uploadUrlResults);
        }
      }
    }
  };

  function uploadError(evt)
  {
    log('upload error');
//    progress.empty().append('error');
  }

  TCNDDU.processXHR = function(file, blobid)
  {
    var xhr = new XMLHttpRequest();
    log("xhr: "+xhr);
    log('xhr.upload: '+xhr.upload);

    var parts=blobid.split('/');
    var id=parts[parts.length-1];

    xhr.upload.onprogress=function(evt)
    {
//      log('progress2');
      var progress=$('#'+makeId(file.fileName+id));
//      log('progress element: '+progress.size());
      if (event.lengthComputable)
      {
        var percentage = Math.round((event.loaded * 100) / event.total);
        if (percentage < 100)
        {
//          log(percentage);
          progress.empty().append(percentage+'%');
        }
      }
    }

    xhr.upload.onload=function(evt)
    {
      log('upload complete');
    }

//    xhr.upload.onerror=uploadError;

    log('sending:');
    log(file);
    var fd = new FormData;
    fd.append('test', 'test1');
    fd.append("file", file);
    log('fd:');
    log(fd);

    var shard=gadget.getState().getShard();
    var uploading=shard.get('uploading', []);
    uploading.push({'name': file.fileName, 'id': id});
    shard.submitValue('uploading', uploading);

    xhr.open("POST", blobid, true);
    log('open');
//    xhr.setRequestHeader("X-File-Name", file.fileName);
//    xhr.setRequestHeader("X-File-Size", file.fileSize);
    xhr.send(fd);
    log('sent');
  };
})();

function addUri()
{
  var uri=$('#uriField').val();
  $('#uriField').val('');

  var url='/gadget/link/add/'+gadget.gadgetid;
  $.post(url, JSON.stringify(uri));

  return false;
}

function initFiles()
{
  $('#addUri').click(addUri);
}

$(document).ready(initFiles);

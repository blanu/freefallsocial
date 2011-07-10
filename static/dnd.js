var TCNDDU = TCNDDU || {};

var uploadUrl=null;
var files=[];
var blobids=[];

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

function gotAttachment(as)
{
  log('got attachment');
  log(as);
  $("#attachments").empty();
  for(var x=0; x<as.length; x++)
  {
    $("#attachments").append('<li><a href="/wave/attachment/'+wave.waveid+'/'+as[x].id+'">'+as[x].name+'</a></li>');
  }
  $("#listing").empty();
}

(function(){
  var dropListing;
  var dropArea;
  var reader;

  TCNDDU.setup = function()
  {
    wave.setAttachmentsCallback(gotAttachment);

    $("#file").change(TCNDDU.handleDrop);
  };

  TCNDDU.handleDrop = function(evt)
  {
    for(var i = 0, len = evt.target.files.length; i < len; i++)
    {
      files.push(evt.target.files[i]);
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
          $("#listing").append('<li>'+files[i].fileName+'<span id="'+files[i].fileName+'"></span></li>');
          TCNDDU.processXHR(files.pop(), blobids.pop());
        }
        else
        {
          $.getJSON('/wave/blob/'+wave.waveid, uploadUrlResults);
        }
      }
    }
  };

  TCNDDU.processXHR = function(file, blobid)
  {
    var xhr = new XMLHttpRequest();

    var progress=$("#"+blobid);

    xhr.upload.addEventListener('progress', function(event)
    {
      log("progress2");
      if (event.lengthComputable)
      {
        var percentage = Math.round((event.loaded * 100) / event.total);
        if (percentage < 100)
        {
          log(percentage);
          progress.empty().append(percentage);
        }
      }
    }, false);

    xhr.upload.onload=function(event)
    {
      console.log("xhr upload complete");
      progress.empty().append('done');
    }

    xhr.upload.onerror=function(evt)
    {
      console.log("error: " + evt.code);
      progress.empty().append('error');
    }

    log('sending:');
    log(file);
    var fd = new FormData;
    fd.append('test', 'test1');
    fd.append("file", file);
    log('fd:');
    log(fd);

    xhr.open("POST", blobid, true);
    log('open');
//    xhr.setRequestHeader("X-File-Name", file.fileName);
//    xhr.setRequestHeader("X-File-Size", file.fileSize);
//    xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.send(fd);
    log('sent');
  };
})();

$(document).ready(TCNDDU.setup);
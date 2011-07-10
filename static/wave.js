function deleteTab()
{
  var waveid=$(this).parents('div').attr('id');
  log('delete tab: '+waveid);

  log('stopping listening on wave-'+waveid+'-participants');

  var wave=ocean.waves[waveid];
  log('wave: '+wave);
  wave.remove();

  var url='/wave/delete/'+waveid;
  $.post(url);
}

function renameTabForm()
{
  var waveid=$(this).parents('div').attr('id');
  log('rename tab: '+waveid);

  $('#renameTabFormTemplate').clone().attr('id', waveid+'-renameTabForm').attr('wave', waveid).appendTo('#'+waveid);
  $('#'+waveid+'-renameTabForm').dialog({'modal': true, buttons: {
    'Rename': function() {
      log(this);
      log('rename! '+$(this).children('form').children('input').val());
      var name=$(this).children('form').children('input').val();
      var url='/wave/rename/'+waveid;
      $.post(url, JSON.stringify(name));
      $(this).dialog('close');
    },
    'Cancel': function() {
      $(this).dialog('close');
    }
  }});
}

function addInvite()
{
  log('adding email');
  log(this);

  var waveid=$(this).parents('.template').attr('wave');
  var addr=$(this).attr('addr');
  log(waveid+' '+addr);

  var url='/wave/invites/add/'+waveid;
  $.post(url, JSON.stringify(addr));

  return false;
}

function addParticipants()
{
  log('aps');
  if(!ocean.token)
  {
    window.open(ocean.authUrl);
  }

  var waveid=$(this).parents('div').parents('div').attr('id');
  $('#addParticipantsFormTemplate').clone().attr('id', waveid+'-addParticipantsForm').attr('wave', waveid).appendTo('#'+waveid);
  $('#'+waveid+'-addParticipantsForm').dialog({'modal': true, 'width': 350, 'height': 350});
  $('.addParticipantButton').click(addInvite);
}

function gotParticipants()
{
  log('got participants:');
  log(this);
  var waveid=this.waveid;
  var ps=wv.getParticipants();
  log(ps);
  $('#'+waveid+' .participants').empty();
  var s='<table><tr>';

  for(var x=0; x<ps.length; x++)
  {
    var p=ps[x];
    var thumb=p.getThumbnailUrl();
    if(thumb==null)
    {
      thumb='https://wave.google.com/wave/static/images/unknown.jpg';
    }
    s=s+'<td><img src="'+thumb+'" alt="'+p.getDisplayName()+'" title="'+p.getDisplayName()+'"/></td>';
  }

  var ivs=wv.getInvites();
  log('ivs: '+ivs);
  for(var x=0; x<ivs.length; x++)
  {
    var i=ivs[x];
    thumb='https://wave.google.com/wave/static/images/unknown.jpg';
    s=s+'<td><img class="invite" src="'+thumb+'" alt="'+i+'" title="'+i+'"/></td>';
  }

  s=s+'<td><button class="addParticipant">+</button></td>';
  $('#'+waveid+' .participants').append(s);
  $('#'+waveid+' .addParticipant').click(addParticipants);
}

function waveTabInit()
{
  $(".deleteTabButton").click(deleteTab);
  $(".renameTabButton").click(renameTabForm);

  wv.setParticipantCallback(gotParticipants);
  wv.setInvitesCallback(gotParticipants);
  wv.init();
}

$(document).ready(waveTabInit);

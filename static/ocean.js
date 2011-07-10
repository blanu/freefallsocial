ocean={};
ocean.waves={};
ocean.curated=[];

function refreshLinks()
{
  $('iframe').each(function() {
    var gid=$(this).attr('name');
    var wid=$(this).parents('.wave').attr('id');

    log('link: '+wid+' '+gid);

    var frame=window.frames[gid];
    log('frame: '+gid);
    log(frame);
    if(typeof(frame.link)!==undefined)
    {
      frame.link(ocean.waves[wid], ocean.waves[wid].gadgets[gid]);
    }
  });
}

$(function() {
  this.refreshLinks=refreshLinks;
});

this.refreshLinks=refreshLinks;

window.refreshLinks=refreshLinks;

top.refreshLinks=refreshLinks;
top.ocean=ocean;

ocean.Shard=function(g, newState)
{
  log('new Shard');
  log(g);
  this.gadget=g;
  this.state=newState;

  this.submitDelta=function(delta)
  {
    for(var key in delta)
    {
      var value=delta[key];

      this.state[key]=value;
    }

    this.saveState(this.state);
  }

  this.saveState=function(state)
  {
    log('saveState');
    log(this.gadget);
    var url='/gadget/shard/'+this.gadget.gadgetid;

    log('saving state: '+JSON.stringify(state));

    $.post(url, JSON.stringify(state));
  }

  this.get=function(key, opt_default)
  {
    var value=this.state[key];
    if(value)
    {
      return value;
    }
    else
    {
      return opt_default;
    }
  }

  this.getKeys=function()
  {
    var keys=[];
    for(var key in this.state)
    {
      keys.push(key);
    }
    return keys;
  }

  this.reset=function()
  {
    saveState({});
  }

  this.submitValue=function(key, value)
  {
    var delta={};
    delta[key]=value
    this.submitDelta(delta);
  }

  this.toString=function()
  {
    return JSON.stringify(this.state);
  }
}

ocean.Scratch=function(gadget, newState)
{
  log('new scratch:');
  log(gadget);
  this.gadget=gadget;
  this.state=newState;

  this.submitDelta=function(delta)
  {
    log("scratch delta:");
    log(delta);
    for(var key in delta)
    {
      var value=delta[key];

      log('setting');
      log(key);
      log(value);

      this.state[key]=value;
    }

    log('saving:');
    log(this.state);

    this.saveScratch(this.state);
  }

  this.get=function(key, opt_default)
  {
    var value=this.state[key];
    if(value)
    {
      return value;
    }
    else
    {
      return opt_default;
    }
  }

  this.getKeys=function()
  {
    var keys=[];
    for(var key in this.state)
    {
      keys.push(key);
    }
    return keys;
  }

  this.reset=function()
  {
    this.saveScratch({});
  }

  this.submitValue=function(key, value)
  {
    var delta={};
    delta[key]=value
    this.submitDelta(delta);
  }

  this.saveScratch=function(state)
  {
    log('saveScratch:');
    log(this.gadget);
    var url='/gadget/scratch/'+this.gadget.gadgetid;

    log('url: '+url);
    log(this.gadget);
    log('saving scratch: '+JSON.stringify(state));

    $.post(url, JSON.stringify(state));
  }

  this.toString=function()
  {
    return JSON.stringify(this.state);
  }
}

ocean.State=function(gadget)
{
  this.gadget=gadget;
  this.state={};
  this.Scratch=ocean.Scratch;
  this.Shard=ocean.Shard;

  this.get=function(key, opt_default)
  {
    var value=this.state[key];
    if(value)
    {
      return value;
    }
    else
    {
      return opt_default;
    }
  }

  this.getKeys=function()
  {
    var keys=[];
    for(var key in this.state)
    {
      keys.push(key);
    }
    return keys;
  }

  this.reset=function()
  {
    shard=this.getShard();
    shard.reset();
  }

  this.getScratch=function()
  {
    var scratchState=this.state['scratch'];
    if(!scratchState)
    {
      scratchState={};
    }

    return new this.Scratch(this.gadget, scratchState);
  }

  this.getShard=function()
  {
    var shardState=this.state[this.userid];
    if(!shardState)
    {
      shardState={};
    }

    return new this.Shard(this.gadget, shardState);
  }

  this.getShards=function()
  {
    var shards=[];
    for(var key in this.state)
    {
      shards.push(new this.Shard(this.gadget, this.state[key]));
    }

    return shards;
  }

  this.submitDelta=function(delta)
  {
    shard=this.getShard();
    shard.submitDelta(delta);
  }

  this.submitValue=function(key, value)
  {
    var delta={};
    delta[key]=value
    this.submitDelta(delta);
  }

  this.update=function(state)
  {
    this.state=state;
  }

  this.toString=function()
  {
    return JSON.stringify(this.state);
  }
}

ocean.Gadget=function(wave, gadgetid)
{
  log('new Gadget: '+wave+' '+gadgetid);
  this.state=new ocean.State(this);
  log('this.state:');
  log(this.state);
  this.wave=wave;
  this.gadgetid=gadgetid;
  this.stateCallback=null;
  this.attachmentsCallback=null;
  this.linksCallback=null;
  this.attachments=[];
  this.links=[];
  this.State=ocean.State;
  this.Shard=ocean.Shard;
  this.Scratch=ocean.Scratch;

  gdgt=this;

  this.setStateCallback=function(callback, opt_context)
  {
    log('setStateCallback');
    this.stateCallback=callback;
    this.getGadgetState();
  }

  this.setAttachmentsCallback=function(callback, opt_context)
  {
    log('setAttachmentsCallback');
    this.attachmentsCallback=callback;
    this.getAttachments();
  }

  this.setLinksCallback=function(callback, opt_context)
  {
    log('setLinksCallback');
    this.linksCallback=callback;
    this.getLinks();
  }

  this.getState=function()
  {
    return this.state;
  }

  this.getAttachments=function()
  {
    log('gwa');
    var url='/gadget/attachments/'+this.gadgetid;
    $.getJSON(url, this.attachmentsResults);
  }

  this.attachmentsResults=function(data)
  {
    log('war:');
    log(data);

    if(data)
    {
      log('good');
      if(typeof(data)=='string')
      {
        data=JSON.parse(data);
      }

      gdgt.attachments=data;
    }
    else
    {
      log('bad');
      gdgt.attachments=[];
    }

    if(gdgt.attachmentsCallback)
    {
      log('calling');
      log(gdgt.attachments);
      gdgt.attachmentsCallback(gdgt.attachments);
    }
    else
    {
      log('no callback');
    }
  }

  this.getLinks=function()
  {
    log('ggl');
    var url='/gadget/links/'+this.gadgetid;
    $.getJSON(url, this.linksResults);
  }

  this.linksResults=function(data)
  {
    log('wlr:');
    log(data);

    if(data)
    {
      log('good');
      if(typeof(data)=='string')
      {
        data=JSON.parse(data);
      }

      gdgt.links=data;
    }
    else
    {
      log('bad');
      gdgt.links=[];
    }

    if(gdgt.linksCallback)
    {
      log('calling');
      log(gdgt.links);
      gdgt.linksCallback(gdgt.links);
    }
    else
    {
      log('no callback');
    }
  }

  this.getGadgetState=function()
  {
    log('gws');
    var url='/gadget/state/'+this.gadgetid
    $.getJSON(url, this.gadgetStateResults);
  }

  this.gadgetStateResults=function(data)
  {
    log('wsr: '+data);
    log(gdgt.state);
    if(data)
    {
      if(typeof(data)=='string')
      {
        data=JSON.parse(data);
      }
      gdgt.state.update(data);
    }
    else
    {
      gdgt.state.update({});
    }

    if(gdgt.stateCallback)
    {
      log('calling state callback');
      gdgt.stateCallback();
    }
  }

  this.remove=function()
  {
  }
}

ocean.Wave=function(waveid)
{
  log('new wave: '+waveid);
  this.waveid=waveid;
  this.gadgetIds=[];
  this.gadgets={};
  this.participants=[];
  this.invites=[];
  this.participantCallback=null;
  this.invitesCallback=null;
  this.Gadget=ocean.Gadget;
  this.Scratch=ocean.Scratch;
  this.State=ocean.State;
  this.Shard=ocean.Shard;

  w=this;

  this.Participant=function(id, displayName, thumbnailUrl)
  {
    this.id=id;
    this.displayName=displayName;
    this.thumbnailUrl=thumbnailUrl;

    this.getId = function()
    {
      return this.id;
    }

    this.getDisplayName = function()
    {
      return this.displayName;
    }

    this.getThumbnailUrl = function()
    {
      return this.thumbnailUrl;
    }
  }

  this.setParticipantCallback=function(callback, opt_context)
  {
    log('setParticipantCallback');
    this.participantCallback=callback;
  }

  this.setInvitesCallback=function(callback, opt_context)
  {
    log('InvitesCallback');
    this.invitesCallback=callback;
  }

  this.getParticipantById=function(id)
  {
    return pmap[id];
  }

  this.getParticipants=function()
  {
    return this.participants;
  }

  this.getInvites=function()
  {
    return this.invites;
  }

  this.getViewer=function()
  {
    return this.viewer;
  }

  this.getWaveId=function()
  {
    return this.waveid;
  }

  this.log=log;

  this.getWaveParticipants=function()
  {
    log('gwp:');
    var url='/wave/participants/'+this.waveid
    $.getJSON(url, this.waveParticipantsResults);
  }

  this.waveParticipantsResults=function(data)
  {
    log('wpr: ');
    log(data);
    w.participants=[];
    w.pmap={};

    if(data)
    {
      if(typeof(data)=='string')
      {
        data=JSON.parse(data);
      }

      for(var key in data)
      {
        log('key: '+key);
        var value=data[key];
        var p=new w.Participant(key, value.nickname, null);
        log("p:");
        log(p);
        log('dn: '+p.getDisplayName());
        w.participants.push(p);
        w.pmap[key]=p;
      }
    }

    if(!w.viewer)
    {
      w.viewer=w.pmap[this.userid];
    }

    if(w.participantCallback)
    {
      log('calling participant callback');
      w.participantCallback();
    }
    else
    {
      log('now participant callback');
      log(w);
    }
  }

  this.getWaveInvites=function()
  {
    log('gwi:');
    var url='/wave/invites/'+this.waveid
    $.getJSON(url, this.waveInvitesResults);
  }

  this.waveInvitesResults=function(data)
  {
    log('wir: ');
    log(data);

    w.invites=[];

    if(data)
    {
      if(typeof(data)=='string')
      {
        data=JSON.parse(data);
      }

      w.invites=data;
    }

    if(w.invitesCallback)
    {
      log('calling invites callback');
      w.invitesCallback(data);
    }
    else
    {
      log('no invites callback');
    }
  }

  this.updateWave=function()
  {
    log('updateWave');
    log(this);
    this.getWaveParticipants();
    this.getWaveInvites();
    for(var key in this.gadgets)
    {
      log('updating '+key);
      var g=this.gadgets[key];
      g.getGadgetState();
      g.getAttachments();
    }
  }

  this.loadGadgets=function()
  {
    log('loading gadgets...');
    log(this.gadgetIds);
    for(var x=0; x<this.gadgetIds.length; x++)
    {
      var gadgetid=this.gadgetIds[x];
      log('gid: '+gadgetid.id);
      this.gadgets[gadgetid.id]=new this.Gadget(this, gadgetid.id);
      $("#"+this.waveid+" .gadgets").append('<div id="'+gadgetid.id+'" class="gadgetContainer"><iframe name="'+gadgetid.id+'" src="'+gadgetid.url+'" height="550px" width="100%"/></div>');
    }
  }

  this.init=function()
  {
    this.loadGadgets();
    this.updateWave();
  }

  this.remove=function()
  {
    for(var gid in this.gadgets)
    {
      var g=this.gadgets[gid];
      g.remove();
    }
  }
}

function initOcean()
{
}

$(document).ready(initOcean);

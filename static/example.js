function updateExample()
{
  log('update!');

  var ps=wave.getParticipants();
  log('updated ps: '+ps);

  var state=wave.getState();
  log('updated state: '+state);

  var shard=state.getShard();

  $("#log").empty().append(shard.get('date', 'none...'));

  $("#participants").empty();
  for(var x=0; x<ps.length; x++)
  {
    $("#participants").append("<li>"+ps[x].getDisplayName()+"</li>");
  }
}

function testChange()
{
  delta={};
  delta['aaa']='bbb';
  delta['date']=new Date().getSeconds();

//  var shard=new wave.Shard({});
//  shard.printThis();
//  shard.submitDelta(delta);

  var state=wave.getState();
  var shard=state.getShard();
  shard.printThis();
  shard.submitDelta(delta);
}

function initTest()
{
  wave.setStateCallback(updateExample);
  testChange();
}

$(document).ready(initTest);

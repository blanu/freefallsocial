var ws=null;
var open=false;

function websocketOpen()
{
  log('opened');
  open=true;
}

function websocketMessage(evt)
{
  log('message:');
  log(evt);
  $("#messages").append("<li>"+evt.data+"</li>");
}

function websocketClose()
{
  log('closed');
  open=false;
}

function sendMessage()
{
  if(!ws || !open)
  {
    ws = new WebSocket("ws://blanu.net:9998/");
  }

  ws.send('test message: '+new Date());
}

function websocketInit()
{
  log('wsinit');
  ws = new WebSocket("ws://blanu.net:9998/");
  ws.onopen = websocketOpen;
  ws.onmessage = websocketMessage;
  ws.onclose = websocketClose;

  $("#send").click(sendMessage);
}

$(document).ready(websocketInit);

wave=null;
gadget=null;

function initGadget()
{
  log("gadget.js");
  ocean=parent.ocena;
  parent.refreshLinks();
}

function link(w, g)
{
  log('link: '+w+' '+g);
  if(wave==null)
  {
    wave=w;
  }
  if(gadget==null)
  {
    gadget=g;
  }
}

$(document).ready(initGadget);

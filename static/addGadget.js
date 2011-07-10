function addGadget()
{
  $("#addGadgetForm").show();

  return false;
}

function saveGadget()
{
  var gadgetUrl=$("#addGadgetUrl").val();

  var url='/wave/gadget/'+wave.waveid;
  $.post(url, JSON.stringify(gadgetUrl));

  $("#addGadgetForm").hide();

  return false;
}

function initAddGadget()
{
  $("#addGadgetForm").hide();

  $("#addGadget").click(addGadget);
  $("#saveGadget").click(saveGadget);
}

$(document).ready(initAddGadget);

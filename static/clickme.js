function stateUpdated()
{
  var count=wave.getState().getShard().get('count', 0);
  $("#butCount").text('Click me: '+count);
}

function buttonClicked()
{
  var count=wave.getState().getShard().get('count', 0);
  wave.getState().getShard().submitValue('count', count+1);
}

function initClickme()
{
  if(wave && wave.isInWaveContainer())
  {
    wave.setStateCallback(stateUpdated);

    $("#butCount").click(buttonClicked);
  }
}

$(document).ready(initClickme);

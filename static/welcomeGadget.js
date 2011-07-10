function addCurated()
{
  log(this);
  var gadgetUrl=$(this).attr('href');
  log('adding curated '+gadgetUrl);

  var url='/wave/new';
  var data={'gadgetUrl': gadgetUrl, 'name': $(this).children('img').attr('alt')};
  $.post(url, JSON.stringify(data));

  return false
}

function getCuratedResults(data)
{
  for(var x=0; x<data.length; x++)
  {
    log('adding: '+data[x]);
    $("#curated").append('<li><a href="'+data[x].url+'"><img src="'+data[x].iconUrl+'" alt="'+data[x].name+'"/></a></li>');
  }

  $("#curated li a").click(addCurated);
}

function initWelcome()
{
  var url='/curated';
  $.getJSON(url, getCuratedResults);
}

$(document).ready(initWelcome);
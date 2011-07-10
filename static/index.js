function getContacts()
{
  log('get contacts');
  var url='/contacts';
  $.getJSON(url, gotContacts);
}

function gotContacts(contacts)
{
  log('~ got contacts ~');
  log(contacts)
  log('.');
  authed=contacts[0];
  contacts=contacts[1];

  if(!authed)
  {
    $('#importContacts a').attr('href', contacts);
    $('#importContacts').show();
    return;
  }
  else
  {
    $('#importContacts').hide();
  }

  $('.contacts').empty();

  s='<table>';
  for(var x=0; x<contacts.length; x++)
  {
    s=s+'<tr><td>';
    if(typeof(contacts[x].image)!==undefined && contacts[x].image!=null && contacts[x].image!='null')
    {
      s=s+'<td><img src="'+contacts[x].image+'"/></td>';
    }
    else
    {
      s=s+'<td><img src="https://wave.google.com/wave/static/images/unknown.jpg"/></td>';
    }
    s=s+'<td><a class="addParticipantButton" href="#" addr="'+contacts[x].email+'">';
    if(typeof(contacts[x].title)!==undefined && contacts[x].title!=null && contacts[x].title!='null')
    {
      s=s+contacts[x].title;
    }
    else
    {
      s=s+contacts[x].email;
    }
    s=s+'</a></td></tr>';
  }
  s=s+'</table>'
  $('.contacts').append(s);
}

function initIndex()
{
  $("#tabs").tabs({'cache': true});
  $("#tabs").show();
  $("#people").show();

  getContacts();
}

$(document).ready(initIndex);
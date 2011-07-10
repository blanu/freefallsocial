from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext.webapp import template

from pages import *

application = webapp.WSGIApplication([
  ('/', IndexPage),
  ('/index.html', IndexPage),
  ('/welcome', WelcomePage),
  ('/login', LoginPage),
  ('/curated', CuratedPage),
  ('/invites', InvitesPage),
  ('/contacts', ContactsPage),
  ('/contacts/auth', AuthPage),
  ('/waves/(.*)', WavePage),
  ('/wave/new', NewWavePage),
  ('/wave/join/(.*)', WaveJoinPage),
  ('/wave/delete/(.*)', DeleteWavePage),
  ('/wave/rename/(.*)', RenameWavePage),
  ('/wave/participants/(.*)', WaveParticipantsPage),
  ('/wave/invites/add/(.*)', WaveAddInvitePage),
  ('/wave/invites/(.*)', WaveInvitesPage),
  ('/wave/gadget/(.*)', WaveGadgetPage),
  ('/gadget/state/(.*)', GadgetStatePage),
  ('/gadget/attachments/(.*)', GadgetAttachmentsPage),
  ('/gadget/scratch/(.*)', GadgetScratchPage),
  ('/gadget/shard/(.*)', GadgetShardPage),
  ('/gadget/blob/(.*)', GadgetBlobPage),
  ('/gadget/upload/(.*)', GadgetUploadPage),
  ('/gadget/attachment/delete/(.*)/(.*)', GadgetAttachmentDeletePage),
  ('/gadget/attachment/(.*)/(.*)', GadgetAttachmentPage),
  ('/gadget/link/add/(.*)', GadgetAddLinkPage),
  ('/gadget/link/(.*)', GadgetLinkPage),
], debug=True)

def main():
  run_wsgi_app(application)

if __name__ == "__main__":
  main()

require 'cloud/app.js'

Parse.Cloud.beforeSave "Task", (request, response) ->
  request.object.set "random", Math.floor((Math.random() * 100) + 1)
  response.success()
  return

Parse.Cloud.beforeSave "Member", (request, reponse) ->
	Parse.Session.current().then (session) ->
		if session.get('restricted')
			response.error('ERROR ERROR ERROR')
	request.object.set "test", 44
	response.success()
	return
  
# Parse.Cloud.beforeSave "User", (request, response) ->
# 	alert "THIS THIS THIS"

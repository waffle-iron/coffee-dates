app.factory 'User', (ParseDefaultUser) ->
	class User extends ParseDefaultUser
		@configure "User", "username", "password", "member"
app.factory 'Member', (Parse) ->
	class Member extends Parse.Model
		@configure "Member", "firstname", "lastname", "email", "capacity", "pending_rushees", "friends", "completed_cds", "date_last_submitted"
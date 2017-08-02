app.factory 'Rushee', (Parse) ->
	class Rushee extends Parse.Model
		@configure "Rushee", "email", "firstname", "lastname", "pending_member", "second_pending_member", "completed_cds", "date_last_completed", "date_last_assigned"
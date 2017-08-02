app.factory 'Report', (Parse) ->
	class Report extends Parse.Model
		@configure "Report", "memberId", "rusheeId", "fields"
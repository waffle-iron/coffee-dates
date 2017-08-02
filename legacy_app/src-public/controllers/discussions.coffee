# Controller for 'admin.html' and 'mothership.html'
app.controller 'DiscussionsCtrl', ($scope, $state, $stateParams, $location, $modal, Parse, Member, Rushee, Report) ->

#******************
# GENERAL SETTINGS
#******************
  # link current User with corresponding Member in database
  checkUserMember = () ->
    # HACK: this is the way I map Users in Parse to the corresponding Member
    Member.find({'where':{'lastname':Parse.auth.currentUser.username}})
      .then (result) ->
        if result.length == 1
          $scope.userMember = result[0]

  averageArray = (arr) ->
    sum = 0
    count = 0
    for sc in arr
      sum += sc
      count += 1
    return sum / count

  setAverages = () ->
    #average scores with some
    [a,b,c,d,count] = [0,0,0,0,0]
    $scope.scores = []
    for r in $scope.reports
      # console.log r.fields
      $scope.fields = r.fields
      for key in Object.keys($scope.fields)
        if typeof $scope.fields[key] is 'number'
          $scope.scores.push($scope.fields[key])
    # final variables
    $scope.average = 0
    $scope.overall = averageArray($scope.scores)
    console.log $scope.scores
    $scope.hall = a
    $scope.meeting = b
    $scope.pb = c
    $scope.date = d


  # check object not already in array by memberId
  shouldAdd = (obj) ->
    memberIds = []
    # console.log $scope.reports
    for each in $scope.reports
      memberIds.push(each.memberId)
    if (obj.memberId in memberIds)
      return false
    return true
  # function called when page first loads, setting all relevant variables
  initializeVariables = () ->
    console.log "initiazing variables..."
    $scope.reports = []
    $scope.member_for_report = {}

    # when discussing a particular rushee
    if $stateParams.rushee
      $scope.rushee = $stateParams.rushee
      $scope.reports = []
      #fill reports
      Report.query({'limit': 1000}).then (reports) ->
        for report in reports
          if (report.rusheeId == $scope.rushee.objectId)
            # console.log report
            if shouldAdd(report)
              # console.log 'adding the above'
              $scope.reports.push(report)
              setAverages()
    else
      $state.go('discussions')

    Rushee.query().then (rushees) ->
      $scope.rushees = rushees


# TODO: reimagine this mode of authorization
  onPageLoad = () ->
    Parse.auth.resumeSession()

    # redirect if not authenticated
    if Parse.auth.currentUser == null
      $state.go('signin')
    else
      # need to login so that there is database access
      $scope.user = Parse.auth.currentUser
      initializeVariables()

  #call onPageLoad once content is loaded
  $scope.$on('$viewContentLoaded', onPageLoad)

#*************
# DISCUSSIONS
#*************

  $scope.discussRushee = (rushee) ->
    console.log "moving to discuss #{rushee.firstname}..."
    $state.go('discussing', {'rushee': rushee})

#TODO: not updating to Parse for whatever reason
  $scope.bid = (candidate) ->
    console.log "AH bid #{candidate.firstname}"
    Rushee.find(candidate.objectId).then (bidded) ->
      console.log "#{bidded.firstname} was bidded"
      bidded.wasBid = true
      bidded.save().then () ->
        console.log "database updated"

#TODO: not updating to Parse for whatever reason
  $scope.hose = (candidate) ->
    console.log "AH hose #{candidate.firstname}"
    Rushee.find(candidate.objectId).then (hosed) ->
      console.log "#{hosed.firstname} was hosed"
      hosed.wasBid = false
      console.log hosed
      hosed.save().then () ->
        console.log "database updated"

  # --------------------
  # hacky report functions
  $scope.summarize = (r) ->
    average = (r.hall + r.meeting + r.pb + r.date) / 4
  $scope.moreReportModal = (report) ->
    # alert report
    infolist =
    Rushee.find(report.rusheeId).then (rushee) ->
      Member.find(report.memberId).then (member) ->
        modalInstance = $modal.open(
          animation: true,
          templateUrl: 'messageModal.html',
          controller: 'ReportInfoCtrl',
          resolve:
            rushee: () ->
              return rushee
            member: () ->
              return member
            report: () ->
              return report
        )

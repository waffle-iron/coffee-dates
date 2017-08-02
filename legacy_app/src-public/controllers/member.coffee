app.controller 'MemberCtrl', ($scope, $stateParams, $state, $modal, Parse, Member, Report, Rushee) ->
  
  # GLOBALS
  # -------
  checkUserMember = () ->
    # TO-DO: change to a get request, and ultimately to a Member pointer
    Member.query({'where':{'lastname':Parse.auth.currentUser.username}})
      .then (result) ->
        if result.length == 1
          $scope.userMember = result[0]
          # console.log "User<->Member relationship established"
          console.log $scope.userMember
  allRushees = () ->
    Rushee.query()
      .then (rushees) ->
        $scope.allrushees = rushees

  onPageLoad = () ->
    # redirect if not authenticated
    if Parse.auth.currentUser == null
      $state.go('signin')
    # if user is authenticated, set user, load rushees, and establish member connection
    else
      # $scope.user = Parse.auth.currentUser
      $scope.allrushees = allRushees()
      checkUserMember()

  # On page load...
  $scope.$on('$viewContentLoaded', onPageLoad)


  # DATES
  # -------
  $scope.newFriend = new Rushee # friend initializiation

  # called when a rushee is selected in dates.html, in the
  # 'potential dates' table
  $scope.knowsRusheeModal = (rushee) ->
    modalInstance = $modal.open(
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'RusheeKnowsCtrl',
      resolve:
        rushee: () ->
          return rushee
        member: () ->
          return $scope.userMember
    )

  # return true if current member knows rushee, false otherwise
  $scope.memberKnowsRushee = (rushee) ->
    # HACK: if the friend array was a Relation, I will
    # not have to use this email validation intermediate
    if $scope.userMember # to prevent running before page load
      # member is friends with rushee
      for friend in $scope.userMember.friends
        if (friend.email is rushee.email)
          return true
      # member has dated rushee
      for dated in $scope.userMember.completed_cds
        if (dated.email is rushee.email)
          return true
      # member is dating rushee
      for dating in $scope.userMember.pending_rushees
        if (dating.email is rushee.email)
          return true
    return false

  # REPORTS
  # -------
  $scope.ranks = [1,2,3,4,5] # possible ranks for report
  $scope.dropdownLabel = "Choose your rushee" # message on dropdown
  $scope.report = new Report # report initializiation
  
  # update dropdown label with the selected rushee
  $scope.updateDropdown = (rushee) ->
    # HACK: doing this by a query, rather than a get request,
    # because of the way that rushees are represented as Parse
    # encoded objects
    Rushee.query({'where':{'email':rushee.email}})
      .then (result) ->
        $scope.dropdownLabel = "#{rushee.firstname} #{rushee.lastname}"
        if result.length == 1 # there is only one rushee found, this is good
          $scope.report.rushee = result[0]
        else
          alert "two rushees have the same email address - send Lachie an email"
      , (err) ->
        alert err

  # called when report is submitted
  $scope.submitReportModal = () ->
    # account for checking rushee selected (as it is not a regular form field)
    if not $scope.report.rushee
      alert "PLEASE SELECT A RUSHEE"
      return

    # convert ranks to numbers from strings
    $scope.report.pb = parseInt($scope.report.pb)
    $scope.report.hall = parseInt($scope.report.hall)
    $scope.report.meeting = parseInt($scope.report.meeting)
    $scope.report.date = parseInt($scope.report.date)
    $scope.report.member = $scope.userMember

    # open modal, which (if confirmed) submits the report
    modalInstance = $modal.open(
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'SubmitReportCtrl',
      resolve:
        report: () ->
          return $scope.report
        rushee: () ->
          return $scope.report.rushee
        member: () ->
          return $scope.userMember
    )
    modalInstance.result
       .then () ->
        # rematch rushees if report has been submitted
        $scope.matchAll()
        $state.reload()

  # SETTINGS
  # -------
  # 
  $scope.changePasswordModal = () ->
    # check passwords are the same
    if $scope.newPassword != $scope.repeatNewPassword
      alert "Your passwords are not the same, try again."
    else
      modalInstance = $modal.open(
        animation: true,
        templateUrl: 'messageModal.html',
        controller: 'PasswordChangeCtrl',
        resolve:
          member: () ->
            return $scope.userMember
          user: () ->
            return Parse.auth.currentUser
          newPassword: () ->
            return $scope.newPassword
      )
      modalInstance.result
       .then () ->
        # console.log "password changed, back in member.coffee"
        $state.reload()

        #****************************
        # Member comparison function
        #****************************
        member_compare = (m1, m2) ->

          # The first metric we are concerned with here is the difference between a member's 
          # capacity for rushees and the number of rushees the member has already pending 
          # --- the number of 'free spots' each member has available. This ensures that
          # members with higher capacities don't get selected against during matching.

          # comp_1 is the difference between the 'free spot' metric for the two members
          # comp_1 = (m2.capacity - m2.pending_rushees.length) - (m1.capacity - m1.pending_rushees.length)

          # console.log "#{m1.lastname} capacity #{m1.capacity}"
          # console.log "#{m1.lastname} pending #{m1.pending_rushees.length}"

          # console.log "#{m2.lastname} capacity #{m2.capacity}"
          # console.log "#{m2.lastname} pending #{m2.pending_rushees.length}"

          # console.log "comp_1 #{comp_1}"

          # comp_2 (breaks tie in comp_1) is how many total coffee dates the member has completed
          # the member who has completed fewer coffee dates will be given the rushee first
          if m1.completed_cds.length < m2.completed_cds.length
            comp_2 = -1
          else if m1.completed_cds.length > m2.completed_cds.length
            comp_2 = 1
          else 
            comp_2 = 0

          # comp_3 is the comparison of the two date_last_submitted values
          # the member who has completed a coffee date least recently will be given  
          # a rushee first
          if m1.date_last_submitted < m2.date_last_submitted
            comp_3 = -1
          else if m1.date_last_submitted > m2.date_last_submitted
            comp_3 = 1
          else
            comp_3 = 0

          # Return final comparison
          comp = comp_2
          if comp_2 == 0
            comp = comp_3

        #****************************
        # Rushee comparison function
        #****************************
        rushee_compare = (r1, r2) ->

          # The first priority comparison is which rushee has had more coffee dates
          comp_1 = r1.completed_cds.length - r2.completed_cds.length

          # The second priority comparison is which rushee had their last cd more recently
          if r1.date_last_completed < r2.date_last_completed
            comp_2 = -1
          else if r1.date_last_completed > r2.date_last_completed
            comp_2 = 1
          else
            comp_2 = 0

          # Return final comparison
          comp = if comp_1 == 0 then comp_2 else comp_1

#********************************************************************
# CONOR'S ALGORITHM
#********************************************************************

  $scope.matchAll = () ->
    console.log "Matching all..."
    matchInfo = []

    Rushee.query().then (rushees) ->
      Member.query().then (members) ->
        # Create arrays of members and rushees that are available for matching
        free_members = (m for m in members when m.pending_rushees.length < m.capacity)
        free_rushees = (r for r in rushees when r.pending_member is null)
        console.log "free_members is #{free_members.length} long"
        console.log "free_members is #{(m.lastname for m in free_members)}"
        console.log "free_rushees is #{free_rushees.length} long"
        console.log "free_rushees is #{(m.lastname for m in free_rushees)}"
        console.log "---------------------------------"

        #********************************************************************
        # Function to match member and rushee by changing all relevant fields
        #********************************************************************
        match = (member, rushee) ->

          # push info to matchInfo dictionary
          matchInfo.push([rushee, member])
          # # Update fields for member
          member.pending_rushees.push(rushee.encodeParse())
          # # Update fields for rushee
          rushee.pending_member = member
          rushee.date_last_submitted = new Date

        #*******************
        # THE MAGIC HAPPENS
        #*******************

        # Use order functions to sort free_member and free_rushee arrays
        free_members.sort(member_compare)
        free_rushees.sort(rushee_compare)

        console.log "free_members is #{(m.lastname for m in free_members)}"
        console.log "free_rushees is #{(m.lastname for m in free_rushees)}"
        console.log "---------------------------------"

        # Match rushees to members in the order that they appear 
        # in the free_rushees array
        for r in free_rushees
          wasAssigned = false
          assignIndex = 0

          for m in free_members
            assignIndex += 1
            if (r.email not in (rush.email for rush in m.friends)) and (m.pending_rushees.length < m.capacity) and (r.email not in (rush.email for rush in m.completed_cds))
              # Call the match() function on m and r to update their fields
              match(m, r) 
              #console.log "#{r.lastname} assigned to #{m.lastname}"
              wasAssigned = true
              break

          start = free_members[0...assignIndex]
          end = free_members[assignIndex..]
          free_members = end.concat start
          
          console.log "free_members is #{(m.lastname for m in free_members)}"


        # update all objects in database
        for rushee in rushees
          rushee.update()
        for member in members
          member.update()

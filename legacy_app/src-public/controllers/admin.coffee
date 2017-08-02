# Controller for 'admin.html' and 'mothership.html'
app.controller 'AdminCtrl', ($scope, $state, $modal, Parse, Member, Rushee, Report) ->

  #****************************
  # Member comparison function
  #****************************
  member_compare = (m1, m2) ->

    # comp_1 is how many total coffee dates the member has completed
    # the member who has completed fewer coffee dates will be given the rushee first
    if m1.completed_cds.length < m2.completed_cds.length
      comp_1 = -1
    else if m1.completed_cds.length > m2.completed_cds.length
      comp_1 = 1
    else 
      comp_1 = 0

    # comp_3 is the comparison of the two date_last_submitted values
    # the member who has completed a coffee date least recently will be given  
    # a rushee first
    if m1.date_last_submitted < m2.date_last_submitted
      comp_2 = -1
    else if m1.date_last_submitted > m2.date_last_submitted
      comp_2 = 1
    else
      comp_2 = 0

    # Return final comparison
    comp = comp_1
    if comp_1 == 0
      comp = comp_2


    # console.log "#{m1.lastname} completed #{m1.completed_cds.length}"
    # console.log "#{m2.lastname} completed #{m2.completed_cds.length}"
    # console.log "comp_1 #{comp_1}"


    # console.log "#{m1.lastname} last date #{m1.date_last_submitted}"
    # console.log "#{m2.lastname} last date #{m2.date_last_submitted}"
    # console.log "comp_2 #{comp_2}"    

    # Return final comparison
    comp = comp_1
    if comp_1 == 0
      comp = comp_2

    # console.log "final comp #{comp}"

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

  # function called when page first loads, setting all relevant variables
  initializeVariables = () ->
    console.log "initiazing variables..."
    $scope.reports = []
    Rushee.query().then (rushees) ->
      # TODO: sort mostRecentRushees according to the order in which 
      #       they will be assigned. Sort function does not consider
      #       whether rushees have a pending_member or not.
      $scope.mostRecentRushees = rushees.sort(rushee_compare)
      # rushees who do not have a date
      $scope.freeRushees = (r for r in rushees when r.pending_member is null)
      # rushees who have no reports
      $scope.undatedRushees = (r for r in rushees when r.completed_cds.length is 0)
    Member.query().then (members) ->
      # all members
      $scope.members = members
      # members who have completed three or more dates
      $scope.excellentMembers = (m for m in members when m.completed_cds.length > 3)
      # members who have not completed any dates
      $scope.poorMembers = (m for m in members when m.completed_cds.length < 1)
      # members whose capacity is currently zero
      $scope.stingyMembers = (m for m in members when m.capacity == 0)
    Report.query().then (reports) ->
      $scope.reports = reports
        
  $scope.summarize = (r) ->
    average = (r.hall + r.meeting + r.pb + r.date) / 4
  $scope.moreReportModal = (report) ->
    # alert report
    infolist = 
    Rushee.find(report.rushee.objectId).then (rushee) ->
      Member.find(report.member.objectId).then (member) ->
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
# TODO: reimagine this mode of authorization      
  onPageLoad = () ->
    Parse.auth.resumeSession()

    # redirect if not authenticated
    if Parse.auth.currentUser == null
      $state.go('signin')
    # if user is authenticated, set user, load rushees, 
    # and establish member connection
    else
      $scope.user = Parse.auth.currentUser
      checkUserMember()
      initializeVariables()

  #call onPageLoad once content is loaded
  $scope.$on('$viewContentLoaded', onPageLoad)

  # general function that is called when one of the 
  # descriptive metrics at the top of the admin page
  # is clicked.
  $scope.listInfoModal = (infolist, header) ->
    modalInstance = $modal.open(
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'ListInfoCtrl',
      resolve:
        infolist: () ->
          return infolist
        header: () ->
          return header
    )
#******************
# ADMIN PAGE
#******************
# Rushees
# ---------------
  # initialize scope variable for adding new 
  # rushee form
  $scope.newRushee = new Rushee

  # executed on 'Add Rushee' UI form
  $scope.saveNewRushee = () ->
    $scope.newRushee.completed_cds = []
    $scope.newRushee.pending_members = []
    $scope.newRushee.pending_member = null
    $scope.newRushee.second_pending_member = null
    $scope.newRushee.save().then (newRushee) ->
      $state.reload()
  
  # $scope.cancel = () ->
  #   $modalInstance.dismiss('cancel')
  #   $state.reload()

  # executed when the 'x' on a rushee is clicked
  $scope.deleteRusheeModal = (rushee) ->
    modalInstance = $modal.open(
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'RusheeDeleteCtrl',
      resolve:
        rushee: () ->
          return rushee
    )
    modalInstance.result
      .then (deletedRushee) ->
        # console.log "modal is working"
        console.log "deleted #{deletedRushee}"
        $state.reload()

  # called when the eject UI element (the penultimate
  # glyphicon on the right of each rushee in the table)
  # is clicked.
  $scope.reassignRusheeModal = (rushee) ->
    modalInstance = $modal.open(
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'RusheeReassignCtrl',
      resolve:
        rushee: () ->
          return rushee
    )
    modalInstance.result
      .then () ->
        rushee.pending_member = null
        rushee.save().then (result) ->
          # console.log result
          $scope.matchAll() #rematch after pop
          $state.reload()

  # called when a rushee in the table is clicked
  $scope.moreRusheeModal = (rushee) ->
    modalInstance = $modal.open(
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'RusheeMoreCtrl',
      resolve:
        rushee: () ->
          return rushee
    )

# Members
# ---------------
  # called when the change UI element (on the right
  # of each member in the table) is clicked.
  $scope.changeMemberModal = (member) ->
    modalInstance = $modal.open(
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'MemberChangeCtrl',
      resolve:
        member: () ->
          return member
    )

  # called when a member in the table is clicked
  $scope.moreMemberModal = (member) ->
    modalInstance = $modal.open(
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'MemberMoreCtrl',
      resolve:
        member: () ->
          return member
    )

#******************
# MOTHERSHIP PAGE
#******************
  # function that removes a rushee from a
  # member, used when rushee is deleted or poped
  $scope.removeRusheeFromMember = (rushee, member) ->
    console.log "we are here simao qui"
    # for each, index in $scope.userMember.pending_rushees
    #   console.log "rushee is #{each.lastname}, index is #{index}"
    #   if each.lastname is rushee.lastname
    #     console.log "DELETE"
    #     $scope.userMember.pending_rushees.splice(index, 1)
    #     console.log (m.lastname for m in $scope.userMember.pending_rushees)
    #     $scope.userMember.update()

  # register new user. NB: small change made in angular-parse.js
  # library, so that creation of user does not log that user in.
  $scope.register = () ->
    Parse.auth.register($scope.newMember.lastname, 'blood95').then ->
      console.log "newMember registered with lastname, #{newMember.lastname}, and password, blood95"
      $state.reload()
    , (err) ->
      $scope.errorMessage = err.data.error

  # create member. this function synchronously calls
  # register, after member has been created.
  $scope.createMember = () ->
    $scope.newMember.pending_rushees = []
    $scope.newMember.completed_cds = []
    $scope.newMember.friends = []
    # initial capacity is 0: member will not be assigned dates   
    $scope.newMember.capacity = 0
    $scope.newMember.save().then (result) ->
      console.log "New Member, #{$scope.newMember.firstname} #{$scope.newMember.lastname} created"
      # create corresponding user
      Parse.auth.register($scope.newMember.lastname, 'blood95').then ->
        console.log "new User registered with lastname, #{$scope.newMember.lastname}, and password, blood95"
        $scope.newMember = new Member # reset newMember
        $state.reload()
      , (err) ->
        $scope.errorMessage = err.data.error

  # assigns rushee to member, irrespective of member's
  # capacity. Connection to database is specified through
  # email.
  $scope.assignRushee = () ->
    console.log "we made it"
    Rushee.query({'where':{'email':$scope.rusheeEmail}})
      .then (rushee_response) ->
        if rushee_response.length == 1
          rushee = rushee_response[0]
          Member.query({'where':{'email':$scope.memberEmail}})
            .then (member_response) ->
              if member_response.length == 1
                member = member_response[0]
                # rushee and member found, assign rushee to member
                rushee.pending_member = member
                # rushee.pending_members.push({ id: member.objectId })
                fullRushee = rushee.encodeParse()
                member.pending_rushees.push({
                  firstname: fullRushee.firstname,
                  lastname: fullRushee.lastname,
                  email: fullRushee.email,
                  objectId: fullRushee.objectId
                })
                rushee.update().then ->
                  member.update().then ->
                    console.log "#{rushee.firstname} #{rushee.lastname} assigned to #{member.lastname}."
                    $state.reload()
              else
                alert "WRONG MEMBER EMAIL"
        else
          alert "WRONG RUSHEE EMAIL"

# Members
# ---------------

  $scope.newMember = new Member


# Initializing and Ending Rush
# ----------------------------
  $scope.caps = [0, 1, 2, 3]
  $scope.setCap = (cap) ->
    $scope.capacity = cap

  $scope.setCapacitiesAndRun = (run_is_true) ->
    # HACK: trying to work in a 'setAll' capacity UI in mothership
    if $scope.capacity is undefined
      alert "You have not selected a capacity"
      return
    cap = parseInt($scope.capacity)

    Member.query().then (members) ->
      memberCount = 0
      for member in members
        member.capacity = cap
        member.update().then ->
          memberCount += 1
  
          # run matchAll once capacities have been updated
          if memberCount == members.length
            if run_is_true
              $scope.matchAll()
            else
              alert "All member's capacities updated to #{$scope.capacity}.
                      There may be space for more dates to be assigned."

  # confirm modal for begging rush
  $scope.beginRushModal = () ->
    modalInstance = $modal.open(
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'RushBeginCtrl',
    )
    modalInstance.result
      .then (success) ->
        # HACK: trying to work in a 'setAll' capacity UI in mothership
        $scope.capacity = "1"
        $scope.setCapacitiesAndRun(true)

  # function that wipes database.
  clearAll = () ->
    console.log "clearing database..."
    Rushee.query().then (rushees) ->
      for rushee in rushees
          rushee.completed_cds = []
          rushee.pending_member = null
          rushee.second_pending_member = null
          rushee.date_last_completed = null
          rushee.update().then ->
            console.log "Rushee cleared"

    Member.query().then (members) ->
      for member in members
          member.completed_cds = []
          # member.friends = []
          member.pending_rushees = []
          member.date_last_submitted = null
          member.capacity = 0
          member.update().then ->
            console.log "Member cleared"

  # modal for wiping database.
  $scope.resetRushModal = () ->
    modalInstance = $modal.open(
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'RushResetCtrl',
    )
    modalInstance.result
      .then (success) ->
        console.log "clearing all..."
        clearAll()

#********************************************************************
# CONOR'S ALGORITHM
#********************************************************************

  $scope.matchAll = () ->
    console.log "Matching all..."
    console.log "We are in here"
    matchInfo = []

    Rushee.query().then (rushees) ->
      Member.query().then (members) ->
        # Create arrays of members and rushees that are available for matching
        free_members = (m for m in members when m.pending_rushees.length < m.capacity)
        free_rushees = (r for r in rushees when ((r.completed_cds.length == 2 and (not r.pending_member and not r.second_pending_member)) or (r.completed_cds.length < 2 and (not r.pending_member or not r.second_pending_member))))
        
        missing_rushees = (r for r in rushees when (r.completed_cds.length == 0))
        weird_algo_rushees = (r for r in rushees when (r.completed_cds.length == 0 and (not r.pending_member or not r.second_pending_member)))
        # console.log "free_members is #{free_members.length} long"
        # console.log "free_members is #{(m.lastname for m in free_members)}"
        # console.log "free_rushees is #{free_rushees.length} long"
        # console.log "free_rushees is #{(m.lastname for m in free_rushees)}"
        # console.log "---------------------------------"
        # console.log missing_rushees
        console.log missing_rushees

        #********************************************************************
        # Function to match member and rushee by changing all relevant fields
        #********************************************************************
        match = (member, rushee) ->
          # console.log "matched #{member.lastname} to #{rushee.lastname}"
          # push info to matchInfo dictionary
          matchInfo.push([rushee, member])
          # # Update fields for member
          fullRushee = rushee.encodeParse()
          member.pending_rushees.push({
            email: fullRushee.email,
            firstname: fullRushee.firstname,
            lastname: fullRushee.lastname,
          })
          # # Update fields for rushee
          if (not rushee.pending_member)
            rushee.pending_member = member
          else #if rushee.pending_member.objectId is not member.objectId
            rushee.second_pending_member = member
          rushee.date_last_submitted = new Date

        #*******************
        # THE MAGIC HAPPENS
        #*******************

        # Use order functions to sort free_member and free_rushee arrays
        free_members.sort(member_compare)
        free_rushees.sort(rushee_compare)

        # console.log "sorted free_members is #{(m.lastname for m in free_members)}"
        # console.log "sorted free_rushees is #{(m.lastname for m in free_rushees)}"
        # console.log "---------------------------------"

        # Match rushees to members in the order that they appear 
        # in the free_rushees array
        for r in free_rushees
          wasAssigned = false
          assignIndex = 0

          for m in free_members
            assignIndex += 1
            # console.log r.pending_member
            if (r.email not in (rush.email for rush in m.friends)) and (m.pending_rushees.length < m.capacity) and (r.email not in (rush.email for rush in m.completed_cds))
              # Call the match() function on m and r to update their fields
              if (not r.pending_member) or (r.pending_member.objectId != m.objectId)
                match(m, r) 
                #console.log "#{r.lastname} assigned to #{m.lastname}"
                wasAssigned = true
              break

          start = free_members[0...assignIndex]
          end = free_members[assignIndex..]
          free_members = end.concat start
          
        # count to open modal when all is updated
        memberCount = 0
        # update all objects in database
        for rushee in rushees
          rushee.update()
        for member in members
          member.update().then ->
            memberCount += 1
            # open info match modal when all is updated
            if memberCount == members.length
              modalInstance = $modal.open(
                animation: true,
                templateUrl: 'messageModal.html',
                controller: 'MatchInfoCtrl',
                resolve:
                  matchinfo: () ->
                    return matchInfo
                  header: () ->
                    return "Rushees assigned to Members"
              )


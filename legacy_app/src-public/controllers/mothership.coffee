app.controller 'MothershipCtrl', ($scope, $state, $modal, Parse, Member, Rushee) ->
  $scope.tagline = "We are in Mothership Control"

  $scope.removeRusheeFromMember = (rushee, member) ->
    for each, index in $scope.userMember.pending_rushees
      console.log "rushee is #{each.lastname}, index is #{index}"
      if each.lastname is rushee.lastname
        console.log "DELETE"
        $scope.userMember.pending_rushees.splice(index, 1)
        console.log (m.lastname for m in $scope.userMember.pending_rushees)
        $scope.userMember.update()

  # TODO: make this a global function in app.js, as it is duplicated here at the moment.
  checkUserMember = () ->
    # TO-DO: change to a get request, and ultimately to a Member pointer
    Member.query({'where':{'lastname':Parse.auth.currentUser.username}})
      .then (result) ->
        if result.length == 1
          $scope.userMember = result[0]
          console.log "User<->Member relationship established"
          console.log $scope.userMember
    
# TODO: reimagine this mode of authorization      
  onPageLoad = () ->
    Parse.auth.resumeSession()

    # redirect if not authenticated
    if Parse.auth.currentUser == null
      $state.go('signin')
    # if user is authenticated, set user, load rushees, and establish member connection
    else
      $scope.user = Parse.auth.currentUser
      checkUserMember()
  #call onPageLoad once content is loaded
  $scope.$on('$viewContentLoaded', onPageLoad)


  $scope.createMember = () ->
    $scope.newMember.pending_rushees = []
    $scope.newMember.completed_cds = []
    $scope.newMember.friends = []
    # initial capacity is 0: member will not be assigned dates   
    $scope.newMember.capacity = 0
    $scope.newMember.save().then (result) ->
      console.log "New Member, #{$scope.newMember.firstname} #{$scope.newMember.lastname} created"
      $scope.newMember = new Member
      $state.reload()

  # $scope.assignRushee = () ->
  #   console.log "STARTING"
  #   Rushee.query({'where':{'email':$scope.rusheeEmail}})
  #     .then (rushee_response) ->
  #       if rushee_response.length == 1
  #         console.log "wwe are here"
  #         # rushee = rushee_response[0]
  #         # Member.query({'where':{'email':$scope.memberEmail}})
  #         #   .then (member_response) ->
  #         #     if member_response.length == 1
  #         #       member = member_response[0]
  #         #       # rushee and member found, assign rushee to member
  #         #       # if rushee.pending_members is undefined
  #         #       #   console.log 'setting pending_members'
  #         #       #   rushee.set('pending_members', [])
  #         #       console.log rushee.pending_members
  #         #       # rushee.pending_members.push(member.encodeParse())
  #         #       member.pending_rushees.push(rushee.encodeParse())
  #         #       rushee.update().then ->
  #         #         member.update().then ->
  #         #           console.log "#{rushee.firstname} #{rushee.lastname} assigned to #{member.lastname}."
  #         #           $state.reload()

  #       else
  #         console.log "WRONG EMAIL"

# Rushees
# ---------------

  $scope.moreMemberModal = (member) ->
    modalInstance = $modal.open(
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'MemberMoreCtrl',
      resolve:
        member: () ->
          return member
    )

  $scope.newRushee = new Rushee

# Members
# ---------------
  $scope.newMember = new Member

  $scope.getMembers = () ->
    Member.query()
      .then (members) ->
        $scope.members = members

# Initializing and Ending
# -----------------------
  $scope.caps = [0, 1, 2, 3]

  $scope.setCapacitiesAndRun = () ->
    cap = parseInt($scope.capacity)
    console.log cap
    console.log $scope.capacity
    Member.query().then (members) ->
      memberCount = 0
      for member in members
        member.capacity = cap
        member.update().then ->
          memberCount += 1
          console.log "Member capacity updated to #{cap}"
          console.log "memberCount is #{memberCount}"
          console.log "#{members.length}"
          # run matchAll once capacities have been updated
          if memberCount == members.length
            # console.log "happening..."
            $scope.matchAll()

  $scope.beginRushModal = () ->
    modalInstance = $modal.open(
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'RushBeginCtrl',
    )
    modalInstance.result
      .then (success) ->
        console.log "matching all..."
        $scope.capacity = "1"
        $scope.setCapacitiesAndRun()

  clearAll = () ->
    console.log "clearing database..."
    Rushee.query().then (rushees) ->
      for rushee in rushees
          rushee.pending_member = null
          rushee.second_pending_member = null
          rushee.pending_members = []
          rushee.completed_cds = []
          rushee.date_last_completed = null
          rushee.update().then ->
            console.log "Rushee cleared"

    Member.query().then (members) ->
      for member in members
          member.completed_cds = []
          member.friends = []
          member.pending_rushees = []
          member.date_last_submitted = null
          member.capacity = 0
          member.update().then ->
            console.log "Member cleared"

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
    # matchInfo = []

    # Rushee.query().then (rushees) ->
    #   Member.query().then (members) ->
    #     # Create arrays of members and rushees that are available for matching
    #     free_members = (m for m in members when m.pending_rushees.length < m.capacity)
    #     free_rushees = (r for r in rushees when r.pending_member is null)
    #     console.log "free_members is #{free_members.length} long"
    #     console.log "free_members is #{(m.lastname for m in free_members)}"
    #     console.log "free_rushees is #{free_rushees.length} long"
    #     console.log "free_rushees is #{(m.lastname for m in free_rushees)}"
    #     console.log "---------------------------------"

    #     #********************************************************************
    #     # Function to match member and rushee by changing all relevant fields
    #     #********************************************************************
    #     match = (member, rushee) ->

    #       # push info to matchInfo dictionary
    #       matchInfo.push([rushee, member])
    #       # # Update fields for member
    #       member.pending_rushees.push(rushee.encodeParse())
    #       # # Update fields for rushee
    #       rushee.pending_member = member
    #       rushee.date_last_submitted = new Date

    #     #*******************
    #     # THE MAGIC HAPPENS
    #     #*******************

    #     # Use order functions to sort free_member and free_rushee arrays
    #     free_members.sort(member_compare)
    #     free_rushees.sort(rushee_compare)

    #     console.log "free_members is #{(m.lastname for m in free_members)}"
    #     console.log "free_rushees is #{(m.lastname for m in free_rushees)}"
    #     console.log "---------------------------------"

    #     # Match rushees to members in the order that they appear 
    #     # in the free_rushees array
    #     for r in free_rushees
    #       wasAssigned = false
    #       assignIndex = 0

    #       for m in free_members
    #         assignIndex += 1
    #         if (r.email not in (rush.email for rush in m.friends)) and (m.pending_rushees.length < m.capacity) and (r.email not in (rush.email for rush in m.completed_cds))
    #           # Call the match() function on m and r to update their fields
    #           match(m, r) 
    #           #console.log "#{r.lastname} assigned to #{m.lastname}"
    #           wasAssigned = true
    #           break

    #       start = free_members[0...assignIndex]
    #       end = free_members[assignIndex..]
    #       free_members = end.concat start
          
    #       console.log "free_members is #{(m.lastname for m in free_members)}"
          
    #     # count to open modal when all is updated
    #     memberCount = 0
    #     # update all objects in database
    #     for rushee in rushees
    #       rushee.update()
    #     for member in members
    #       member.update().then ->
    #         memberCount += 1
    #         console.log "member count is #{memberCount}"
    #         # open info match modal when all is updated
    #         if memberCount == members.length
    #           modalInstance = $modal.open(
    #             animation: true,
    #             templateUrl: 'messageModal.html',
    #             controller: 'MatchInfoCtrl',
    #             resolve:
    #               matchinfo: () ->
    #                 return matchInfo
    #               header: () ->
    #                 return "Rushees assigned to Members"
    #           )

    # console.log "Members and Rushees updated"


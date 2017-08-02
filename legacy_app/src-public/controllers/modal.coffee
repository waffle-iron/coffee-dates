# *********************
# ALL MODAL CONTROLLERS
# *********************

# Report Info Modal
# -----------------
app.controller 'ReportInfoCtrl', ($scope, $modalInstance, rushee, member, report) ->
    # UI elements
    $scope.message = "#{member.firstname} #{member.lastname}'s Report on #{rushee.firstname} #{rushee.lastname}"
    $scope.lines = ["Vibes Score: #{report.fields.vibes}",
                    "Contributions Score: #{report.fields.contributions}",
                    "Enthusiasm Score: #{report.fields.enthusiasm}",
                    "Honesty Score: #{report.fields.honesty}",
                    "Listener Score: #{report.fields.listener}",
                    "Date Description: #{report.fields.dateDesc}",
                    "Circumstance: #{report.fields.circumstances}"
                  ]
    $scope.executeMessage = "Ok"

    $scope.cancel = () ->
        $modalInstance.dismiss('cancel')

    $scope.execute = () ->
        $modalInstance.dismiss('cancel')

# Infolist Modal
# -----------------
app.controller 'ListInfoCtrl', ($scope, $modalInstance, infolist, header) ->
    # UI elements
    $scope.message = header
    $scope.lines = ("#{e.firstname} #{e.lastname}" for e in infolist)
    $scope.executeMessage = "Ok"

    $scope.cancel = () ->
        $modalInstance.dismiss('cancel')

    $scope.execute = () ->
        $modalInstance.dismiss('cancel')

# Info Match Modal
# -----------------
app.controller 'MatchInfoCtrl', ($scope, $modalInstance, header, matchinfo) ->
    # UI elements
    $scope.message = header
    # TODO: there's probably a cleaner way to do this list comprehension
    $scope.lines = ("#{pair[0].firstname} #{pair[0].lastname} assigned to #{pair[1].firstname} #{pair[1].lastname}" for pair in matchinfo)
    $scope.executeMessage = "Ok"

    $scope.cancel = () ->
        $modalInstance.dismiss('cancel')

    $scope.execute = () ->
        $modalInstance.dismiss('cancel')

# Rushee Delete Modal
# -----------------
app.controller 'RusheeDeleteCtrl', ($scope, $modalInstance, rushee, Member) ->
    # UI elements
    $scope.message = "Are you sure you want to delete 
        #{rushee.firstname} #{rushee.lastname}? This action 
        can't be reversed, so don't come crying to me, Sam."
    $scope.executeMessage = "Delete #{rushee.firstname} #{rushee.lastname}"

    $scope.cancel = () ->
        $modalInstance.dismiss('cancel')

    $scope.execute = () ->
        # remove record of rushee from all members
        Member.query().then (members) ->
          for member in members
            # remove rushee from pending rushees
            for each, index in member.pending_rushees
              if each.email is rushee.email
                member.pending_rushees.splice(index, 1)
                member.update()
            # TODO: rushee can stay in friends and completed dates, as it won't effect?
        rushee.destroy().then (deletedRushee) ->
            console.log "#{deletedRushee.firstname} was deleted in modal controller"
            $modalInstance.close(deletedRushee)

# Rushee More Modal
# -----------------
app.controller 'RusheeMoreCtrl', ($scope, $modalInstance, rushee, Member) ->
    $scope.rushee = rushee
    updateUIwithMember = (member) ->
        console.log "updating UI with member"
        $scope.pendingDate = "#{member.firstname} #{member.lastname}"
        $scope.completedDates = ""
        for date in $scope.rushee.completed_cds
            Member.find(date).then (result) ->
                $scope.completedDates = "#{result.firstname} #{result.lastname}, #{$scope.completedDates}"
                $scope.lines = ["#{rushee.email}",
                                "Completed Dates = #{$scope.completedDates}",
                                "Pending Date = #{$scope.pendingDate}"]
        $scope.lines = ["#{rushee.email}",
                                "Completed Dates = #{$scope.completedDates}",
                                "Pending Date = #{$scope.pendingDate}"] 

    updateUI = () ->
        console.log "updating UI with no argument"
        $scope.pendingDate = "None."
        $scope.completedDates = ""
        for date in $scope.rushee.completed_cds
            Member.find(date).then (result) ->
                console.log "found member"
                $scope.completedDates = "#{result.firstname} #{result.lastname}, #{$scope.completedDates}"
                $scope.lines = ["#{rushee.email}",
                                "Completed Dates = #{$scope.completedDates}",
                                "Pending Date = #{$scope.pendingDate}"]
        $scope.lines = ["#{rushee.email}",
                                "Completed Dates = #{$scope.completedDates}",
                                "Pending Date = #{$scope.pendingDate}"]

    $scope.pendingDate = ""
    # TODO: streamline the loading of this modal, so that there isn't the weird little jump
    if rushee.pending_member
        console.log "UPDATING WITH MEMBER"
        Member.find(rushee.pending_member.objectId).then (member) ->
            console.log "found member"
            console.log member
            updateUIwithMember(member)
    else
        updateUI()

        # $scope.pendingDate = "... this isn't working yet"

    # TODO: am not able to populated rushee.completed_cd's with objects for some reason, so just passing names

    # UI elements
    # TODO: this isn't working yet, because rushee.completed_cds is not appropriately updated
    $scope.message = "#{rushee.firstname} #{rushee.lastname}"
    $scope.executeMessage = "Ok"

    $scope.cancel = () ->
        $modalInstance.dismiss('cancel')

    $scope.execute = () ->
        $modalInstance.dismiss('cancel')


# Member More Modal
# -----------------
app.controller 'MemberMoreCtrl', ($scope, $modalInstance, member) ->
    $scope.member = member

    $scope.listedFriends = ""
    for friend in $scope.member.friends
        $scope.listedFriends = "#{friend.firstname} #{friend.lastname}, #{$scope.listedFriends}"

    $scope.completedDates = ""
    for date in $scope.member.completed_cds
        $scope.completedDates = "#{date.firstname} #{date.lastname}, #{$scope.completedDates}"

    $scope.pendingDates = ""
    for date in $scope.member.pending_rushees
        $scope.pendingDates = "#{date.firstname} #{date.lastname}, #{$scope.pendingDates}"

    # UI elements
    $scope.message = "#{member.firstname} #{member.lastname}"
    $scope.lines = ["Completed Dates = #{$scope.completedDates}",
                    "Pending Dates = #{$scope.pendingDates}"]
    $scope.executeMessage = "Ok"

    $scope.cancel = () ->
        $modalInstance.dismiss('cancel')

    $scope.execute = () ->
        $modalInstance.dismiss('cancel')

# Change Member Modal
# -----------------
app.controller 'MemberChangeCtrl', ($scope, $modalInstance, member) ->
    # UI elements
    $scope.message = "#{member.firstname} #{member.lastname}'s capacity is currently #{member.capacity}"
    $scope.lines = ["If you hit 'Cancel' it will decrease #{member.firstname} #{member.lastname}'s capacity. It's just weird because I am hacking and don't want to change this.",
                    "Click outside the modal to dismiss this screen."]
    $scope.executeMessage = "+1"

    $scope.cancel = () ->
        if member.capacity is 0
            alert "You can't decrease this capacity, it's zero."
        else
            member.capacity = member.capacity-1
            member.update().then ->
                console.log "Capacity increased"
                $scope.message = "#{member.firstname} #{member.lastname}'s capacity is currently #{member.capacity}"

    $scope.execute = () ->
        member.capacity = member.capacity+1
        member.update().then ->
            console.log "Capacity increased"
            $scope.message = "#{member.firstname} #{member.lastname}'s capacity is currently #{member.capacity}"

# Know Rushee Modal
# -----------------
# TODO:
  # needing to make this query a get request, instead
  # then encode rushee in Parse speak using a Pointer,
  # rather than encodeParse()
app.controller 'RusheeKnowsCtrl', ($scope, $modalInstance, rushee, member) ->
    # $scope.rushee = rushee
    # UI elements
    $scope.message = "Do you definitely know 
        #{rushee.firstname} #{rushee.lastname}? Once
        you confirm, you will not be up for a coffee date with
        this person at any stage during the rush process."
    $scope.executeMessage = "I know #{rushee.firstname} #{rushee.lastname}"

    $scope.cancel = () ->
        $modalInstance.dismiss('cancel')

    $scope.execute = () ->
        # TODO: should do some checks here
        member.friends.push(rushee.encodeParse())
        member.save().then ->
            console.log "#{rushee.firstname} added to #{member.firstname}'s friends"
        $modalInstance.close(rushee)

# Reassign Rushee Modal
# -----------------
app.controller 'RusheeReassignCtrl', ($scope, $modalInstance, Member, rushee) ->
    # $scope.rushee = rushee
    reassignMessage = () ->
        if rushee.pending_member isnt null
            return "Do you want to pop
                #{rushee.firstname} #{rushee.lastname}? Once
                you confirm, this person will be evicted from his/her current
                date, and fed back into the assignment queue."
        else
            $scope.executeMessage = "Ok"
            return "Cannot reassign -- #{rushee.firstname} #{rushee.lastname} is not currently assigned to a member."

    # UI elements
    $scope.executeMessage = "Pop #{rushee.firstname} #{rushee.lastname}"
    $scope.message = reassignMessage()

    $scope.cancel = () ->
        $modalInstance.dismiss('cancel')

    # HACK: function repeated here, not sure how secure global functions are in angular controllers
    removeRusheeFromMember = (rushee, member) ->
      for each, index in member.pending_rushees
        console.log each
        if each.email is rushee.email
          member.pending_rushees.splice(index, 1)
          # don't think this call is necessary, but just in case
          member.update()

    reassignRushee = () ->
        id = rushee.pending_member.objectId
        Member.find(id)
            .then (member) ->
                console.log "updating member..."
                removeRusheeFromMember(rushee, member)
                # add rushee to that member's friends, so that the
                # assignment won't be made again
                member.friends.push(rushee.encodeParse())
                member.update().then ->
                    $modalInstance.close()
                

    $scope.execute = () ->
        if rushee.pending_member isnt null
            console.log "reassigning rushee..."
            reassignRushee(rushee)
        else
            $modalInstance.dismiss()

# Password Change Modal
# ---------------------
app.controller 'PasswordChangeCtrl', ($scope, $modalInstance, member, user, newPassword) ->
    # UI elements
    $scope.message = "Are you sure you want to change your password?
                        Don't come crying to me when you forget it."
    $scope.executeMessage = "Change Password"

    $scope.cancel = () ->
        $modalInstance.dismiss('cancel')

    $scope.execute = () ->
        # TODO: should do some checks here
        console.log "changing password..."
        console.log "user is #{user.username}"
        user.password = newPassword
        user.save().then ->
            console.log "Password changed. New password is #{newPassword}"
            $modalInstance.close()

# Submit Report Modal
# ---------------------
app.controller 'SubmitReportCtrl', ($scope, $modalInstance, report, rushee, member) ->
    # UI elements
    $scope.message = "Are you sure you want to submit this report? You will not be able to submit 
                        another report for this rushee once you confirm this action."
    $scope.executeMessage = "Submit Report"

    $scope.cancel = () ->
        $modalInstance.dismiss('cancel')

    #TODO: this is a huge hack.
    finish = (rushee, member) ->
        #stagger updates, so that when modal is closed, algorithm is reading relevant fields
        rushee.update().then ->
          member.update().then ->
              $modalInstance.close()

    removeRusheeFromMember = (rushee, member) ->
      for each, index in member.pending_rushees
        if each.lastname is rushee.lastname
          member.pending_rushees.splice(index, 1)
          # don't think this call is necessary, but just in case
          member.update().then ->
            finish(rushee, member)

    $scope.execute = () ->
        # TODO: should do some checks here
        console.log "submitting report..."
        report.save().then (report) ->
          # TODO: rushee.completed_cds really doesn't want to update with proper members for some reason..
          rushee.completed_cds.push(member.objectId) # HACK: is unable to convert member to object, because of circular reference
          rushee.date_last_completed = new Date
          # TODO: this needs to call conor's algorithm and update pending users
          # at the moment it just reassigns pending_member to the current user
          rushee.pending_member = null

          # update member values
          member.completed_cds.push(rushee.encodeParse())
          member.date_last_submitted = new Date

          removeRusheeFromMember(rushee, member)

# Rush Begin Modal
# ---------------------
app.controller 'RushBeginCtrl', ($scope, $modalInstance) ->
    # UI elements
    $scope.message = "Are you sure you want to begin Rush? This will set all
                        member's capacities to one, meaning that each member
                        will be assigned one coffee date. Once
                        a member submits a report for a coffee date, dates 
                        will automatically be reassigned.
                        You can change member's capacities in the 'Admin' tab,
                        and then manually assign rushees to members with the 
                        first button above."
    $scope.executeMessage = "Begin Rush"

    $scope.cancel = () ->
        $modalInstance.dismiss('cancel')

    $scope.execute = () ->
        $modalInstance.close()

# Rush Reset Modal
# ---------------------
app.controller 'RushResetCtrl', ($scope, $modalInstance) ->
    # UI elements
    $scope.message = "Are you sure you want to reset Rush? This will clean
                        all members and rushees and coffee dates, friends,
                        and all other characteristics in the database. (It 
                        will not delete members and rushees)."
    $scope.executeMessage = "Reset Rush"

    $scope.cancel = () ->
        $modalInstance.dismiss('cancel')

    $scope.execute = () ->
        # TODO: should do some checks here
        $modalInstance.close()
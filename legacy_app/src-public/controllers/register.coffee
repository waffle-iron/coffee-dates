app.controller 'RegisterCtrl', ($location, $state, $window, $scope, Parse) ->
  $scope.auth = Parse.auth
  $scope.user = {}
  $scope.errorMessage = null

  $scope.register = (user) ->
    if user.password isnt user.passwordConfirm
      return $scope.errorMessage = "Passwords must match"

    unless user.username and user.password
      return $scope.errorMessage = 'Please supply a username and password'

    Parse.auth.register(user.username, user.password).then ->
      console.log "user registered with username, #{user.username}, and password, #{user.password}"
      $state.reload()
    , (err) ->
      $scope.errorMessage = err.data.error
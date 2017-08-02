app.controller 'SignInCtrl', ($location, $window, $scope, Parse) ->
  $scope.auth = Parse.auth
  $scope.user = {}
  $scope.errorMessage = null

  $scope.signin = (user) ->
    unless user.username and user.password
      return $scope.errorMessage = 'Please supply a username and password'

    Parse.auth.login(user.username, user.password).then ->
      console.log 'Logged in', arguments
      $location.path("/member")
    , (err) ->
      console.log 'Logged out', arguments
      $scope.errorMessage = err.data.error

app.controller 'AuthCtrl', ($scope, Parse) ->
  $scope.auth = Parse.auth
  $scope.signout = ->
    Parse.auth.logout()
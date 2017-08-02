'use strict'

app = angular.module 'angularParseBoilerplate', [
  'ng'
  'ngResource'
  'ui.router'
  'ui.bootstrap'
  'app.templates'
  'Parse'
  'angulartics'
  'angulartics.google.analytics'
]

app.run (Parse, $location, $window) ->
  # Signout of current member's login on reload or
  # window close
  signout = () ->
    # Parse.auth.logout()
    $state.reload()
  # $window.onbeforeunload = signout

  # check authentication, redirect to sign in page
  # if not authenticated.
  # Parse.auth.resumeSession().then ->
  #   console.log "Authenticated."
  # , (err) ->
  #   $location.path('/signin')


app.config (
  $locationProvider
  $stateProvider
  $urlRouterProvider
  ParseProvider
) ->

  ## States
  ## ------
  $stateProvider

  .state 'signin',
    url: '/signin'
    controller: 'SignInCtrl'
    templateUrl: 'signin.html'

  # member pages
  .state 'member',
    url: '/member'
    controller: 'MemberCtrl'
    templateUrl: 'member.html'

  .state 'dates',
    url: '/dates',
    controller: 'MemberCtrl'
    templateUrl: 'dates.html'

  .state 'report',
    url: '/report',
    controller: 'MemberCtrl'
    templateUrl: 'report.html'

  .state 'settings',
    url: '/settings',
    controller: 'MemberCtrl'
    templateUrl: 'settings.html'

  # admin pages
  .state 'admin',
    url: '/admin',
    controller: 'AdminCtrl'
    templateUrl: 'admin.html'

  .state 'mothership',
    url: '/mothership',
    controller: 'AdminCtrl'
    templateUrl: 'mothership.html'

  # discussions
  .state 'discussions',
    url: '/discussions',
    controller: 'DiscussionsCtrl'
    templateUrl: 'discussions.html'

  .state 'discussing',
    url: '/discussing',
    controller: 'DiscussionsCtrl'
    templateUrl: 'discussing.html'
    params: { rushee: false }

  #outdated
  .state 'register',
    url: '/register'
    controller: 'RegisterCtrl'
    templateUrl: 'register.html'

  $urlRouterProvider.otherwise 'member'

  ParseProvider.initialize(
    "8683A294D744F6A55879C13E8374A", # Application ID
    "XgsxILrjVR2v45f7a43gY9VfV60WFMGp"  # REST API Key
  )

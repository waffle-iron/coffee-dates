'use strict';
var app;

app = angular.module('angularParseBoilerplate', ['ng', 'ngResource', 'ui.router', 'ui.bootstrap', 'app.templates', 'Parse', 'angulartics', 'angulartics.google.analytics']);

app.run(function(Parse, $location, $window) {
  var signout;
  return signout = function() {
    return $state.reload();
  };
});

app.config(function($locationProvider, $stateProvider, $urlRouterProvider, ParseProvider) {
  $stateProvider.state('signin', {
    url: '/signin',
    controller: 'SignInCtrl',
    templateUrl: 'signin.html'
  }).state('member', {
    url: '/member',
    controller: 'MemberCtrl',
    templateUrl: 'member.html'
  }).state('dates', {
    url: '/dates',
    controller: 'MemberCtrl',
    templateUrl: 'dates.html'
  }).state('report', {
    url: '/report',
    controller: 'MemberCtrl',
    templateUrl: 'report.html'
  }).state('settings', {
    url: '/settings',
    controller: 'MemberCtrl',
    templateUrl: 'settings.html'
  }).state('admin', {
    url: '/admin',
    controller: 'AdminCtrl',
    templateUrl: 'admin.html'
  }).state('mothership', {
    url: '/mothership',
    controller: 'AdminCtrl',
    templateUrl: 'mothership.html'
  }).state('discussions', {
    url: '/discussions',
    controller: 'DiscussionsCtrl',
    templateUrl: 'discussions.html'
  }).state('discussing', {
    url: '/discussing',
    controller: 'DiscussionsCtrl',
    templateUrl: 'discussing.html',
    params: {
      rushee: false
    }
  }).state('register', {
    url: '/register',
    controller: 'RegisterCtrl',
    templateUrl: 'register.html'
  });
  $urlRouterProvider.otherwise('member');
  return ParseProvider.initialize("8683A294D744F6A55879C13E8374A", "XgsxILrjVR2v45f7a43gY9VfV60WFMGp");
});

var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

app.controller('AdminCtrl', function($scope, $state, $modal, Parse, Member, Rushee, Report) {
  var checkUserMember, clearAll, initializeVariables, member_compare, onPageLoad, rushee_compare;
  member_compare = function(m1, m2) {
    var comp, comp_1, comp_2;
    if (m1.completed_cds.length < m2.completed_cds.length) {
      comp_1 = -1;
    } else if (m1.completed_cds.length > m2.completed_cds.length) {
      comp_1 = 1;
    } else {
      comp_1 = 0;
    }
    if (m1.date_last_submitted < m2.date_last_submitted) {
      comp_2 = -1;
    } else if (m1.date_last_submitted > m2.date_last_submitted) {
      comp_2 = 1;
    } else {
      comp_2 = 0;
    }
    comp = comp_1;
    if (comp_1 === 0) {
      comp = comp_2;
    }
    comp = comp_1;
    if (comp_1 === 0) {
      return comp = comp_2;
    }
  };
  rushee_compare = function(r1, r2) {
    var comp, comp_1, comp_2;
    comp_1 = r1.completed_cds.length - r2.completed_cds.length;
    if (r1.date_last_completed < r2.date_last_completed) {
      comp_2 = -1;
    } else if (r1.date_last_completed > r2.date_last_completed) {
      comp_2 = 1;
    } else {
      comp_2 = 0;
    }
    return comp = comp_1 === 0 ? comp_2 : comp_1;
  };
  checkUserMember = function() {
    return Member.find({
      'where': {
        'lastname': Parse.auth.currentUser.username
      }
    }).then(function(result) {
      if (result.length === 1) {
        return $scope.userMember = result[0];
      }
    });
  };
  initializeVariables = function() {
    console.log("initiazing variables...");
    $scope.reports = [];
    Rushee.query().then(function(rushees) {
      var r;
      $scope.mostRecentRushees = rushees.sort(rushee_compare);
      $scope.freeRushees = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = rushees.length; _i < _len; _i++) {
          r = rushees[_i];
          if (r.pending_member === null) {
            _results.push(r);
          }
        }
        return _results;
      })();
      return $scope.undatedRushees = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = rushees.length; _i < _len; _i++) {
          r = rushees[_i];
          if (r.completed_cds.length === 0) {
            _results.push(r);
          }
        }
        return _results;
      })();
    });
    Member.query().then(function(members) {
      var m;
      $scope.members = members;
      $scope.excellentMembers = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = members.length; _i < _len; _i++) {
          m = members[_i];
          if (m.completed_cds.length > 3) {
            _results.push(m);
          }
        }
        return _results;
      })();
      $scope.poorMembers = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = members.length; _i < _len; _i++) {
          m = members[_i];
          if (m.completed_cds.length < 1) {
            _results.push(m);
          }
        }
        return _results;
      })();
      return $scope.stingyMembers = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = members.length; _i < _len; _i++) {
          m = members[_i];
          if (m.capacity === 0) {
            _results.push(m);
          }
        }
        return _results;
      })();
    });
    return Report.query().then(function(reports) {
      return $scope.reports = reports;
    });
  };
  $scope.summarize = function(r) {
    var average;
    return average = (r.hall + r.meeting + r.pb + r.date) / 4;
  };
  $scope.moreReportModal = function(report) {
    var infolist;
    return infolist = Rushee.find(report.rushee.objectId).then(function(rushee) {
      return Member.find(report.member.objectId).then(function(member) {
        var modalInstance;
        return modalInstance = $modal.open({
          animation: true,
          templateUrl: 'messageModal.html',
          controller: 'ReportInfoCtrl',
          resolve: {
            rushee: function() {
              return rushee;
            },
            member: function() {
              return member;
            },
            report: function() {
              return report;
            }
          }
        });
      });
    });
  };
  onPageLoad = function() {
    Parse.auth.resumeSession();
    if (Parse.auth.currentUser === null) {
      return $state.go('signin');
    } else {
      $scope.user = Parse.auth.currentUser;
      checkUserMember();
      return initializeVariables();
    }
  };
  $scope.$on('$viewContentLoaded', onPageLoad);
  $scope.listInfoModal = function(infolist, header) {
    var modalInstance;
    return modalInstance = $modal.open({
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'ListInfoCtrl',
      resolve: {
        infolist: function() {
          return infolist;
        },
        header: function() {
          return header;
        }
      }
    });
  };
  $scope.newRushee = new Rushee;
  $scope.saveNewRushee = function() {
    $scope.newRushee.completed_cds = [];
    $scope.newRushee.pending_members = [];
    $scope.newRushee.pending_member = null;
    $scope.newRushee.second_pending_member = null;
    return $scope.newRushee.save().then(function(newRushee) {
      return $state.reload();
    });
  };
  $scope.deleteRusheeModal = function(rushee) {
    var modalInstance;
    modalInstance = $modal.open({
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'RusheeDeleteCtrl',
      resolve: {
        rushee: function() {
          return rushee;
        }
      }
    });
    return modalInstance.result.then(function(deletedRushee) {
      console.log("deleted " + deletedRushee);
      return $state.reload();
    });
  };
  $scope.reassignRusheeModal = function(rushee) {
    var modalInstance;
    modalInstance = $modal.open({
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'RusheeReassignCtrl',
      resolve: {
        rushee: function() {
          return rushee;
        }
      }
    });
    return modalInstance.result.then(function() {
      rushee.pending_member = null;
      return rushee.save().then(function(result) {
        $scope.matchAll();
        return $state.reload();
      });
    });
  };
  $scope.moreRusheeModal = function(rushee) {
    var modalInstance;
    return modalInstance = $modal.open({
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'RusheeMoreCtrl',
      resolve: {
        rushee: function() {
          return rushee;
        }
      }
    });
  };
  $scope.changeMemberModal = function(member) {
    var modalInstance;
    return modalInstance = $modal.open({
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'MemberChangeCtrl',
      resolve: {
        member: function() {
          return member;
        }
      }
    });
  };
  $scope.moreMemberModal = function(member) {
    var modalInstance;
    return modalInstance = $modal.open({
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'MemberMoreCtrl',
      resolve: {
        member: function() {
          return member;
        }
      }
    });
  };
  $scope.removeRusheeFromMember = function(rushee, member) {
    return console.log("we are here simao qui");
  };
  $scope.register = function() {
    return Parse.auth.register($scope.newMember.lastname, 'blood95').then(function() {
      console.log("newMember registered with lastname, " + newMember.lastname + ", and password, blood95");
      return $state.reload();
    }, function(err) {
      return $scope.errorMessage = err.data.error;
    });
  };
  $scope.createMember = function() {
    $scope.newMember.pending_rushees = [];
    $scope.newMember.completed_cds = [];
    $scope.newMember.friends = [];
    $scope.newMember.capacity = 0;
    return $scope.newMember.save().then(function(result) {
      console.log("New Member, " + $scope.newMember.firstname + " " + $scope.newMember.lastname + " created");
      return Parse.auth.register($scope.newMember.lastname, 'blood95').then(function() {
        console.log("new User registered with lastname, " + $scope.newMember.lastname + ", and password, blood95");
        $scope.newMember = new Member;
        return $state.reload();
      }, function(err) {
        return $scope.errorMessage = err.data.error;
      });
    });
  };
  $scope.assignRushee = function() {
    console.log("we made it");
    return Rushee.query({
      'where': {
        'email': $scope.rusheeEmail
      }
    }).then(function(rushee_response) {
      var rushee;
      if (rushee_response.length === 1) {
        rushee = rushee_response[0];
        return Member.query({
          'where': {
            'email': $scope.memberEmail
          }
        }).then(function(member_response) {
          var fullRushee, member;
          if (member_response.length === 1) {
            member = member_response[0];
            rushee.pending_member = member;
            fullRushee = rushee.encodeParse();
            member.pending_rushees.push({
              firstname: fullRushee.firstname,
              lastname: fullRushee.lastname,
              email: fullRushee.email,
              objectId: fullRushee.objectId
            });
            return rushee.update().then(function() {
              return member.update().then(function() {
                console.log("" + rushee.firstname + " " + rushee.lastname + " assigned to " + member.lastname + ".");
                return $state.reload();
              });
            });
          } else {
            return alert("WRONG MEMBER EMAIL");
          }
        });
      } else {
        return alert("WRONG RUSHEE EMAIL");
      }
    });
  };
  $scope.newMember = new Member;
  $scope.caps = [0, 1, 2, 3];
  $scope.setCap = function(cap) {
    return $scope.capacity = cap;
  };
  $scope.setCapacitiesAndRun = function(run_is_true) {
    var cap;
    if ($scope.capacity === void 0) {
      alert("You have not selected a capacity");
      return;
    }
    cap = parseInt($scope.capacity);
    return Member.query().then(function(members) {
      var member, memberCount, _i, _len, _results;
      memberCount = 0;
      _results = [];
      for (_i = 0, _len = members.length; _i < _len; _i++) {
        member = members[_i];
        member.capacity = cap;
        _results.push(member.update().then(function() {
          memberCount += 1;
          if (memberCount === members.length) {
            if (run_is_true) {
              return $scope.matchAll();
            } else {
              return alert("All member's capacities updated to " + $scope.capacity + ". There may be space for more dates to be assigned.");
            }
          }
        }));
      }
      return _results;
    });
  };
  $scope.beginRushModal = function() {
    var modalInstance;
    modalInstance = $modal.open({
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'RushBeginCtrl'
    });
    return modalInstance.result.then(function(success) {
      $scope.capacity = "1";
      return $scope.setCapacitiesAndRun(true);
    });
  };
  clearAll = function() {
    console.log("clearing database...");
    Rushee.query().then(function(rushees) {
      var rushee, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = rushees.length; _i < _len; _i++) {
        rushee = rushees[_i];
        rushee.completed_cds = [];
        rushee.pending_member = null;
        rushee.second_pending_member = null;
        rushee.date_last_completed = null;
        _results.push(rushee.update().then(function() {
          return console.log("Rushee cleared");
        }));
      }
      return _results;
    });
    return Member.query().then(function(members) {
      var member, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = members.length; _i < _len; _i++) {
        member = members[_i];
        member.completed_cds = [];
        member.pending_rushees = [];
        member.date_last_submitted = null;
        member.capacity = 0;
        _results.push(member.update().then(function() {
          return console.log("Member cleared");
        }));
      }
      return _results;
    });
  };
  $scope.resetRushModal = function() {
    var modalInstance;
    modalInstance = $modal.open({
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'RushResetCtrl'
    });
    return modalInstance.result.then(function(success) {
      console.log("clearing all...");
      return clearAll();
    });
  };
  return $scope.matchAll = function() {
    var matchInfo;
    console.log("Matching all...");
    console.log("We are in here");
    matchInfo = [];
    return Rushee.query().then(function(rushees) {
      return Member.query().then(function(members) {
        var assignIndex, end, free_members, free_rushees, m, match, member, memberCount, missing_rushees, r, rush, rushee, start, wasAssigned, weird_algo_rushees, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _results;
        free_members = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = members.length; _i < _len; _i++) {
            m = members[_i];
            if (m.pending_rushees.length < m.capacity) {
              _results.push(m);
            }
          }
          return _results;
        })();
        free_rushees = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = rushees.length; _i < _len; _i++) {
            r = rushees[_i];
            if ((r.completed_cds.length === 2 && (!r.pending_member && !r.second_pending_member)) || (r.completed_cds.length < 2 && (!r.pending_member || !r.second_pending_member))) {
              _results.push(r);
            }
          }
          return _results;
        })();
        missing_rushees = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = rushees.length; _i < _len; _i++) {
            r = rushees[_i];
            if (r.completed_cds.length === 0) {
              _results.push(r);
            }
          }
          return _results;
        })();
        weird_algo_rushees = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = rushees.length; _i < _len; _i++) {
            r = rushees[_i];
            if (r.completed_cds.length === 0 && (!r.pending_member || !r.second_pending_member)) {
              _results.push(r);
            }
          }
          return _results;
        })();
        console.log(missing_rushees);
        match = function(member, rushee) {
          var fullRushee;
          matchInfo.push([rushee, member]);
          fullRushee = rushee.encodeParse();
          member.pending_rushees.push({
            email: fullRushee.email,
            firstname: fullRushee.firstname,
            lastname: fullRushee.lastname
          });
          if (!rushee.pending_member) {
            rushee.pending_member = member;
          } else {
            rushee.second_pending_member = member;
          }
          return rushee.date_last_submitted = new Date;
        };
        free_members.sort(member_compare);
        free_rushees.sort(rushee_compare);
        for (_i = 0, _len = free_rushees.length; _i < _len; _i++) {
          r = free_rushees[_i];
          wasAssigned = false;
          assignIndex = 0;
          for (_j = 0, _len1 = free_members.length; _j < _len1; _j++) {
            m = free_members[_j];
            assignIndex += 1;
            if ((_ref = r.email, __indexOf.call((function() {
              var _k, _len2, _ref1, _results;
              _ref1 = m.friends;
              _results = [];
              for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
                rush = _ref1[_k];
                _results.push(rush.email);
              }
              return _results;
            })(), _ref) < 0) && (m.pending_rushees.length < m.capacity) && (_ref1 = r.email, __indexOf.call((function() {
              var _k, _len2, _ref2, _results;
              _ref2 = m.completed_cds;
              _results = [];
              for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                rush = _ref2[_k];
                _results.push(rush.email);
              }
              return _results;
            })(), _ref1) < 0)) {
              if ((!r.pending_member) || (r.pending_member.objectId !== m.objectId)) {
                match(m, r);
                wasAssigned = true;
              }
              break;
            }
          }
          start = free_members.slice(0, assignIndex);
          end = free_members.slice(assignIndex);
          free_members = end.concat(start);
        }
        memberCount = 0;
        for (_k = 0, _len2 = rushees.length; _k < _len2; _k++) {
          rushee = rushees[_k];
          rushee.update();
        }
        _results = [];
        for (_l = 0, _len3 = members.length; _l < _len3; _l++) {
          member = members[_l];
          _results.push(member.update().then(function() {
            var modalInstance;
            memberCount += 1;
            if (memberCount === members.length) {
              return modalInstance = $modal.open({
                animation: true,
                templateUrl: 'messageModal.html',
                controller: 'MatchInfoCtrl',
                resolve: {
                  matchinfo: function() {
                    return matchInfo;
                  },
                  header: function() {
                    return "Rushees assigned to Members";
                  }
                }
              });
            }
          }));
        }
        return _results;
      });
    });
  };
});

app.controller('AuthCtrl', function($scope, Parse) {
  $scope.auth = Parse.auth;
  return $scope.signout = function() {
    return Parse.auth.logout();
  };
});

var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

app.controller('DiscussionsCtrl', function($scope, $state, $stateParams, $location, $modal, Parse, Member, Rushee, Report) {
  var averageArray, checkUserMember, initializeVariables, onPageLoad, setAverages, shouldAdd;
  checkUserMember = function() {
    return Member.find({
      'where': {
        'lastname': Parse.auth.currentUser.username
      }
    }).then(function(result) {
      if (result.length === 1) {
        return $scope.userMember = result[0];
      }
    });
  };
  averageArray = function(arr) {
    var count, sc, sum, _i, _len;
    sum = 0;
    count = 0;
    for (_i = 0, _len = arr.length; _i < _len; _i++) {
      sc = arr[_i];
      sum += sc;
      count += 1;
    }
    return sum / count;
  };
  setAverages = function() {
    var a, b, c, count, d, key, r, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    _ref = [0, 0, 0, 0, 0], a = _ref[0], b = _ref[1], c = _ref[2], d = _ref[3], count = _ref[4];
    $scope.scores = [];
    _ref1 = $scope.reports;
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      r = _ref1[_i];
      $scope.fields = r.fields;
      _ref2 = Object.keys($scope.fields);
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        key = _ref2[_j];
        if (typeof $scope.fields[key] === 'number') {
          $scope.scores.push($scope.fields[key]);
        }
      }
    }
    $scope.average = 0;
    $scope.overall = averageArray($scope.scores);
    console.log($scope.scores);
    $scope.hall = a;
    $scope.meeting = b;
    $scope.pb = c;
    return $scope.date = d;
  };
  shouldAdd = function(obj) {
    var each, memberIds, _i, _len, _ref, _ref1;
    memberIds = [];
    _ref = $scope.reports;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      each = _ref[_i];
      memberIds.push(each.memberId);
    }
    if ((_ref1 = obj.memberId, __indexOf.call(memberIds, _ref1) >= 0)) {
      return false;
    }
    return true;
  };
  initializeVariables = function() {
    console.log("initiazing variables...");
    $scope.reports = [];
    $scope.member_for_report = {};
    if ($stateParams.rushee) {
      $scope.rushee = $stateParams.rushee;
      $scope.reports = [];
      Report.query({
        'limit': 1000
      }).then(function(reports) {
        var report, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = reports.length; _i < _len; _i++) {
          report = reports[_i];
          if (report.rusheeId === $scope.rushee.objectId) {
            if (shouldAdd(report)) {
              $scope.reports.push(report);
              _results.push(setAverages());
            } else {
              _results.push(void 0);
            }
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      });
    } else {
      $state.go('discussions');
    }
    return Rushee.query().then(function(rushees) {
      return $scope.rushees = rushees;
    });
  };
  onPageLoad = function() {
    Parse.auth.resumeSession();
    if (Parse.auth.currentUser === null) {
      return $state.go('signin');
    } else {
      $scope.user = Parse.auth.currentUser;
      return initializeVariables();
    }
  };
  $scope.$on('$viewContentLoaded', onPageLoad);
  $scope.discussRushee = function(rushee) {
    console.log("moving to discuss " + rushee.firstname + "...");
    return $state.go('discussing', {
      'rushee': rushee
    });
  };
  $scope.bid = function(candidate) {
    console.log("AH bid " + candidate.firstname);
    return Rushee.find(candidate.objectId).then(function(bidded) {
      console.log("" + bidded.firstname + " was bidded");
      bidded.wasBid = true;
      return bidded.save().then(function() {
        return console.log("database updated");
      });
    });
  };
  $scope.hose = function(candidate) {
    console.log("AH hose " + candidate.firstname);
    return Rushee.find(candidate.objectId).then(function(hosed) {
      console.log("" + hosed.firstname + " was hosed");
      hosed.wasBid = false;
      console.log(hosed);
      return hosed.save().then(function() {
        return console.log("database updated");
      });
    });
  };
  $scope.summarize = function(r) {
    var average;
    return average = (r.hall + r.meeting + r.pb + r.date) / 4;
  };
  return $scope.moreReportModal = function(report) {
    var infolist;
    return infolist = Rushee.find(report.rusheeId).then(function(rushee) {
      return Member.find(report.memberId).then(function(member) {
        var modalInstance;
        return modalInstance = $modal.open({
          animation: true,
          templateUrl: 'messageModal.html',
          controller: 'ReportInfoCtrl',
          resolve: {
            rushee: function() {
              return rushee;
            },
            member: function() {
              return member;
            },
            report: function() {
              return report;
            }
          }
        });
      });
    });
  };
});

var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

app.controller('MemberCtrl', function($scope, $stateParams, $state, $modal, Parse, Member, Report, Rushee) {
  var allRushees, checkUserMember, onPageLoad;
  checkUserMember = function() {
    return Member.query({
      'where': {
        'lastname': Parse.auth.currentUser.username
      }
    }).then(function(result) {
      if (result.length === 1) {
        $scope.userMember = result[0];
        return console.log($scope.userMember);
      }
    });
  };
  allRushees = function() {
    return Rushee.query().then(function(rushees) {
      return $scope.allrushees = rushees;
    });
  };
  onPageLoad = function() {
    if (Parse.auth.currentUser === null) {
      return $state.go('signin');
    } else {
      $scope.allrushees = allRushees();
      return checkUserMember();
    }
  };
  $scope.$on('$viewContentLoaded', onPageLoad);
  $scope.newFriend = new Rushee;
  $scope.knowsRusheeModal = function(rushee) {
    var modalInstance;
    return modalInstance = $modal.open({
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'RusheeKnowsCtrl',
      resolve: {
        rushee: function() {
          return rushee;
        },
        member: function() {
          return $scope.userMember;
        }
      }
    });
  };
  $scope.memberKnowsRushee = function(rushee) {
    var dated, dating, friend, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    if ($scope.userMember) {
      _ref = $scope.userMember.friends;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        friend = _ref[_i];
        if (friend.email === rushee.email) {
          return true;
        }
      }
      _ref1 = $scope.userMember.completed_cds;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        dated = _ref1[_j];
        if (dated.email === rushee.email) {
          return true;
        }
      }
      _ref2 = $scope.userMember.pending_rushees;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        dating = _ref2[_k];
        if (dating.email === rushee.email) {
          return true;
        }
      }
    }
    return false;
  };
  $scope.ranks = [1, 2, 3, 4, 5];
  $scope.dropdownLabel = "Choose your rushee";
  $scope.report = new Report;
  $scope.updateDropdown = function(rushee) {
    return Rushee.query({
      'where': {
        'email': rushee.email
      }
    }).then(function(result) {
      $scope.dropdownLabel = "" + rushee.firstname + " " + rushee.lastname;
      if (result.length === 1) {
        return $scope.report.rushee = result[0];
      } else {
        return alert("two rushees have the same email address - send Lachie an email");
      }
    }, function(err) {
      return alert(err);
    });
  };
  $scope.submitReportModal = function() {
    var modalInstance;
    if (!$scope.report.rushee) {
      alert("PLEASE SELECT A RUSHEE");
      return;
    }
    $scope.report.pb = parseInt($scope.report.pb);
    $scope.report.hall = parseInt($scope.report.hall);
    $scope.report.meeting = parseInt($scope.report.meeting);
    $scope.report.date = parseInt($scope.report.date);
    $scope.report.member = $scope.userMember;
    modalInstance = $modal.open({
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'SubmitReportCtrl',
      resolve: {
        report: function() {
          return $scope.report;
        },
        rushee: function() {
          return $scope.report.rushee;
        },
        member: function() {
          return $scope.userMember;
        }
      }
    });
    return modalInstance.result.then(function() {
      $scope.matchAll();
      return $state.reload();
    });
  };
  $scope.changePasswordModal = function() {
    var modalInstance;
    if ($scope.newPassword !== $scope.repeatNewPassword) {
      return alert("Your passwords are not the same, try again.");
    } else {
      modalInstance = $modal.open({
        animation: true,
        templateUrl: 'messageModal.html',
        controller: 'PasswordChangeCtrl',
        resolve: {
          member: function() {
            return $scope.userMember;
          },
          user: function() {
            return Parse.auth.currentUser;
          },
          newPassword: function() {
            return $scope.newPassword;
          }
        }
      });
      return modalInstance.result.then(function() {
        var member_compare, rushee_compare;
        $state.reload();
        member_compare = function(m1, m2) {
          var comp, comp_2, comp_3;
          if (m1.completed_cds.length < m2.completed_cds.length) {
            comp_2 = -1;
          } else if (m1.completed_cds.length > m2.completed_cds.length) {
            comp_2 = 1;
          } else {
            comp_2 = 0;
          }
          if (m1.date_last_submitted < m2.date_last_submitted) {
            comp_3 = -1;
          } else if (m1.date_last_submitted > m2.date_last_submitted) {
            comp_3 = 1;
          } else {
            comp_3 = 0;
          }
          comp = comp_2;
          if (comp_2 === 0) {
            return comp = comp_3;
          }
        };
        return rushee_compare = function(r1, r2) {
          var comp, comp_1, comp_2;
          comp_1 = r1.completed_cds.length - r2.completed_cds.length;
          if (r1.date_last_completed < r2.date_last_completed) {
            comp_2 = -1;
          } else if (r1.date_last_completed > r2.date_last_completed) {
            comp_2 = 1;
          } else {
            comp_2 = 0;
          }
          return comp = comp_1 === 0 ? comp_2 : comp_1;
        };
      });
    }
  };
  return $scope.matchAll = function() {
    var matchInfo;
    console.log("Matching all...");
    matchInfo = [];
    return Rushee.query().then(function(rushees) {
      return Member.query().then(function(members) {
        var assignIndex, end, free_members, free_rushees, m, match, member, r, rush, rushee, start, wasAssigned, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _results;
        free_members = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = members.length; _i < _len; _i++) {
            m = members[_i];
            if (m.pending_rushees.length < m.capacity) {
              _results.push(m);
            }
          }
          return _results;
        })();
        free_rushees = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = rushees.length; _i < _len; _i++) {
            r = rushees[_i];
            if (r.pending_member === null) {
              _results.push(r);
            }
          }
          return _results;
        })();
        console.log("free_members is " + free_members.length + " long");
        console.log("free_members is " + ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = free_members.length; _i < _len; _i++) {
            m = free_members[_i];
            _results.push(m.lastname);
          }
          return _results;
        })()));
        console.log("free_rushees is " + free_rushees.length + " long");
        console.log("free_rushees is " + ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = free_rushees.length; _i < _len; _i++) {
            m = free_rushees[_i];
            _results.push(m.lastname);
          }
          return _results;
        })()));
        console.log("---------------------------------");
        match = function(member, rushee) {
          matchInfo.push([rushee, member]);
          member.pending_rushees.push(rushee.encodeParse());
          rushee.pending_member = member;
          return rushee.date_last_submitted = new Date;
        };
        free_members.sort(member_compare);
        free_rushees.sort(rushee_compare);
        console.log("free_members is " + ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = free_members.length; _i < _len; _i++) {
            m = free_members[_i];
            _results.push(m.lastname);
          }
          return _results;
        })()));
        console.log("free_rushees is " + ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = free_rushees.length; _i < _len; _i++) {
            m = free_rushees[_i];
            _results.push(m.lastname);
          }
          return _results;
        })()));
        console.log("---------------------------------");
        for (_i = 0, _len = free_rushees.length; _i < _len; _i++) {
          r = free_rushees[_i];
          wasAssigned = false;
          assignIndex = 0;
          for (_j = 0, _len1 = free_members.length; _j < _len1; _j++) {
            m = free_members[_j];
            assignIndex += 1;
            if ((_ref = r.email, __indexOf.call((function() {
              var _k, _len2, _ref1, _results;
              _ref1 = m.friends;
              _results = [];
              for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
                rush = _ref1[_k];
                _results.push(rush.email);
              }
              return _results;
            })(), _ref) < 0) && (m.pending_rushees.length < m.capacity) && (_ref1 = r.email, __indexOf.call((function() {
              var _k, _len2, _ref2, _results;
              _ref2 = m.completed_cds;
              _results = [];
              for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                rush = _ref2[_k];
                _results.push(rush.email);
              }
              return _results;
            })(), _ref1) < 0)) {
              match(m, r);
              wasAssigned = true;
              break;
            }
          }
          start = free_members.slice(0, assignIndex);
          end = free_members.slice(assignIndex);
          free_members = end.concat(start);
          console.log("free_members is " + ((function() {
            var _k, _len2, _results;
            _results = [];
            for (_k = 0, _len2 = free_members.length; _k < _len2; _k++) {
              m = free_members[_k];
              _results.push(m.lastname);
            }
            return _results;
          })()));
        }
        for (_k = 0, _len2 = rushees.length; _k < _len2; _k++) {
          rushee = rushees[_k];
          rushee.update();
        }
        _results = [];
        for (_l = 0, _len3 = members.length; _l < _len3; _l++) {
          member = members[_l];
          _results.push(member.update());
        }
        return _results;
      });
    });
  };
});

app.controller('ReportInfoCtrl', function($scope, $modalInstance, rushee, member, report) {
  $scope.message = "" + member.firstname + " " + member.lastname + "'s Report on " + rushee.firstname + " " + rushee.lastname;
  $scope.lines = ["Vibes Score: " + report.fields.vibes, "Contributions Score: " + report.fields.contributions, "Enthusiasm Score: " + report.fields.enthusiasm, "Honesty Score: " + report.fields.honesty, "Listener Score: " + report.fields.listener, "Date Description: " + report.fields.dateDesc, "Circumstance: " + report.fields.circumstances];
  $scope.executeMessage = "Ok";
  $scope.cancel = function() {
    return $modalInstance.dismiss('cancel');
  };
  return $scope.execute = function() {
    return $modalInstance.dismiss('cancel');
  };
});

app.controller('ListInfoCtrl', function($scope, $modalInstance, infolist, header) {
  var e;
  $scope.message = header;
  $scope.lines = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = infolist.length; _i < _len; _i++) {
      e = infolist[_i];
      _results.push("" + e.firstname + " " + e.lastname);
    }
    return _results;
  })();
  $scope.executeMessage = "Ok";
  $scope.cancel = function() {
    return $modalInstance.dismiss('cancel');
  };
  return $scope.execute = function() {
    return $modalInstance.dismiss('cancel');
  };
});

app.controller('MatchInfoCtrl', function($scope, $modalInstance, header, matchinfo) {
  var pair;
  $scope.message = header;
  $scope.lines = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = matchinfo.length; _i < _len; _i++) {
      pair = matchinfo[_i];
      _results.push("" + pair[0].firstname + " " + pair[0].lastname + " assigned to " + pair[1].firstname + " " + pair[1].lastname);
    }
    return _results;
  })();
  $scope.executeMessage = "Ok";
  $scope.cancel = function() {
    return $modalInstance.dismiss('cancel');
  };
  return $scope.execute = function() {
    return $modalInstance.dismiss('cancel');
  };
});

app.controller('RusheeDeleteCtrl', function($scope, $modalInstance, rushee, Member) {
  $scope.message = "Are you sure you want to delete " + rushee.firstname + " " + rushee.lastname + "? This action can't be reversed, so don't come crying to me, Sam.";
  $scope.executeMessage = "Delete " + rushee.firstname + " " + rushee.lastname;
  $scope.cancel = function() {
    return $modalInstance.dismiss('cancel');
  };
  return $scope.execute = function() {
    Member.query().then(function(members) {
      var each, index, member, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = members.length; _i < _len; _i++) {
        member = members[_i];
        _results.push((function() {
          var _j, _len1, _ref, _results1;
          _ref = member.pending_rushees;
          _results1 = [];
          for (index = _j = 0, _len1 = _ref.length; _j < _len1; index = ++_j) {
            each = _ref[index];
            if (each.email === rushee.email) {
              member.pending_rushees.splice(index, 1);
              _results1.push(member.update());
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        })());
      }
      return _results;
    });
    return rushee.destroy().then(function(deletedRushee) {
      console.log("" + deletedRushee.firstname + " was deleted in modal controller");
      return $modalInstance.close(deletedRushee);
    });
  };
});

app.controller('RusheeMoreCtrl', function($scope, $modalInstance, rushee, Member) {
  var updateUI, updateUIwithMember;
  $scope.rushee = rushee;
  updateUIwithMember = function(member) {
    var date, _i, _len, _ref;
    console.log("updating UI with member");
    $scope.pendingDate = "" + member.firstname + " " + member.lastname;
    $scope.completedDates = "";
    _ref = $scope.rushee.completed_cds;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      date = _ref[_i];
      Member.find(date).then(function(result) {
        $scope.completedDates = "" + result.firstname + " " + result.lastname + ", " + $scope.completedDates;
        return $scope.lines = ["" + rushee.email, "Completed Dates = " + $scope.completedDates, "Pending Date = " + $scope.pendingDate];
      });
    }
    return $scope.lines = ["" + rushee.email, "Completed Dates = " + $scope.completedDates, "Pending Date = " + $scope.pendingDate];
  };
  updateUI = function() {
    var date, _i, _len, _ref;
    console.log("updating UI with no argument");
    $scope.pendingDate = "None.";
    $scope.completedDates = "";
    _ref = $scope.rushee.completed_cds;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      date = _ref[_i];
      Member.find(date).then(function(result) {
        console.log("found member");
        $scope.completedDates = "" + result.firstname + " " + result.lastname + ", " + $scope.completedDates;
        return $scope.lines = ["" + rushee.email, "Completed Dates = " + $scope.completedDates, "Pending Date = " + $scope.pendingDate];
      });
    }
    return $scope.lines = ["" + rushee.email, "Completed Dates = " + $scope.completedDates, "Pending Date = " + $scope.pendingDate];
  };
  $scope.pendingDate = "";
  if (rushee.pending_member) {
    console.log("UPDATING WITH MEMBER");
    Member.find(rushee.pending_member.objectId).then(function(member) {
      console.log("found member");
      console.log(member);
      return updateUIwithMember(member);
    });
  } else {
    updateUI();
  }
  $scope.message = "" + rushee.firstname + " " + rushee.lastname;
  $scope.executeMessage = "Ok";
  $scope.cancel = function() {
    return $modalInstance.dismiss('cancel');
  };
  return $scope.execute = function() {
    return $modalInstance.dismiss('cancel');
  };
});

app.controller('MemberMoreCtrl', function($scope, $modalInstance, member) {
  var date, friend, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
  $scope.member = member;
  $scope.listedFriends = "";
  _ref = $scope.member.friends;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    friend = _ref[_i];
    $scope.listedFriends = "" + friend.firstname + " " + friend.lastname + ", " + $scope.listedFriends;
  }
  $scope.completedDates = "";
  _ref1 = $scope.member.completed_cds;
  for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
    date = _ref1[_j];
    $scope.completedDates = "" + date.firstname + " " + date.lastname + ", " + $scope.completedDates;
  }
  $scope.pendingDates = "";
  _ref2 = $scope.member.pending_rushees;
  for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
    date = _ref2[_k];
    $scope.pendingDates = "" + date.firstname + " " + date.lastname + ", " + $scope.pendingDates;
  }
  $scope.message = "" + member.firstname + " " + member.lastname;
  $scope.lines = ["Completed Dates = " + $scope.completedDates, "Pending Dates = " + $scope.pendingDates];
  $scope.executeMessage = "Ok";
  $scope.cancel = function() {
    return $modalInstance.dismiss('cancel');
  };
  return $scope.execute = function() {
    return $modalInstance.dismiss('cancel');
  };
});

app.controller('MemberChangeCtrl', function($scope, $modalInstance, member) {
  $scope.message = "" + member.firstname + " " + member.lastname + "'s capacity is currently " + member.capacity;
  $scope.lines = ["If you hit 'Cancel' it will decrease " + member.firstname + " " + member.lastname + "'s capacity. It's just weird because I am hacking and don't want to change this.", "Click outside the modal to dismiss this screen."];
  $scope.executeMessage = "+1";
  $scope.cancel = function() {
    if (member.capacity === 0) {
      return alert("You can't decrease this capacity, it's zero.");
    } else {
      member.capacity = member.capacity - 1;
      return member.update().then(function() {
        console.log("Capacity increased");
        return $scope.message = "" + member.firstname + " " + member.lastname + "'s capacity is currently " + member.capacity;
      });
    }
  };
  return $scope.execute = function() {
    member.capacity = member.capacity + 1;
    return member.update().then(function() {
      console.log("Capacity increased");
      return $scope.message = "" + member.firstname + " " + member.lastname + "'s capacity is currently " + member.capacity;
    });
  };
});

app.controller('RusheeKnowsCtrl', function($scope, $modalInstance, rushee, member) {
  $scope.message = "Do you definitely know " + rushee.firstname + " " + rushee.lastname + "? Once you confirm, you will not be up for a coffee date with this person at any stage during the rush process.";
  $scope.executeMessage = "I know " + rushee.firstname + " " + rushee.lastname;
  $scope.cancel = function() {
    return $modalInstance.dismiss('cancel');
  };
  return $scope.execute = function() {
    member.friends.push(rushee.encodeParse());
    member.save().then(function() {
      return console.log("" + rushee.firstname + " added to " + member.firstname + "'s friends");
    });
    return $modalInstance.close(rushee);
  };
});

app.controller('RusheeReassignCtrl', function($scope, $modalInstance, Member, rushee) {
  var reassignMessage, reassignRushee, removeRusheeFromMember;
  reassignMessage = function() {
    if (rushee.pending_member !== null) {
      return "Do you want to pop " + rushee.firstname + " " + rushee.lastname + "? Once you confirm, this person will be evicted from his/her current date, and fed back into the assignment queue.";
    } else {
      $scope.executeMessage = "Ok";
      return "Cannot reassign -- " + rushee.firstname + " " + rushee.lastname + " is not currently assigned to a member.";
    }
  };
  $scope.executeMessage = "Pop " + rushee.firstname + " " + rushee.lastname;
  $scope.message = reassignMessage();
  $scope.cancel = function() {
    return $modalInstance.dismiss('cancel');
  };
  removeRusheeFromMember = function(rushee, member) {
    var each, index, _i, _len, _ref, _results;
    _ref = member.pending_rushees;
    _results = [];
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      each = _ref[index];
      console.log(each);
      if (each.email === rushee.email) {
        member.pending_rushees.splice(index, 1);
        _results.push(member.update());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  reassignRushee = function() {
    var id;
    id = rushee.pending_member.objectId;
    return Member.find(id).then(function(member) {
      console.log("updating member...");
      removeRusheeFromMember(rushee, member);
      member.friends.push(rushee.encodeParse());
      return member.update().then(function() {
        return $modalInstance.close();
      });
    });
  };
  return $scope.execute = function() {
    if (rushee.pending_member !== null) {
      console.log("reassigning rushee...");
      return reassignRushee(rushee);
    } else {
      return $modalInstance.dismiss();
    }
  };
});

app.controller('PasswordChangeCtrl', function($scope, $modalInstance, member, user, newPassword) {
  $scope.message = "Are you sure you want to change your password? Don't come crying to me when you forget it.";
  $scope.executeMessage = "Change Password";
  $scope.cancel = function() {
    return $modalInstance.dismiss('cancel');
  };
  return $scope.execute = function() {
    console.log("changing password...");
    console.log("user is " + user.username);
    user.password = newPassword;
    return user.save().then(function() {
      console.log("Password changed. New password is " + newPassword);
      return $modalInstance.close();
    });
  };
});

app.controller('SubmitReportCtrl', function($scope, $modalInstance, report, rushee, member) {
  var finish, removeRusheeFromMember;
  $scope.message = "Are you sure you want to submit this report? You will not be able to submit another report for this rushee once you confirm this action.";
  $scope.executeMessage = "Submit Report";
  $scope.cancel = function() {
    return $modalInstance.dismiss('cancel');
  };
  finish = function(rushee, member) {
    return rushee.update().then(function() {
      return member.update().then(function() {
        return $modalInstance.close();
      });
    });
  };
  removeRusheeFromMember = function(rushee, member) {
    var each, index, _i, _len, _ref, _results;
    _ref = member.pending_rushees;
    _results = [];
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      each = _ref[index];
      if (each.lastname === rushee.lastname) {
        member.pending_rushees.splice(index, 1);
        _results.push(member.update().then(function() {
          return finish(rushee, member);
        }));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  return $scope.execute = function() {
    console.log("submitting report...");
    return report.save().then(function(report) {
      rushee.completed_cds.push(member.objectId);
      rushee.date_last_completed = new Date;
      rushee.pending_member = null;
      member.completed_cds.push(rushee.encodeParse());
      member.date_last_submitted = new Date;
      return removeRusheeFromMember(rushee, member);
    });
  };
});

app.controller('RushBeginCtrl', function($scope, $modalInstance) {
  $scope.message = "Are you sure you want to begin Rush? This will set all member's capacities to one, meaning that each member will be assigned one coffee date. Once a member submits a report for a coffee date, dates will automatically be reassigned. You can change member's capacities in the 'Admin' tab, and then manually assign rushees to members with the first button above.";
  $scope.executeMessage = "Begin Rush";
  $scope.cancel = function() {
    return $modalInstance.dismiss('cancel');
  };
  return $scope.execute = function() {
    return $modalInstance.close();
  };
});

app.controller('RushResetCtrl', function($scope, $modalInstance) {
  $scope.message = "Are you sure you want to reset Rush? This will clean all members and rushees and coffee dates, friends, and all other characteristics in the database. (It will not delete members and rushees).";
  $scope.executeMessage = "Reset Rush";
  $scope.cancel = function() {
    return $modalInstance.dismiss('cancel');
  };
  return $scope.execute = function() {
    return $modalInstance.close();
  };
});

app.controller('MothershipCtrl', function($scope, $state, $modal, Parse, Member, Rushee) {
  var checkUserMember, clearAll, onPageLoad;
  $scope.tagline = "We are in Mothership Control";
  $scope.removeRusheeFromMember = function(rushee, member) {
    var each, index, m, _i, _len, _ref, _results;
    _ref = $scope.userMember.pending_rushees;
    _results = [];
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      each = _ref[index];
      console.log("rushee is " + each.lastname + ", index is " + index);
      if (each.lastname === rushee.lastname) {
        console.log("DELETE");
        $scope.userMember.pending_rushees.splice(index, 1);
        console.log((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = $scope.userMember.pending_rushees;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            m = _ref1[_j];
            _results1.push(m.lastname);
          }
          return _results1;
        })());
        _results.push($scope.userMember.update());
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  checkUserMember = function() {
    return Member.query({
      'where': {
        'lastname': Parse.auth.currentUser.username
      }
    }).then(function(result) {
      if (result.length === 1) {
        $scope.userMember = result[0];
        console.log("User<->Member relationship established");
        return console.log($scope.userMember);
      }
    });
  };
  onPageLoad = function() {
    Parse.auth.resumeSession();
    if (Parse.auth.currentUser === null) {
      return $state.go('signin');
    } else {
      $scope.user = Parse.auth.currentUser;
      return checkUserMember();
    }
  };
  $scope.$on('$viewContentLoaded', onPageLoad);
  $scope.createMember = function() {
    $scope.newMember.pending_rushees = [];
    $scope.newMember.completed_cds = [];
    $scope.newMember.friends = [];
    $scope.newMember.capacity = 0;
    return $scope.newMember.save().then(function(result) {
      console.log("New Member, " + $scope.newMember.firstname + " " + $scope.newMember.lastname + " created");
      $scope.newMember = new Member;
      return $state.reload();
    });
  };
  $scope.moreMemberModal = function(member) {
    var modalInstance;
    return modalInstance = $modal.open({
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'MemberMoreCtrl',
      resolve: {
        member: function() {
          return member;
        }
      }
    });
  };
  $scope.newRushee = new Rushee;
  $scope.newMember = new Member;
  $scope.getMembers = function() {
    return Member.query().then(function(members) {
      return $scope.members = members;
    });
  };
  $scope.caps = [0, 1, 2, 3];
  $scope.setCapacitiesAndRun = function() {
    var cap;
    cap = parseInt($scope.capacity);
    console.log(cap);
    console.log($scope.capacity);
    return Member.query().then(function(members) {
      var member, memberCount, _i, _len, _results;
      memberCount = 0;
      _results = [];
      for (_i = 0, _len = members.length; _i < _len; _i++) {
        member = members[_i];
        member.capacity = cap;
        _results.push(member.update().then(function() {
          memberCount += 1;
          console.log("Member capacity updated to " + cap);
          console.log("memberCount is " + memberCount);
          console.log("" + members.length);
          if (memberCount === members.length) {
            return $scope.matchAll();
          }
        }));
      }
      return _results;
    });
  };
  $scope.beginRushModal = function() {
    var modalInstance;
    modalInstance = $modal.open({
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'RushBeginCtrl'
    });
    return modalInstance.result.then(function(success) {
      console.log("matching all...");
      $scope.capacity = "1";
      return $scope.setCapacitiesAndRun();
    });
  };
  clearAll = function() {
    console.log("clearing database...");
    Rushee.query().then(function(rushees) {
      var rushee, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = rushees.length; _i < _len; _i++) {
        rushee = rushees[_i];
        rushee.pending_member = null;
        rushee.second_pending_member = null;
        rushee.pending_members = [];
        rushee.completed_cds = [];
        rushee.date_last_completed = null;
        _results.push(rushee.update().then(function() {
          return console.log("Rushee cleared");
        }));
      }
      return _results;
    });
    return Member.query().then(function(members) {
      var member, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = members.length; _i < _len; _i++) {
        member = members[_i];
        member.completed_cds = [];
        member.friends = [];
        member.pending_rushees = [];
        member.date_last_submitted = null;
        member.capacity = 0;
        _results.push(member.update().then(function() {
          return console.log("Member cleared");
        }));
      }
      return _results;
    });
  };
  $scope.resetRushModal = function() {
    var modalInstance;
    modalInstance = $modal.open({
      animation: true,
      templateUrl: 'messageModal.html',
      controller: 'RushResetCtrl'
    });
    return modalInstance.result.then(function(success) {
      console.log("clearing all...");
      return clearAll();
    });
  };
  return $scope.matchAll = function() {
    return console.log("Matching all...");
  };
});

app.controller('RegisterCtrl', function($location, $state, $window, $scope, Parse) {
  $scope.auth = Parse.auth;
  $scope.user = {};
  $scope.errorMessage = null;
  return $scope.register = function(user) {
    if (user.password !== user.passwordConfirm) {
      return $scope.errorMessage = "Passwords must match";
    }
    if (!(user.username && user.password)) {
      return $scope.errorMessage = 'Please supply a username and password';
    }
    return Parse.auth.register(user.username, user.password).then(function() {
      console.log("user registered with username, " + user.username + ", and password, " + user.password);
      return $state.reload();
    }, function(err) {
      return $scope.errorMessage = err.data.error;
    });
  };
});

app.controller('SignInCtrl', function($location, $window, $scope, Parse) {
  $scope.auth = Parse.auth;
  $scope.user = {};
  $scope.errorMessage = null;
  return $scope.signin = function(user) {
    if (!(user.username && user.password)) {
      return $scope.errorMessage = 'Please supply a username and password';
    }
    return Parse.auth.login(user.username, user.password).then(function() {
      console.log('Logged in', arguments);
      return $location.path("/member");
    }, function(err) {
      console.log('Logged out', arguments);
      return $scope.errorMessage = err.data.error;
    });
  };
});

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

app.factory('Auth', function(Parse) {
  var Auth;
  return Auth = (function(_super) {
    __extends(Auth, _super);

    function Auth() {
      return Auth.__super__.constructor.apply(this, arguments);
    }

    return Auth;

  })(Parse.auth);
});

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

app.factory('Member', function(Parse) {
  var Member;
  return Member = (function(_super) {
    __extends(Member, _super);

    function Member() {
      return Member.__super__.constructor.apply(this, arguments);
    }

    Member.configure("Member", "firstname", "lastname", "email", "capacity", "pending_rushees", "friends", "completed_cds", "date_last_submitted");

    return Member;

  })(Parse.Model);
});

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

app.factory('Report', function(Parse) {
  var Report;
  return Report = (function(_super) {
    __extends(Report, _super);

    function Report() {
      return Report.__super__.constructor.apply(this, arguments);
    }

    Report.configure("Report", "memberId", "rusheeId", "fields");

    return Report;

  })(Parse.Model);
});

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

app.factory('Rushee', function(Parse) {
  var Rushee;
  return Rushee = (function(_super) {
    __extends(Rushee, _super);

    function Rushee() {
      return Rushee.__super__.constructor.apply(this, arguments);
    }

    Rushee.configure("Rushee", "email", "firstname", "lastname", "pending_member", "second_pending_member", "completed_cds", "date_last_completed", "date_last_assigned");

    return Rushee;

  })(Parse.Model);
});

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

app.factory('User', function(ParseDefaultUser) {
  var User;
  return User = (function(_super) {
    __extends(User, _super);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    User.configure("User", "username", "password", "member");

    return User;

  })(ParseDefaultUser);
});

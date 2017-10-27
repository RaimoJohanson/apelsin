App.controller("formSubmitter", function($http, $scope, $location, $window) {


 $scope.formSubmit = function(realm_id, method) {
  $scope.form = {};
  console.log($scope.form);

  function success(response) {


   //$location.path();
   $window.location.reload();

  }

  function error() {
   alert('ERROR');
  }
  if (method == 'put') $http.put("/" + realm_id + "/vehicles", $scope.kek).then(success, error);
  else $http.post("/" + realm_id + "/vehicles", $scope.kek).then(success, error);
 };

});

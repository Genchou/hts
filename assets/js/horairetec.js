var horaireTec = angular.module("horaireTec", []);
// horaireTec.config(function($httpProvider) {
//     $httpProvider.defaults.useXDomain = true;
//     delete $httpProvider.defaults.headers.common['X-Requested-With'];
// });

horaireTec.controller("SchedulesController", function SchedulesController($scope, $http) {
    $scope.schedule = undefined;
    $scope.data = {};
    $scope.direction = 0;
    $scope.lines = {};
    $scope.page = 1;
    $scope.iPerPage = 10;
    $scope.pageStart = 0;
    $scope.pageEnd = 9;
    $scope.pageMax = 1;

    $http.get("http://localhost:5678/lines").then(function successCallback(response) {
        // console.log(response.data);
        $scope.lines = response.data;
    }, function errorCallback(response) {
        console.error("Error with XHR request");
        console.error(response);
    });

    $scope.changeLine = function(line) {
        var url = "http://localhost:5678/schedule/" + line.id;
        $http.get(url).then(function successCallback(response) {
            // console.log("Successful XHR");
            // console.log(response.data);
            $scope.data = response.data;
            $scope.schedule = $scope.data.items[$scope.direction];
            var length = $scope.schedule.horaire.trips.length;
            if (length % $scope.iPerPage > 0) {
                $scope.pageMax = Math.floor(length / $scope.iPerPage) + 1;
            } else {
                $scope.pageMax = Math.floor(length / $scope.iPerPage);
            }
            console.log($scope.schedule.length);
        }, function errorCallback(response) {
            console.error("Error with XHR request");
            console.error(response);
        });
    };

    $scope.switchLineDirection = function() {
        if ($scope.direction == 0) {
            $scope.direction = 1;
        } else {
            $scope.direction = 0;
        }
        $scope.schedule = $scope.data.items[$scope.direction];
    };

    $scope.pageDown = function() {
        if ($scope.page > 1) {
            $scope.page--;
            $scope.pageStart = ($scope.iPerPage * $scope.page) - $scope.iPerPage;
            $scope.pageEnd = ($scope.iPerPage * $scope.page) - 1;
        }
    };

    $scope.pageUp = function() {
        if ($scope.page < $scope.pageMax) {
            $scope.page++;
            $scope.pageStart = ($scope.iPerPage * $scope.page) - $scope.iPerPage;
            $scope.pageEnd = ($scope.iPerPage * $scope.page) - 1;
        }
    };

});

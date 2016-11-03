angular.module('NDXHackathon').controller('addJoinCtrl', ['$scope', 'tableList', 'joinsList', 'currentJoin', function($scope, tableList, joinsList, currentJoin) {
    $scope.tables = tableList;
    $scope.currentJoin = currentJoin;
    $scope.join = {
        "joinName": "",
        "tableFrom": "",
        "tableTo": "",
        "joinCardinality": "",
        "joinActive": "",
        "joinColumns": [{
            "columnFrom": "",
            "columnTo": ""
        }]
    };
    $scope.save = function() {
        console.log($scope.join);
        joinsList.push($scope.join);
        $scope.closeThisDialog();
    }
    $scope.selectedFromTable = function(table) {
        var selTable = $scope.tables.filter(function(obj) {
            return obj.tableName == table;
        });
        $scope.fromCols = selTable[0].columns;
    }
    $scope.selectedToTable = function(table) {
        var selTable = $scope.tables.filter(function(obj) {
            return obj.tableName == table;
        });
        $scope.toCols = selTable[0].columns;
    }
    if (currentJoin) {
        $scope.join = currentJoin;
        $scope.selectedFromTable($scope.join.tableFrom);
        $scope.selectedToTable($scope.join.tableTo);
    }
    $scope.addNewJoin = function() {
        $scope.join.joinColumns.push({
            "columnFrom": "",
            "columnTo": ""
        });
    }
    $scope.removeJoin = function(index) {
        $scope.join.joinColumns.splice(index, 1);
    }
}]);
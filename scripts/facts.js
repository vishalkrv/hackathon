angular.module('NDXHackathon').controller('factsCtrl', ['$scope', 'factsList', 'currentFact', 'uiGridConstants', function($scope, factsList, currentFact, uiGridConstants) {
    $scope.factsList = factsList;
    $scope.currentFact = currentFact;
    $scope.removeM = function(index) {
        $scope.fact.measures.splice(index, 1);
    };
    $scope.addM = function() {
        $scope.fact.measures.push({
            "measureName": "",
            "measureColumn": "",
            "measureFormat": "",
            "measureAggregation": "",
            "measurePolarity": "",
            "measureClass": ""
        });
    }
    $scope.fact = {
        "factName": "",
        "factTemplate": "",
        "factTable": "",
        "keys": [{
            "keyDimension": "",
            "keyAttribute": "",
            "keyRole": "",
            "keyColumns": {
                "keyColumn": ""
            }
        }],
        "measures": [{
            "measureName": "",
            "measureColumn": "",
            "measureFormat": "",
            "measureAggregation": "",
            "measurePolarity": "",
            "measureClass": "",
        }]
    };
    if ($scope.currentFact) {
        $scope.fact = currentFact;
    }
    $scope.save = function() {
        if (!$scope.currentFact && $scope.fact.factName !== '') {
            $scope.factsList.push($scope.fact);
        }
        $scope.closeThisDialog();
    }
    $scope.addNewRow = function() {
        $scope.gridOptions.data.push({
            "keyDimension": "",
            "keyAttribute": "",
            "keyRole": ""
        });
    };
    $scope.deleteRow = function(row) {
        var index = $scope.gridOptions.data.indexOf(row.entity);
        $scope.gridOptions.data.splice(index, 1);
    };
    $scope.gridOptions = {
        data: $scope.fact.keys,
        columnDefs: [{
            name: 'keyDimension',
            displayName: 'Key Dimension',
            cellEditableCondition: true
        }, {
            name: 'keyAttribute',
            displayName: 'Key Attribute',
            cellEditableCondition: true
        }, {
            name: 'keyRole',
            displayName: 'Key Role',
            cellEditableCondition: true
        }, {
            name: 'delete',
            displayName: '',
            cellEditableCondition: false,
            cellTemplate: '<button class="btn btn-primary btn-delete" ng-click="grid.appScope.deleteRow(row)">Delete</button>'
        }],
        enableRowSelection: true,
        enableRowHeaderSelection: true,
        multiSelect: false,
        onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
        }
    };
}]);
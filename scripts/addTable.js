angular.module('NDXHackathon').controller('addTableCtrl', ['$scope', function($scope) {
    $scope.table = {
        tableName:'',
        tableSource:'',
        tableType:'',
        tableQuery:''
    };
    $scope.gridOptions = {
        data: [],
        columnDefs: [{
            name: 'columnName',
            displayName: 'Name',
            cellEditableCondition: true
        }, {
            name: 'columnIsKey',
            displayName: 'Is Key',
            cellEditableCondition: true
        }, {
            name: 'columnHeader',
            displayName: 'Header',
            cellEditableCondition: true
        }, {
            name: 'columnDataType',
            displayName: 'Data Type',
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
    $scope.addCol = function() {
        $scope.gridOptions.data.push({
            "columnName": "",
            "columnHeader": "",
            "columnDataType": "string",
            "columnIsKey": "N"
        });
    };
    $scope.addCol();
    $scope.save = function() {
        $scope.table.columns = $scope.gridOptions.data;
        $scope.closeThisDialog($scope.table);
    };
}]);
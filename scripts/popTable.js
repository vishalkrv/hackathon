angular.module('NDXHackathon').controller('popTableCtrl', ['$scope', 'tableInfo', 'uiGridConstants', function($scope, tableInfo, uiGridConstants){
    $scope.table = tableInfo.data
    $scope.editOptions = {
        canEdit : false
    };
    $scope.editable = function () {
        return $scope.editOptions.canEdit;
    };
    $scope.edit = function(){
        $scope.editOptions.canEdit = true;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
    }
    $scope.addNewRow = function(){
        $scope.table.columns.push({
            "columnName": "",
            "columnHeader": "",
            "columnDataType": "",
            "columnIsKey": ""
        });
    };
    $scope.deleteRow = function(row) {
        var index = $scope.gridOptions.data.indexOf(row.entity);
        $scope.gridOptions.data.splice(index, 1);
   };
    $scope.gridOptions = {
        data:$scope.table.columns,
        columnDefs: [{
            name: 'columnName',
            displayName: 'Name',
            cellEditableCondition: $scope.editable
        },{
            name: 'columnIsKey',
            displayName: 'Is Key',
            cellEditableCondition: $scope.editable
        },{
            name: 'columnHeader',
            displayName: 'Header',
            cellEditableCondition: $scope.editable
        }, {
            name: 'columnDataType',
            displayName: 'Data Type',
            cellEditableCondition: $scope.editable
        }, {
            name: 'delete',
            displayName: '',
            cellEditableCondition: false,
            cellTemplate: '<button class="btn btn-primary btn-delete" ng-click="grid.appScope.deleteRow(row)">Delete</button>'
        }],
        enableRowSelection: true,
        enableRowHeaderSelection: true,
        multiSelect: false,
        onRegisterApi: function( gridApi ) {
            $scope.gridApi = gridApi;
        }
    };
}]);
angular.module('NDXHackathon').controller('addDimensionsCtrl', ['$scope', 'dimensionsList', 'currentDimension', 'uiGridConstants', function($scope, dimensionsList, currentDimension, uiGridConstants) {
    $scope.dimensionsList = dimensionsList;
    $scope.currentDimension = currentDimension;
    $scope.dimension = {
        "dimensionName": "",
        "dimensionTemplate": "",
        "attributes": [{
            "attributeName": "",
            "attributeTemplate": "",
            "attributeTable": "",
            "attributeNameColumn": "",
            "attributeSortColumn": "",
            "attributeFormat": "none",
            "attributeParents": [{
                "attrbiuteParent": ""
            }],
            "attributeKeyColumns": [{
                "attrbiuteKeyTable": "",
                "attrbiuteKeyColumn": ""
            }]
        }],
        "hierarchies": [{
            "hierarchyName": "",
            "levels": [{
                "levelAttribute": ""
            }]
        }]
    };
    $scope.addH = function() {
        $scope.dimension.hierarchies.push({
            "hierarchyName": "",
            "levels": [{
                "levelAttribute": ""
            }]
        });
    };
    $scope.removeH = function(index) {
        $scope.dimension.hierarchies.splice(index, 1);
    };
    $scope.addLevel = function(parent, index) {
        $scope.dimension.hierarchies[parent].levels.push({
            "levelAttribute": ""
        });
    };
    $scope.removeLevel = function(parent, index) {
        $scope.dimension.hierarchies[parent].levels.splice(index, 1);
    };
    if ($scope.currentDimension) {
        $scope.dimension = currentDimension;
    }
    $scope.save = function() {
        if (!$scope.currentDimension && $scope.dimension.dimensionName) {
            $scope.dimensionsList.push($scope.dimension);
        }
        $scope.closeThisDialog();
    }
    $scope.addNewRow = function() {
        $scope.gridOptions.data.push({
            "attributeName": "",
            "attributeTemplate": "",
            "attributeTable": "",
            "attributeNameColumn": "",
            "attributeSortColumn": ""
        });
    };
    $scope.deleteRow = function(row) {
        var index = $scope.gridOptions.data.indexOf(row.entity);
        $scope.gridOptions.data.splice(index, 1);
    };
    $scope.gridOptions = {
        data: $scope.dimension.attributes,
        columnDefs: [{
            name: 'attributeName',
            displayName: 'Name',
            cellEditableCondition: true
        }, {
            name: 'attributeTemplate',
            displayName: 'Template Name',
            cellEditableCondition: true
        }, {
            name: 'attributeTable',
            displayName: 'Table',
            cellEditableCondition: true
        }, {
            name: 'attributeNameColumn',
            displayName: 'Column Name',
            cellEditableCondition: true
        }, {
            name: 'attributeSortColumn',
            displayName: 'Sort Column Name',
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
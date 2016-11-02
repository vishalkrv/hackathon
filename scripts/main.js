var app = angular.module('NDXHackathon', ['NDXHackathon.directives', 'ui.bootstrap', 'ngAnimate', 'ngDialog', 'angularTreeview', 'ngStorage','ui.grid', 'ui.grid.edit']);
jsPlumb.ready(function() {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['NDXHackathon']);
    });
});
app.constant('myConfig', {
    "url": 'assets/sample/'
});
app.controller('MainCtrl', function($scope, $http, ngDialog, myConfig, $localStorage) {
    $scope.zoomlevel = 55;
    $scope.pos_x = 214;
    $scope.pos_y = 148;
    if (typeof $localStorage.lastUUID === 'undefined') {
        $localStorage.lastUUID = 2000;
    }
    var getNextUUID = function() {
        $localStorage.lastUUID++;
        return $localStorage.lastUUID;
    }
    var database = {
        load: function() {
            $http.get(myConfig.url + 'database.json').then(function(response) {
                database.list = response.data.database;
                //popup.open();
                popup.loadData();
            });
        },
        list: ''
    };
    database.load();
    var popup = {
        open: function() {
            var modal = ngDialog.open({
                template: 'views/modalContent.html',
                className: 'ngdialog-theme-default',
                controller: 'popupCtrl',
                resolve: {
                    database: function() {
                        return database.list;
                    }
                }
            });
            modal.closePromise.then(function(data) {
                popup.loadData();
            });
        },
        loadData: function() {
            $http.get(myConfig.url + 'sample.json').then(function(response) {
                $scope.table.list = response.data;
                $scope.loadPlumbs();
                console.log($scope.table.list);
            });
        }
    };
    $scope.getIndexOf = function(arr, val, prop) {
        var l = arr.length,
            k = 0;
        for (k = 0; k < l; k = k + 1) {
            if (arr[k][prop] === val) {
                return k;
            }
        }
    }
    $scope.loadPlumbs = function() {
        // Adds all the tables to the CANVAS
        angular.forEach($scope.table.list.schemaDefinition.physical.tables, function(val, idx) {
            $scope.table.addToCanvas(idx);
        });
        $scope.drawJoins();
    }
    $scope.drawJoins = function() {
        // Maps evevry table with the other table based on the JOINS mapped in INPUT json
        angular.forEach($scope.table.list.schemaDefinition.physical.joins, function(val, idx) {
            var matchedFromTable = $scope.table.tableObjects.filter(function(joinObj) {
                if(val.joinActive === 'Y'){
                    return (val.tableFrom === joinObj.tableName);
                }
            });
            var matchedToTable = $scope.table.tableObjects.filter(function(joinObj) {
                // var foundColumn = joinObj.columns.filter(function(colObj) {
                //     return (val.joinColumns[0].columnTo === colObj.columnName)
                // });
                return (val.tableTo === joinObj.tableName) //&& foundColumn.length > 0;
            });
            // var matchedToTable = $scope.table.tableObjects.filter(function(joinObj) {
            //     if(val.joinActive === 'Y'){
            //         return (val.joinColumns[0].columnTo === joinObj.joinColumns[0].columnFrom);
            //     }
            // });
            if (matchedFromTable.length > 0) {
                var conn = {
                    uuid: matchedToTable[0].targets[0].uuid
                };
                if (matchedFromTable[0].sources[0].connections == undefined) {
                    matchedFromTable[0].sources[0].connections = [];
                }
                matchedFromTable[0].sources[0].connections.push(conn);
            }
        });
    }
    $scope.table = {
        list: '',
        openPopup: function(obj, key) {
            var modal = ngDialog.open({
                template: 'views/popupInfo.html',
                className: 'ngdialog-theme-default',
                controller: 'popupInfoCtrl',
                resolve: {
                    data: function() {
                        return {
                            obj: obj,
                            key: key
                        };
                    }
                }
            });
            modal.closePromise.then(function(data) {
                console.log(data);
            });
        },
        add: function() {
            this.list.physical.tables.push({
                tableName: 'DummyTable',
                tableQuery: 'Random Query',
                tableSource: 'SQL',
                tableType: 'query',
                columns: [{
                    columnName: 'Name1',
                    columnDataType: 'string',
                    columnHeader: 'Header_Name',
                    columnIsKey: 'Y',
                }]
            });
        },
        //Not using this
        addColumn: function(index) {
            this.list.physical.tables[index].columns.push({
                columnName: 'Dummy Column',
                columnDataType: 'string',
                columnHeader: 'Dummy_Column',
                columnIsKey: 'Y',
            });
        },
        //openTablePopup
        openTableDetails: function(index) {
            var data = this.tableObjects[index]
            var tModal = ngDialog.open({
                template: 'views/tableDetails.html',
                className: 'ngdialog-theme-default bigPopup',
                controller: 'popTableCtrl',
                resolve: {
                    tableInfo: function() {
                        return {
                            data: data,
                            index: index
                        };
                    }
                }
            });
            tModal.closePromise.then(function(data) {
                console.log(data);
            });
        },
        addToCanvas: function(index) {
            var obj = {
                'sources': [{
                    uuid: getNextUUID()
                }, {
                    uuid: getNextUUID()
                }],
                'targets': [{
                    uuid: getNextUUID()
                }, {
                    uuid: getNextUUID()
                }],
                'x': 10 + 150 * index,
                'y': 10 + 50 * index
            };
            angular.extend(this.list.schemaDefinition.physical.tables[index], obj);
            this.tableObjects.push(this.list.schemaDefinition.physical.tables[index]);
        },
        tableObjects: [],
        close: function($index) {
            this.tableObjects.splice($index, 1);
        }
    };
    /**
     *
     * JSPLUMB CONFIG AND CONNECTION STARTS
     *
     */
    $scope.targetEndpointStyle = {
        endpoint: "Dot",
        paintStyle: {
            fillStyle: "#7AB02C",
            radius: 11
        },
        maxConnections: -1,
        isTarget: true
    };
    $scope.sourceEndpointStyle = {
        endpoint: "Dot",
        paintStyle: {
            strokeStyle: "#7AB02C",
            fillStyle: "transparent",
            radius: 7,
            lineWidth: 3
        },
        isSource: true,
        maxConnections: -1,
        connector: ["Flowchart", {
            stub: [30, 30],
            gap: 20,
            cornerRadius: 10,
            alwaysRespectStubs: true
        }],
        connectorStyle: {
            lineWidth: 4,
            strokeStyle: "#61B7CF",
            joinstyle: "round",
            outlineColor: "white",
            outlineWidth: 2
        },
        connectorHoverStyle: {
            fillStyle: "#216477",
            strokeStyle: "#216477"
        }
    };
    $scope.onConnection = function(instance, connection, targetUUID, sourceUUID) {
        angular.forEach($scope.table.tableObjects, function(state) {
            angular.forEach(state.sources, function(source) {
                if (source.uuid == sourceUUID) {
                    if (typeof source.connections === 'undefined') source.connections = [];
                    source.connections.push({
                        'uuid': targetUUID
                    });
                    $scope.$apply();
                }
            });
        });
    };
});
app.controller('popupCtrl', ['$scope', 'database', function($scope, database) {
    $scope.databaseList = database;
    $scope.save = function() {
        $scope.closeThisDialog($scope.selectedDatabase);
    };
}]);
app.controller('popupInfoCtrl', ['$scope', 'data', function($scope, data) {
    $scope.data = data;
    console.log(data)
}]);

app.controller('popTableCtrl', ['$scope', 'tableInfo', 'uiGridConstants', function($scope, tableInfo, uiGridConstants){
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
        }],
        enableRowSelection: true,
        enableRowHeaderSelection: true,
        multiSelect: false,
        onRegisterApi: function( gridApi ) {
            $scope.gridApi = gridApi;
        }
    };
}])

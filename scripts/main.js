var app = angular.module('NDXHackathon', ['NDXHackathon.directives', 'ui.bootstrap', 'ngAnimate', 'ngDialog', 'angularTreeview', 'ngStorage', 'ui.grid', 'ui.grid.edit']);
jsPlumb.ready(function() {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['NDXHackathon']);
    });
});
angular.module('NDXHackathon').config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.timeout = 5000;
}]);
app.constant('myConfig', {
    "url": 'assets/sample/'
});
angular.module('NDXHackathon').controller('MainCtrl', function($scope, $http, ngDialog, myConfig, $localStorage, $interval) {
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
    $scope.loaderMessage = '';
    $scope.loader = function() {
        var timer = 0;
        $interval.cancel(timer);
        var value = 0;
        timer = $interval(function() {
            value++;
            if (value == 20) {
                $scope.loaderMessage = "Analysing Configuration";
            } else if (value == 40) {
                $scope.loaderMessage = "Analysing Sources";
            } else if (value == 60) {
                $scope.loaderMessage = "Analysing Tables";
            } else if (value == 80) {
                $scope.loaderMessage = "Analysing Joins";
            } else if (value == 100) {
                $scope.loaderMessage = "Analysing Dimensions";
            } else if (value == 120) {
                $scope.loaderMessage = "Analysing Facts";
            } else if (value == 140) {
                $scope.loaderMessage = "Loading...";
            } else if (value == 160) {
                $scope.loaderMessage = "Loading JSON";
            } else if (value == 170) {
                $scope.loaderMessage = "Ready";
            } else if (value == 180) {
                $interval.cancel(timer);
                $scope.loaderMessage = false;
            }
        }, 100);
    };
    //$scope.loader();
    database.load();
    var popup = {
        open: function() {
            var modal = ngDialog.open({
                closeByEscape: false,
                closeByDocument: false,
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
    $scope.jsonview = {
        json: false
    }
    $scope.showJson = function() {
        $scope.jsonview.json = !$scope.jsonview.json;
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
                if (val.joinActive === 'Y') {
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
        addJoin: function() {
            var popJoin = ngDialog.open({
                closeByEscape: false,
                closeByDocument: false,
                template: 'views/addJoin.html',
                className: 'ngdialog-theme-default bigPopup',
                controller: 'addJoinCtrl',
                resolve: {
                    tableList: function() {
                        return $scope.table.list.schemaDefinition.physical.tables
                    },
                    joinsList: function() {
                        return $scope.table.list.schemaDefinition.physical.joins
                    },
                    currentJoin: function() {
                        return undefined;
                    }
                }
            });
            popJoin.closePromise.then(function(data) {
                console.log(data);
            });
        },
        openPopup: function(obj, key) {
            var modal = ngDialog.open({
                template: 'views/popupInfo.html',
                className: 'ngdialog-theme-default',
                controller: 'popupInfoCtrl',
                closeByEscape: false,
                closeByDocument: false,
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
        addTable: function() {
            var popTable = ngDialog.open({
                closeByEscape: false,
                closeByDocument: false,
                template: 'views/addTable.html',
                className: 'ngdialog-theme-default bigPopup',
                controller: 'addTableCtrl'
            });
            popTable.closePromise.then(function(data) {
                $scope.table.list.schemaDefinition.physical.tables.push(data.value);
                $scope.table.tableObjects.push(data.value);
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
                closeByEscape: false,
                closeByDocument: false,
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
        },
        removeTable: function(index) {
            if (confirm("Are you sure, you want to delete '" + $scope.table.tableObjects[index].tableName + "' table?")) {
                $scope.table.tableObjects.splice(index, 1);
                $scope.table.list.schemaDefinition.physical.tables.splice(index, 1);
            }
        },
        addDimensions: function() {
            var popJoin = ngDialog.open({
                template: 'views/addDimension.html',
                className: 'ngdialog-theme-default bigPopup',
                controller: 'addDimensionsCtrl',
                closeByEscape: false,
                closeByDocument: false,
                resolve: {
                    dimensionsList: function() {
                        return $scope.table.list.schemaDefinition.logical.dimensions
                    },
                    currentDimension: function() {
                        return undefined
                    }
                }
            });
            popJoin.closePromise.then(function(data) {
                console.log(data);
            });
        },
        addFacts: function() {
            var popJoin = ngDialog.open({
                template: 'views/addFact.html',
                className: 'ngdialog-theme-default bigPopup',
                controller: 'factsCtrl',
                closeByEscape: false,
                closeByDocument: false,
                resolve: {
                    factsList: function() {
                        return $scope.table.list.schemaDefinition.logical.facts
                    },
                    currentFact: function() {
                        return undefined
                    }
                }
            });
            popJoin.closePromise.then(function(data) {
                console.log(data);
            });
        },
        openDimensionDetails: function(index) {
            var popJoin = ngDialog.open({
                template: 'views/addDimension.html',
                className: 'ngdialog-theme-default bigPopup',
                controller: 'addDimensionsCtrl',
                closeByEscape: false,
                closeByDocument: false,
                resolve: {
                    dimensionsList: function() {
                        return $scope.table.list.schemaDefinition.logical.dimensions
                    },
                    currentDimension: function() {
                        return $scope.table.list.schemaDefinition.logical.dimensions[index]
                    }
                }
            });
            popJoin.closePromise.then(function(data) {
                console.log(data);
            });
        },
        openFactDetails: function(index) {
            var popJoin = ngDialog.open({
                template: 'views/addFact.html',
                className: 'ngdialog-theme-default bigPopup',
                controller: 'factsCtrl',
                closeByEscape: false,
                closeByDocument: false,
                resolve: {
                    factsList: function() {
                        return $scope.table.list.schemaDefinition.logical.facts
                    },
                    currentFact: function() {
                        return $scope.table.list.schemaDefinition.logical.facts[index]
                    }
                }
            });
            popJoin.closePromise.then(function(data) {
                console.log(data);
            });
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
angular.module('NDXHackathon').controller('popupCtrl', ['$scope', 'database', function($scope, database) {
    $scope.databaseList = database;
    $scope.save = function() {
        $scope.closeThisDialog($scope.selectedDatabase);
    };
}]);
angular.module('NDXHackathon').controller('popupInfoCtrl', ['$scope', 'data', function($scope, data) {
    $scope.data = data;
    console.log(data);
}]);


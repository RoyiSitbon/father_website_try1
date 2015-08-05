(function(){

  var errorSrc = angular.module("errorSrc");
  errorSrc.factory("errorService",["$http","$q","$filter",function($http,$q,$filter){

      return {

        serviceFunc : function(path,currentError,pencilError,trashError,planeError,allErrors){
          var defer = $q.defer();
          var dataObj = {};
          if(currentError){ currentError.detection_index = currentError.detection_index ? parseInt(currentError.detection_index) : "" }; 
          switch(path){
            case "getAllErrors" : dataObj = {};
                                  break;
            case "editError" :    dataObj = {editError:pencilError,currentError:planeError};
                                  break;
            case "addError" :     var type = currentError.detection_type;
                                  var allErrorsByType = $filter("filterByType")(allErrors,type);
                                  currentError.detection_index= allErrorsByType.length>0 ? Math.max.apply(Math,allErrorsByType.map(function(o){return o.detection_index;})) + 1 : 1;
                                  dataObj = {currentError:currentError};
                                  break;
            case "deleteError" :  dataObj = {currentError:trashError};
                                  break;
          }
          $http({
            method:"POST",
            url:"http://" + location.host + "/" + path,
            data:dataObj,
            headers: {'Content-Type': 'application/json'}
          }).success(function (data, status, headers, config) {
            defer.resolve(data);
          }).error(function (data, status, headers, config) {
            console.log('error recieving data');
            defer.reject(data);
          });

          return defer.promise;
        },
        tableSearched : function(searchedErrors,allErrors,currentError){
          searchedErrors.length = 0;
          var detection_typeFlag = false,
              nameFlag = false,
              osFlag = false,
              regkeyFlag = false,
              keyvalueFlag = false;
          for(var i=0; i<allErrors.length; i++){
              currentError.detection_type ? (allErrors[i].detection_type.toUpperCase().indexOf(currentError.detection_type.toUpperCase()) > -1 ? detection_typeFlag = true : detection_typeFlag = false) : detection_typeFlag = true;
              currentError.name ? (allErrors[i].name.toUpperCase().indexOf(currentError.name.toUpperCase()) > -1 ? nameFlag = true : nameFlag = false) : nameFlag = true;
              currentError.os ? (allErrors[i].os.toUpperCase().indexOf(currentError.os.toUpperCase()) > -1 ? osFlag = true : osFlag = false) : osFlag = true;
              currentError.regkey ? (allErrors[i].regkey.toUpperCase().indexOf(currentError.regkey.toUpperCase()) > -1 ? regkeyFlag = true : regkeyFlag = false) : regkeyFlag = true;
              currentError.keyvalue ? (allErrors[i].keyvalue.toUpperCase().indexOf(currentError.keyvalue.toUpperCase()) > -1 ? keyvalueFlag = true : keyvalueFlag = false) : keyvalueFlag = true;
              if(detection_typeFlag && nameFlag && osFlag && regkeyFlag && keyvalueFlag){
                var searchedOrg = allErrors[i];
                searchedOrg.os = searchedOrg.os.toLowerCase();
                searchedErrors.push(searchedOrg);
              }
          }
        },
        editErrorPromise : function(error,planeError,pencilError){
          var returnObj = {};
          planeError=JSON.parse(JSON.stringify(error));
          if(planeError.detection_type == pencilError.detection_type && planeError.detection_index == pencilError.detection_index && planeError.name == pencilError.name && planeError.os == pencilError.os && planeError.regkey == pencilError.regkey && planeError.keyvalue == pencilError.keyvalue){
            returnObj = {error:"No fields where changed",planeError:planeError};
          } else {
            if(planeError.detection_type != pencilError.detection_type){
                var allErrorsByType = $filter("filterByType")(allErrors,planeError.detection_type);
                planeError.detection_index= allErrorsByType.length>0 ? Math.max.apply(Math,allErrorsByType.map(function(o){return o.detection_index;})) + 1 : 1;
            }
            returnObj = {planeError: planeError};
          } 
          return returnObj;
        },
        addErrorPromise: function(currentError){
          var errorMsg = "";
          if(!(currentError.detection_type&&currentError.name&&currentError.os&&currentError.regkey)){
             errorMsg = "didnt insert all must have fields";
          } else if(!currentError.keyvalue){
            currentError.keyvalue = "";
          }
          return errorMsg
        }

      }
    }]);
 
})();
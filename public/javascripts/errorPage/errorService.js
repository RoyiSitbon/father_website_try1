(function(){

  var errorSrc = angular.module("errorSrc",['ngSanitize','ngCookies']);
  errorSrc.factory("errorService",["$http","$q", function($http,$q){
      return {
        serviceFunc : function(path,currentError,pencilError,trashError,planeError){
          var defer = $q.defer();
          var dataObj = {};
          if(currentError){ currentError.detection_index = currentError.detection_index ? parseInt(currentError.detection_index) : "" }; 
          switch(path){
            case "getAllErrors" : dataObj = {};
                                  break;
            case "editError" :    dataObj = {editError:pencilError,currentError:planeError};
                                  break;
            case "addError" :     dataObj = {currentError:currentError};
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
          var detection_typeFlag = false;
          var nameFlag = false;
          for(var i=0; i<allErrors.length; i++){
              currentError.detection_type ? (allErrors[i].detection_type == currentError.detection_type ? detection_typeFlag = true : detection_typeFlag = false) : detection_typeFlag = true;
              currentError.name ? (allErrors[i].name == currentError.name ? nameFlag = true : nameFlag = false) : nameFlag = true;

              if(detection_typeFlag && nameFlag){
                searchedErrors.push(allErrors[i]);
              }
          }
        },
        editErrorPromise : function(error,planeError,pencilError){
          var defer = $q.defer();
          planeError=JSON.parse(JSON.stringify(error));
          if(planeError.detection_type == pencilError.detection_type && planeError.detection_index == pencilError.detection_index && planeError.name == pencilError.name){
            showError = {planeError: "No fields where changed"};
            defer.reject({error:"No fields where changed",planeError:planeError});
          } else {
            defer.resolve({planeError: planeError});
          } 
          return defer.promise;
        },
        addErrorPromise: function(currentError){
          var defer = $q.defer();
          if(!(currentError.detection_type&&currentError.name)){
             defer.reject({error:"pls insert all fields"});
          }
          defer.resolve("");
          return defer.promise;
        }

      }
    }]);
 
})();
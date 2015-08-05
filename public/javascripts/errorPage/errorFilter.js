 
(function(){

  var errorSrc = angular.module("errorSrc",['ngSanitize','ngCookies']);
  errorSrc.filter("filterByType",function(){
    return function(objArr,type) {
        var returnedArr = [];

        for(var i=0;i<objArr.length; i++){
        	if(objArr[i].detection_type == type){
        		returnedArr.push(objArr[i]);
        	}
        }
        return returnedArr;
  	}
  });

})();
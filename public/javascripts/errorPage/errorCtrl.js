(function(){

	var errorSrc = angular.module("errorSrc");
	errorSrc.controller("errorController",["$rootScope","$sce","$state","$http","$timeout","errorService",function($rootScope,$sce,$state,$http,$timeout,errorService){

		var vm = this;

		vm.allErrors = [];
		var init = function(){
			vm.searchedSpin = false;
			vm.refreshPressed = false;
			vm.isLoading = false;
			vm.setPencilFlag = false;
			vm.pencilError = {};
			vm.planeError = {}; 
			vm.trashError ={};
			vm.currentError = {};
			vm.searchedErrors = [];
			vm.showError = "";
			vm.editInd = "";
			vm.editType = "";
		}
		init();

		vm.tableVisibility = function(){
		  	vm.showTable = !vm.showTable;
		}

		vm.tableSearched = function(){

			vm.searchedSpin = true;
			errorService.tableSearched(vm.searchedErrors,vm.allErrors,vm.currentError);

			$timeout(function(){
		  		vm.searchedSpin = false;
		  	},1000);

		}

		vm.refresh = function(){
			init();
			vm.refreshPressed = true;
			$timeout(function(){
				vm.currentError.detection_type ='';
				vm.currentError.name ='';
				vm.currentError.os ='';
				vm.currentError.regkey ='';
				vm.currentError.keyvalue ='';
				vm.refreshPressed = false;
			},1000);
		}

		vm.setPencilError = function(error){
			if(vm.editInd == error.detection_index && vm.editType == error.detection_type){
				vm.setPencilFlag = !vm.setPencilFlag;
			} else {
				vm.setPencilFlag = true;
			}
			vm.editInd=error.detection_index;
			vm.editType=error.detection_type;
			vm.pencilError=JSON.parse(JSON.stringify(error));
		}

		vm.definePromiseCall = function(funcName){
		 	vm.isLoading = true;
		 	vm.setPencilFlag = false;
		 	vm.searchedErrors = [];
			vm.editInd="";
			vm.editType="";
			vm.showError = "";
			errorService.serviceFunc(funcName,vm.currentError,vm.pencilError,vm.trashError,vm.planeError,vm.allErrors).then(function(data){
				vm.allErrors = data;
				vm.currentError.detection_type = "";
				vm.currentError.name ="";
				vm.currentError.os ="";
				vm.currentError.regkey ="";
				vm.currentError.keyvalue ="";
				vm.isLoading = false;
			},function(error){
				vm.showError = error;
				vm.isLoading = false;
			});
		}

		vm.definePromiseCall("getAllErrors");

		vm.editError = function(error){
			var returnObj = errorService.editErrorPromise(error,vm.planeError,vm.pencilError);
			if(returnObj.error){
				vm.planeError = returnObj.planeError;	
				vm.showError = returnObj.error;
			} else {
				vm.planeError = returnObj.planeError;	
				vm.definePromiseCall("editError");
			}
		}

		vm.addError = function(){
			var errorMsg = errorService.addErrorPromise(vm.currentError);
			if(errorMsg){	
				vm.showError = errorMsg;
			} else {	
				vm.definePromiseCall("addError");
			}
		}	

		vm.deleteError = function(error){
			vm.trashError = JSON.parse(JSON.stringify(error));
			vm.definePromiseCall("deleteError");
		}	

		vm.downloadkeysArr = function(){
			var doc = new jsPDF();
	        doc.setFontSize(3);
	        var arrObjStr = "";
	        var currObj;
	        for(var i=0;i<vm.searchedErrors.length;i++){
	        	currObj =  '{detection_index:' + vm.searchedErrors[i].detection_index + ',detection_type:\"' + vm.searchedErrors[i].detection_type+'\",name:\"' + vm.searchedErrors[i].name + '\",os:\"' + vm.searchedErrors[i].os + '\",regkey:\"' + vm.searchedErrors[i].regkey + '\",keyvalue:\"' + vm.searchedErrors[i].keyvalue + '\"}';
	        	arrObjStr= arrObjStr ? arrObjStr + ",\n" + currObj: currObj;
	        }
	        doc.text(20, 20, arrObjStr);
	        doc.save('keysArr.pdf');
		}

	}]);

})();
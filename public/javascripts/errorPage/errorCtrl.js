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
				vm.currentError.detection_index = Math.max.apply(Math,vm.allErrors.map(function(o){return o.detection_index;})) + 1;
				vm.refreshPressed = false;
			},1000);
		}

		vm.setPencilError = function(error){
			if(vm.editInd == error.detection_index){
				vm.setPencilFlag = !vm.setPencilFlag;
			} else {
				vm.setPencilFlag = true;
			}
			vm.editInd=error.detection_index;
			vm.pencilError=JSON.parse(JSON.stringify(error));
		}

		vm.definePromiseCall = function(funcName){
		 	vm.isLoading = true;
		 	vm.setPencilFlag = false;
		 	vm.searchedErrors = [];
			vm.editInd="";
			vm.showError = "";
			errorService.serviceFunc(funcName,vm.currentError,vm.pencilError,vm.trashError,vm.planeError).then(function(data){
				vm.allErrors = data;
				vm.currentError.detection_type = "";
				var maxInd = Math.max.apply(Math,vm.allErrors.map(function(o){return o.detection_index;}));
				vm.currentError.detection_index = maxInd!=-Infinity ? maxInd + 1 : 1;
				vm.currentError.name ="";
				vm.isLoading = false;
			},function(error){
				vm.showError = error;
				vm.isLoading = false;
			});
		}

		vm.definePromiseCall("getAllErrors");

		vm.editError = function(error){
			errorService.editErrorPromise(error,vm.planeError,vm.pencilError).then(function(data){
				vm.planeError = data.planeError;	
				vm.definePromiseCall("editError");
			},function(error){
				vm.planeError = error.planeError;	
				vm.showError = error.error;
			});
		}

		vm.addError = function(){
			errorService.addErrorPromise(vm.currentError).then(function(data){
				vm.definePromiseCall("addError");
			},function(error){
				vm.showError = error.error;
			});
		}	

		vm.deleteError = function(error){
			vm.trashError = JSON.parse(JSON.stringify(error));
			vm.definePromiseCall("deleteError");
		}	

	}]);

})();
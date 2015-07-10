(function(){
    var app = angular.module("app",['ui.router.state','headerSrc','errorSrc']).
    config(["$stateProvider","$urlRouterProvider","$locationProvider",function($stateProvider,$urlRouterProvider,$locationProvider) {
        $stateProvider.
            state('root',{
              url: '',
              abstract: true,
              views: {
                'header@': {
                  controller: 'headerController',
                  controllerAs:'headerCtrl',   
                  templateUrl: 'javascripts/components/header/header.html'
                }//,
                // 'footer':{
                //   templateUrl: './javascript/components/footer/footer.html',
                //   controller: 'FooterController',
                //   controllerAs:'FooterCtrl'
                // }
              }
            }).
            state('root.errorTable', {
                url: '/',
                parent: 'root',
                views:{
                    "container@":{
                        controller:'errorController',
                        controllerAs:'errorCtrl',
                        templateUrl: 'javascripts/errorPage/errorTable.html'
                    }
                }
            });
            /*.otherwise({
                url: '/',
                templateUrl: '../../login.html',
                controller:'loginCtrl'
            })*/

            /*$urlRouterProvider.otherwise({
    			url: '/',
    	        templateUrl: '../../login.html',
    	        controller:'loginCtrl'
    	    });*/

    	   $locationProvider.html5Mode({
              enabled: true,
              requireBase: false
            });
    	    $locationProvider.hashPrefix('!');
}]).run(function($rootScope,$state) {

    $rootScope.otherParams = {
        
    }

}); 

})();


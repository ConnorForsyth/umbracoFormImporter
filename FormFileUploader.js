// This example makes use of the ng-file-upload directive by Danial Farid https://github.com/danialfarid/ng-file-upload
// It needs to be injected into the Angular app.
// You could probably use the native HTML5 file upload API if you didn't want to rely on any external directives.

angular.module("umbraco").controller('FormFileUploader', function ($scope, $rootScope, Upload, fileApiService) {

    /*-------------------------------------------------------------------
     * Initialization Methods
     * ------------------------------------------------------------------*/

    /**
     * @ngdoc method
     * @name init
     * @function
     * 
     * @description - Called when the $scope is initialized.
     */
	
	$rootScope.importType = "form";
	
    $scope.init = function () {
        $scope.setVariables();
    };

    /**
     * @ngdoc method
     * @name setVariables
     * @function
     * 
     * @description - Sets the initial states of the $scope variables.
     */
    $scope.setVariables = function () {
        $scope.file = false;
        $scope.isUploading = false;	
    };
	
	
	
	$scope.dataChange = function(value)
	{
		$rootScope.importType = value;		
	}
	

    /*-------------------------------------------------------------------
     * Event Handler Methods
     *-------------------------------------------------------------------*/

    /**
     * @ngdoc method
     * @name acceptSelectedFile
     * @function
     * 
     * @param {array of file} files - One or more files selected by the HTML5 File Upload API.
     * @description - Get the file selected and store it in scope. This current example restricts the upload to a single file, so only take the first.
     */
    $scope.acceptSelectedFile = function (files) {
        if (files.length > 0) {
            $scope.file = files[0];
        }
    };

    /*-------------------------------------------------------------------
     * Helper Methods
     * ------------------------------------------------------------------*/

    /**
     * @ngdoc method
     * @name uploadFile
     * @function
     * 
     * @description - Uploads a file to the backend.
     */
	/*Triggers when the user clicks on the Upload button*/
    $scope.uploadFile = function () {
        if (!$scope.isUploading) {
            if ($scope.file) {
                $scope.isUploading = true;
                var promise = fileApiService.uploadFileToServer($scope.file);
                promise.then(function (response) {
                    if (response) {
                        $scope.feedback = {
                            success: true,
                            filename: response
                        }
                        console.info('File upload success: ' + $scope.feedback.filename);
                    }
                    $scope.isUploading = false;
                }, function (reason) {
                    console.info("File upload failed. " + reason);
                    $scope.isUploading = false;
                });
            } else {
                console.info("Please select a file to upload." + $scope.importType);
                $scope.isUploading = false;
            }
        }
    };

    /*
    * Clears the feedback
    */
    $scope.clearFeedback = function () {
        $scope.feedback = null;
    }

    $scope.init();

});

angular.module("umbraco.resources").factory("fileApiService", function ($http, $rootScope) {

    var fileApiFactory = {};

    /**
     * @ngdoc method
     * @name importFile
     * @function
     * 
     * @param {file} file - File object acquired via File Upload API.
     * @description - Upload a file to the server.
     */
    fileApiFactory.uploadFileToServer = function (file) {
        var request = {
            file: file
        };
		console.log(request);
		
        return $http({
            method: 'POST',
            url: "backoffice/FormFileUploader/FileUploadApi/UploadFileToServer",
            // If using Angular version <1.3, use Content-Type: false.
            // Otherwise, use Content-Type: undefined
            headers: { 'Content-Type': false },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("file", data.file);
				return formData;
            },
			params:{importType: $rootScope.importType},
            data: request
        }).then(function (response) {
            if (response) {
                return response.data;
            } else {
                return false;
            }
        });
    };

    return fileApiFactory;

});

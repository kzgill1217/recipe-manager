(function(){

  angular.module('app').controller('UIController', ['$scope', '$ionicModal', '$ionicPlatform', 'RecipeService', UIController]);

  function UIController($scope, $ionicModal, $ionicPlatform, recipeService) {

	  var vm = this;

	  // Initialize the database.
	  $ionicPlatform.ready(function() {

		  recipeService.initDB();

		  // Get all recipe records from the database.
		  recipeService.getAllRecipes().then(function(recipes) {

			  vm.recipes = recipes;

		  });
	  });

	  // Initialize the add or edit modal view.
	  $ionicModal.fromTemplateUrl('add-or-edit-recipe.html', {

		  scope: $scope,

		  animation: 'slide-in-up'

	  }).then(function(modal) {

		  $scope.modal = modal;

	  });

     // Initialize the view recipe modal
	  $ionicModal.fromTemplateUrl('view-recipe.html', {

		  scope: $scope,

		  animation: 'slide-in-up'

	  }).then(function(modal) {

		  $scope.modalView = modal;

	  });


    $scope.table = { fields: [] };

    $scope.addFormField = function() {
      $scope.table.fields.push($scope.table.fields.length);
    }

    $scope.del = function(i){
      console.log(i);
      $scope.table.fields.splice(i,1);
    }

    $scope.deleteIngredient = function(i){
      console.log(i);
      $scope.recipe.ingredients.splice(i,1);
    }


    vm.showViewRecipeModal = function(recipe) {

		  $scope.recipe = recipe;

		  $scope.action = 'View';

		  $scope.modalView.show();

	  };

	  vm.showAddRecipeModal = function() {

		  $scope.recipe = {};

		  $scope.action = 'Add';

		  $scope.isAdd = true;

		  $scope.modal.show();
	  };

	  vm.showEditRecipeModal = function(recipe) {

		  $scope.recipe = recipe;
		  $scope.action = 'Edit';
		  $scope.isAdd = false;
      $scope.modalView.hide();
		  $scope.modal.show();
	  };



	  $scope.saveRecipe = function() {


		  if ($scope.isAdd) {
         $scope.recipe.ingredients = [];
        for(var k = 0; k < $scope.table.fields.length; k++)
        {
          $scope.recipe.ingredients.push($scope.table.fields[k]);
          console.log($scope.recipe);
        }
		  	recipeService.addRecipe($scope.recipe);
        console.log($scope.recipe);
		  } else {
         for(var k = 0; k < $scope.table.fields.length; k++)
        {
          $scope.recipe.ingredients.push($scope.table.fields[k]);
          console.log($scope.recipe);
        }
			    recipeService.updateRecipe($scope.recipe);
		  }

      $scope.table = { fields: [] };
		  $scope.modal.hide();
	  };




	  $scope.deleteRecipe = function() {

		  recipeService.deleteRecipe($scope.recipe);

		  $scope.modal.hide();
	  };




	  $scope.$on('$destroy', function() {

		  $scope.modal.remove();

	  });

	return vm;
}
})();

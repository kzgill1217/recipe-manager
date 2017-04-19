(function() {

// Recipe Service methods

angular.module('app').factory('RecipeService', ['$q', RecipeService]);

  function RecipeService($q) {

          // initializing variables in the service scope
          var db;
          var recipes;

          // returning all of the service functions
          return {

            initDB: initDB,
            getAllRecipes: getAllRecipes,
            addRecipe: addRecipe,
            updateRecipe: updateRecipe,
            deleteRecipe: deleteRecipe

          };

          // Creates the database or opens if it already exists
          function initDB() {

            db = new PouchDB('recipes', {adapter: 'websql'});

          };

          // add a new recipe
          function addRecipe(recipe) {
            return $q.when(db.post(recipe));
          };

          // update an existing recipe
          function updateRecipe(recipe) {
            return $q.when(db.put(recipe));
          };

          // deleting a recipe
          function deleteRecipe(recipe) {
            return $q.when(db.remove(recipe));
          };

          // getting all recipes
          function getAllRecipes() {
                if (!recipes) {
                    return $q.when(db.allDocs({ include_docs: true}))

                    .then(function(docs) {

                    // Each row has a .doc object and we just want to send an
                    // array of recipe objects back to the calling controller,
                    // so let's map the array to contain just the .doc objects.
                    recipes = docs.rows.map(function(row) {

                      return row.doc;

                    });

                    // Listen for changes on the database.
                    db.changes({ live: true, since: 'now', include_docs: true})
                      .on('change', onDatabaseChange);

                    return recipes;

                    });

                } else {

                     // Return cached data as a promise
                     return $q.when(recipes);
                  }
          };

          function onDatabaseChange(change) {

            var index = findIndex(recipes, change.id);
            var recipe = recipes[index];

            if (change.deleted) {

                if (recipe) {

                    recipes.splice(index, 1); // delete

                }

            } else {

                if (recipe && recipe._id === change.id) {

                    recipes[index] = change.doc; // update

                } else {

                    recipes.splice(index, 0, change.doc) // insert

                }
            }
          }

          // Binary search, the array is by default sorted by _id.
          function findIndex(array, id) {

            var low = 0, high = array.length, mid;

            while (low < high) {

              mid = (low + high) >>> 1;

              array[mid]._id < id ? low = mid + 1 : high = mid

            }
          return low;
          }
  }

})();

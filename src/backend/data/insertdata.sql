# Run each to insert the data into the postgres database
# Connect with psql "DATABASE_URL"
# Run the each SQL command in the terminal MUST BE ONE LINE
# All duplicate must be removed because \COPY doesn't support 
# the ON CONFLICT keyword

# Already inserted data successfully
\COPY Ingredient (Name) FROM 'C:/Users/ln167/Documents/School/COSC612/Code/Flavor-Formula/old/backend/data/master_ingredients_preprocessed.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL 'NULL');
\COPY Recipe (Title, MeasurementIngredient, Directions) FROM 'C:/Users/ln167/Documents/School/COSC612/Code/Flavor-Formula/old/backend/data/master_recipes.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL 'NULL');
\COPY RecipeIngredients (RecipeID, IngredientID) FROM 'C:/Users/ln167/Documents/School/COSC612/Code/Flavor-Formula/old/backend/data/RecipeIngredients_INSERT.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL 'NULL');

# Need to insert data
\COPY Tags (Name)
FROM 'C:/Users/ln167/Documents/School/COSC612/Code/Flavor-Formula/old/backend/Tags.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL 'NULL');

\COPY IngredientTags (TagID, IngredientID)
FROM 'C:/Users/ln167/Documents/School/COSC612/Code/Flavor-Formula/old/backend/IngredientTags.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL 'NULL');


\COPY RecipeTags (TagID, RecipeID)
FROM 'C:/Users/ln167/Documents/School/COSC612/Code/Flavor-Formula/old/backend/RecipeTags.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',', NULL 'NULL');
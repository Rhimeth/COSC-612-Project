CREATE TABLE AppUser (
  AppUserID SERIAL PRIMARY KEY,
  Username varchar(255) NOT NULL,
  Password varchar(255) NOT NULL,
  Email varchar(255) NOT NULL,
  Created_At date
);

CREATE TABLE SearchHistory (
  SearchID SERIAL PRIMARY KEY,
  AppUserID int REFERENCES AppUser(AppUserID),
  SearchTerm varchar(50),
  LLMSearch text,
  LLMSearchResult text
);

CREATE TABLE Tags (
  TagID SERIAL PRIMARY KEY,
  Name varchar(50)
);

CREATE TABLE Recipe (
  RecipeID SERIAL PRIMARY KEY,
  Directions text,
  MeasurementIngredient text,
  Title text
);

CREATE TABLE Ingredient (
  IngredientID SERIAL PRIMARY KEY,
  Name varchar(50)
);

CREATE TABLE RecipeIngredients (
  RecipeID int REFERENCES Recipe(RecipeID),
  IngredientID int REFERENCES Ingredient(IngredientID),
  PRIMARY KEY (RecipeID, IngredientID)
);

CREATE TABLE IngredientTags (
  TagID int REFERENCES Tags(TagID),
  IngredientID int REFERENCES Ingredient(IngredientID),
  PRIMARY KEY (TagID, IngredientID)
);

CREATE TABLE Favorites (
  AppUserID int REFERENCES AppUser(AppUserID),
  RecipeID int REFERENCES Recipe(RecipeID),
  Favorited_At date,
  PRIMARY KEY (AppUserID, RecipeID)
);

CREATE TABLE UserRecipes (
  AppUserID int REFERENCES AppUser(AppUserID),
  RecipeID int REFERENCES Recipe(RecipeID),
  Uploaded_At date,
  PRIMARY KEY (AppUserID, RecipeID)
);
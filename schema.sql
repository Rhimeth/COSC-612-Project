CREATE TABLE AppUser (
  AppUserID int PRIMARY KEY,
  Username varchar(255) NOT NULL,
  Password varchar(255) NOT NULL,
  Created_At date
);

CREATE TABLE SearchHistory (
  SearchID int PRIMARY KEY,
  AppUserID int REFERENCES AppUser(AppUserID),
  SearchTerm varchar(50),
  LLMSearch text,
  LLMSearchResult text
);

CREATE TABLE Tags (
  TagID int PRIMARY KEY,
  Name varchar(50)
);

CREATE TABLE Recipe (
  RecipeID int PRIMARY KEY,
  Directions text,
  Description text,
  Title varchar(50)
);

CREATE TABLE RecipeTags (
  TagID int REFERENCES Tags(TagID),
  RecipeID int REFERENCES Recipe(RecipeID),
  PRIMARY KEY (TagID, RecipeID)
);

CREATE TABLE Ingredient (
  IngredientID int PRIMARY KEY,
  Name varchar(50)
);

CREATE TABLE RecipeIngredients (
  RecipeID int REFERENCES Recipe(RecipeID),
  IngredientID int REFERENCES Ingredient(IngredientID),
  Measurement varchar(20),
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
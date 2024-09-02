import Collection from "../models/collection.schema.json";
import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";

/***********************************************************************
 * @CREATE_COLLECTION
 * @REQUEST_TYPE
 * @route https://localhost:4000/api/collection
 * @description Check for token populate req.user
 * @parameter
 * @returns User Object
 ************************************************************************/

export const createCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new CustomError("Collection Name is Required", 400);
  }
  const collection = await Collection.create({ name });
  res.status(200).json({
    success: true,
    message: "Collection Created with Success",
    collection,
  });
});

export const updateCollection = asyncHandler(async (req, res) => {
  //existing value to update
  const { id: collectionId } = req.params;
  //new value to update
  const { name } = req.body;
  if (!name) {
    throw new CustomError("Collection Name is Required", 400);
  }
  let updatedCollection = await Collection.findByIdAndUpdate(
    collectionId,
    {
      name,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updateCollection) {
    throw new CustomError("Collection Not Found", 400);
  }
  res.status(200).json({
    success: true,
    message: "Collection updated successfully",
    updatedCollection,
  });
});

export const deleteCollection = asyncHandler(async (req, res) => {
  const { id: collectionId } = req.params;
  const collectionToDelete = await Collection.findByIdAndDelete(collectionId);
  if (!collectionToDelete) {
    throw new CustomError("Collection is not found", 400);
  }
  collectionToDelete.remove();
  res.status(200).json({
    success: true,
    message: "Collection is deleted Successfully",
  });
});

export const getAllCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find();
  if (!collections) {
    throw new CustomError("No Collections Found", 400);
  }
  res.status(200).json({
    success: true,
    collections,
  });
});

import Property from "../../../shared/models/property.js";

// CREATE
export const createProperty = async (data) => {
  return await Property.create(data);
};

// GET ALL
export const getAllProperties = async () => {
  return await Property.find().sort({ createdAt: -1 });
};

// GET BY ID
export const getPropertyById = async (id) => {
  return await Property.findById(id);
};

// UPDATE
export const updateProperty = async (id, data) => {
  return await Property.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// DELETE
export const deleteProperty = async (id) => {
  return await Property.findByIdAndDelete(id);
};

import * as propertyService from "../services/Property.service.js";
import ApiError from "../../../shared/utils/ApiError.js"
import User from "../../../shared/models/User.js";
// Create Property
export const createProperty = async (req, res) => {
  try {
    // const agentId = req.loggedInUser._id;
    // console.log("Logged in seller:", req.loggedInUser);

    // const propertyData = {
    //   ...req.body,
    //   agentId,
    // };
    let agentId;

    if (req.loggedInUser.role === "seller") {
      // Seller creating property → use their own ID
      agentId = req.loggedInUser._id;
    } else if (req.loggedInUser.role === "admin") {
      // Admin creating property → must provide agentId in body
      agentId = req.body.agentId;
      if (!agentId) {
        return res.status(400).json({
          success: false,
          message: "Admin must provide an agentId",
        });
      }
    }
     // Verify the agent exists and has seller role
    const user = await User.findById(agentId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Assigned agent not found",
      });
    }
    if (user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Assigned user must have role 'seller'",
      });
    }

    const propertyData = {
      ...req.body,
      agentId,
    };


    const property = await propertyService.createProperty(propertyData);
    res.status(201).json({ success: true, data: property });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to create property, Please check your input" });
  }
};

// Get All Properties
export const getAllProperties = async (req, res) => {
  try {
    const properties = await propertyService.getAllProperties();
    res.status(200).json({ success: true, data: properties });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to retrieve properties" });
  }
};

// Get Property by ID
export const getPropertyById = async (req, res) => {
   try {
    const property = await propertyService.getPropertyById(req.params.id);

    if (!property)
      return res.status(404).json({ success: false, message: "Property not found" });

    res.status(200).json({ success: true, data: property });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid property ID or unable to retrieve property." });
  }

};

// Update Property
/*export const updateProperty = async (req, res) => {
  if (!property) return next(new ApiError(404, "Property not found"));

  res.status(200).json({ success: true, data: property });
};*/

export const updateProperty = async (req, res) => {
  const { id } = req.params;

  const property = await propertyService.updateProperty(id, req.body);

  if (!property) {
    return res
      .status(404)
      .json({ success: false, message: "Property not found" });
  }

  res.status(200).json({
    success: true,
    message: "Property updated successfully",
    data: property,
  });
};


// Delete Property
/*export const deleteProperty = async (req, res) => {
   if (!property) return next(new ApiError(404, "Property not found"));

  res.status(200).json({ success: true, message: "Property deleted" });
};*/

export const deleteProperty = async (req, res) => {
  const { id } = req.params;

  const property = await propertyService.deleteProperty(id);

  if (!property) {
    return res
      .status(404)
      .json({ success: false, message: "Property not found" });
  }

  res.status(200).json({
    success: true,
    message: "Property deleted successfully",
  });
};




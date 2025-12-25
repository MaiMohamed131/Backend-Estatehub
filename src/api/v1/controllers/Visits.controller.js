import asyncHandler from "../../../shared/utils/asyncHandler.js";
import visitsService from "../services/Visits.service.js";

export const getUserVisits = asyncHandler(async (req, res) => {
  const userId = req.loggedInUser._id;

  const visits = await visitsService.getUserVisits(userId);

  res.status(200).json({
    success: true,
    count: visits.length,
    data: visits
  });
});

export const addVisit = asyncHandler(async (req, res) => {
  const userId = req.loggedInUser._id;
  const visitData = req.body;

  const visit = await visitsService.addVisit(userId, visitData);

  res.status(201).json({
    success: true,
    message: "Visit scheduled successfully",
    data: visit
  });
});

export const updateVisitStatus = asyncHandler(async (req, res) => {
  const userId = req.loggedInUser._id;
  const { visitId } = req.params;
  const { status } = req.body;

  const visit = await visitsService.updateVisitStatus(
    userId,
    visitId,
    status
  );

  res.status(200).json({
    success: true,
    message: "Visit status updated successfully",
    data: visit
  });
});

export const deleteVisit = asyncHandler(async (req, res) => {
  const userId = req.loggedInUser._id;
  const { visitId } = req.params;

  const visit = await visitsService.deleteVisit(userId, visitId);

  res.status(200).json({
    success: true,
    message: "Visit deleted successfully",
    data: visit
  });
});













// import Visit from "../../../shared/models/Visits.js";
// import mongoose from "mongoose";
// import asyncHandler from "../../../shared/utils/asyncHandler.js";
// import ApiError from "../../../shared/utils/ApiError.js";


// export const getUserVisits = asyncHandler(async (req, res) => {
//   const userId = req.loggedInUser._id; // Get from authenticated user
  
//   const visits = await Visit.find({ userId }).sort({ date: 1, time: 1 });

//   res.status(200).json({ 
//     count: visits.length,
//     data: visits 
//   });
// });

// // Add a new visit
// export const addVisit = asyncHandler(async (req, res) => {
//   const userId = req.loggedInUser._id; // Fixed from req.user.id
//   const { propertyName, date, time, status } = req.body;

//   if (!propertyName || !date || !time) {
//     throw new ApiError(400, "propertyName, date, and time are required");
//   }

//   // Optional: Validate date format (YYYY-MM-DD)
//   const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//   if (!dateRegex.test(date)) {
//     throw new ApiError(400, "Date must be in YYYY-MM-DD format");
//   }

//   // Optional: Validate time format (HH:MM)
//   const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
//   if (!timeRegex.test(time)) {
//     throw new ApiError(400, "Time must be in HH:MM format (24-hour)");
//   }

//   const visit = await Visit.create({
//     userId,
//     propertyName,
//     date,
//     time,
//     status: status || "pending",
//   });

//   res.status(201).json({ 
//     message: "Visit scheduled successfully", 
//     visit 
//   });
// });


// export const updateVisitStatus = asyncHandler(async (req, res) => {
//   const userId = req.loggedInUser._id;
//   const { visitId } = req.params;
//   const { status } = req.body;

//   if (!status) {
//     throw new ApiError(400, "Status is required");
//   }

//   // Validate status value
//   const validStatuses = ["pending", "upcoming", "completed", "cancelled"];
//   if (!validStatuses.includes(status)) {
//     throw new ApiError(400, `Status must be one of: ${validStatuses.join(", ")}`);
//   }

//   // Validate ObjectId
//   if (!mongoose.Types.ObjectId.isValid(visitId)) {
//     throw new ApiError(400, "Invalid visit ID format");
//   }

  
//   const visit = await Visit.findOne({ _id: visitId, userId });

//   if (!visit) {
//     throw new ApiError(404, "Visit not found or you don't have permission to update it");
//   }

//   // Update the visit
//   visit.status = status;
//   await visit.save();

//   res.status(200).json({ 
//     message: "Visit status updated successfully", 
//     visit 
//   });
// });

// // Delete a visit (only owner can delete)
// export const deleteVisit = asyncHandler(async (req, res) => {
//   const userId = req.loggedInUser._id;
//   const { visitId } = req.params;

//   // Validate ObjectId
//   if (!mongoose.Types.ObjectId.isValid(visitId)) {
//     throw new ApiError(400, "Invalid visit ID format");
//   }

//   // Find and delete only if user owns it
//   const visit = await Visit.findOneAndDelete({ 
//     _id: visitId, 
//     userId 
//   });

//   if (!visit) {
//     throw new ApiError(404, "Visit not found or you don't have permission to delete it");
//   }

//   res.status(200).json({ 
//     message: "Visit deleted successfully", 
//     visit 
//   });
// });














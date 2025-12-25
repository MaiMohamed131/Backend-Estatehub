import Visit from "../../../shared/models/Visits.js";
import ApiError from "../../../shared/utils/ApiError.js";
import mongoose from "mongoose";

const getUserVisits = async (userId) => {
  return await Visit.find({ userId }).sort({ date: 1, time: 1 });
};

const addVisit = async (userId, visitData) => {
  const { propertyName, date, time, status } = visitData;

  if (!propertyName || !date || !time) {
    throw new ApiError(400, "propertyName, date, and time are required");
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    throw new ApiError(400, "Date must be in YYYY-MM-DD format");
  }

  // Validate time format (HH:MM)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(time)) {
    throw new ApiError(400, "Time must be in HH:MM format (24-hour)");
  }

  return await Visit.create({
    userId,
    propertyName,
    date,
    time,
    status: status || "pending"
  });
};

const updateVisitStatus = async (userId, visitId, status) => {
  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  const validStatuses = ["pending", "upcoming", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(
      400,
      `Status must be one of: ${validStatuses.join(", ")}`
    );
  }

  if (!mongoose.Types.ObjectId.isValid(visitId)) {
    throw new ApiError(400, "Invalid visit ID format");
  }

  const visit = await Visit.findOne({ _id: visitId, userId });

  if (!visit) {
    throw new ApiError(
      404,
      "Visit not found or you don't have permission to update it"
    );
  }

  visit.status = status;
  await visit.save();

  return visit;
};

const deleteVisit = async (userId, visitId) => {
  if (!mongoose.Types.ObjectId.isValid(visitId)) {
    throw new ApiError(400, "Invalid visit ID format");
  }

  const visit = await Visit.findOneAndDelete({
    _id: visitId,
    userId
  });

  if (!visit) {
    throw new ApiError(
      404,
      "Visit not found or you don't have permission to delete it"
    );
  }

  return visit;
};

export default {
  getUserVisits,
  addVisit,
  updateVisitStatus,
  deleteVisit
};

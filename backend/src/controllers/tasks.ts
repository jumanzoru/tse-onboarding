import TaskModel from "src/models/task";

import type { RequestHandler } from "express";

export const getAllTasks: RequestHandler = async (req, res, next) => {
  try {
    const tasks = await TaskModel.find().sort({ dateCreated: -1 }).populate("assignee");
    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

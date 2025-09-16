import mongoose from "mongoose";

interface EndpointConfig {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
  responseData: any;
  statusCode: number;
  delay: number;
  notFoundResponse: any;
}
export interface ProjectType extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  projectName: string;
  endpoints: EndpointConfig[];
  resources: any;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  projectName: {
    type: String,
    required: true,
    trim: true,
  },

  // Array of endpoint configurations
  endpoints: [
    {
      // Endpoint path, can include path parameters like '/products/:id'
      path: {
        type: String,
        required: true,
      },

      // HTTP method: GET, POST, PUT, DELETE, etc.
      method: {
        type: String,
        enum: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        uppercase: true,
        required: true,
      },

      // The JSON response data to be returned
      responseData: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },

      statusCode: {
        type: Number,
        required: true,
        default: 200,
      },

      // Optional delay in milliseconds to simulate network latency
      delay: {
        type: Number,
        default: 0,
      },

      // Optional field for a custom 404 response
      notFoundResponse: {
        type: mongoose.Schema.Types.Mixed,
      },
    },
  ],

  // This object will store the data for CRUD operations
  resources: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ProjectModel = mongoose.model<ProjectType>("Projects", projectSchema);

export default ProjectModel;

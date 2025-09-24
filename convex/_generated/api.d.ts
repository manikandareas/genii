/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as admin_assets_mutations from "../admin/assets/mutations.js";
import type * as admin_assets_queries from "../admin/assets/queries.js";
import type * as admin_chapters_mutations from "../admin/chapters/mutations.js";
import type * as admin_chapters_queries from "../admin/chapters/queries.js";
import type * as admin_courses_mutations from "../admin/courses/mutations.js";
import type * as admin_courses_queries from "../admin/courses/queries.js";
import type * as admin_lessons_mutations from "../admin/lessons/mutations.js";
import type * as admin_lessons_queries from "../admin/lessons/queries.js";
import type * as admin_quizzes_mutations from "../admin/quizzes/mutations.js";
import type * as admin_quizzes_queries from "../admin/quizzes/queries.js";
import type * as admin_topics_mutations from "../admin/topics/mutations.js";
import type * as admin_topics_queries from "../admin/topics/queries.js";
import type * as http from "../http.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "admin/assets/mutations": typeof admin_assets_mutations;
  "admin/assets/queries": typeof admin_assets_queries;
  "admin/chapters/mutations": typeof admin_chapters_mutations;
  "admin/chapters/queries": typeof admin_chapters_queries;
  "admin/courses/mutations": typeof admin_courses_mutations;
  "admin/courses/queries": typeof admin_courses_queries;
  "admin/lessons/mutations": typeof admin_lessons_mutations;
  "admin/lessons/queries": typeof admin_lessons_queries;
  "admin/quizzes/mutations": typeof admin_quizzes_mutations;
  "admin/quizzes/queries": typeof admin_quizzes_queries;
  "admin/topics/mutations": typeof admin_topics_mutations;
  "admin/topics/queries": typeof admin_topics_queries;
  http: typeof http;
  "users/mutations": typeof users_mutations;
  "users/queries": typeof users_queries;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

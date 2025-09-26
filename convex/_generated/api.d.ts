/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin_assets_mutations from "../admin/assets/mutations.js";
import type * as admin_assets_queries from "../admin/assets/queries.js";
import type * as admin_chapters_mutations from "../admin/chapters/mutations.js";
import type * as admin_chapters_queries from "../admin/chapters/queries.js";
import type * as admin_courses_actions from "../admin/courses/actions.js";
import type * as admin_courses_mutations from "../admin/courses/mutations.js";
import type * as admin_courses_queries from "../admin/courses/queries.js";
import type * as admin_lessons_mutations from "../admin/lessons/mutations.js";
import type * as admin_lessons_queries from "../admin/lessons/queries.js";
import type * as admin_quizzes_mutations from "../admin/quizzes/mutations.js";
import type * as admin_quizzes_queries from "../admin/quizzes/queries.js";
import type * as admin_topics_mutations from "../admin/topics/mutations.js";
import type * as admin_topics_queries from "../admin/topics/queries.js";
import type * as components_ from "../components.js";
import type * as http from "../http.js";
import type * as lib from "../lib.js";
import type * as users_actions from "../users/actions.js";
import type * as users_courses_queries from "../users/courses/queries.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";
import type * as users_recommendation_actions from "../users/recommendation/actions.js";
import type * as users_recommendation_mutations from "../users/recommendation/mutations.js";
import type * as users_recommendation_queries from "../users/recommendation/queries.js";
import type * as users_recommendation_workflow from "../users/recommendation/workflow.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

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
  "admin/courses/actions": typeof admin_courses_actions;
  "admin/courses/mutations": typeof admin_courses_mutations;
  "admin/courses/queries": typeof admin_courses_queries;
  "admin/lessons/mutations": typeof admin_lessons_mutations;
  "admin/lessons/queries": typeof admin_lessons_queries;
  "admin/quizzes/mutations": typeof admin_quizzes_mutations;
  "admin/quizzes/queries": typeof admin_quizzes_queries;
  "admin/topics/mutations": typeof admin_topics_mutations;
  "admin/topics/queries": typeof admin_topics_queries;
  components: typeof components_;
  http: typeof http;
  lib: typeof lib;
  "users/actions": typeof users_actions;
  "users/courses/queries": typeof users_courses_queries;
  "users/mutations": typeof users_mutations;
  "users/queries": typeof users_queries;
  "users/recommendation/actions": typeof users_recommendation_actions;
  "users/recommendation/mutations": typeof users_recommendation_mutations;
  "users/recommendation/queries": typeof users_recommendation_queries;
  "users/recommendation/workflow": typeof users_recommendation_workflow;
  utils: typeof utils;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  workflow: {
    journal: {
      load: FunctionReference<
        "query",
        "internal",
        { workflowId: string },
        {
          journalEntries: Array<{
            _creationTime: number;
            _id: string;
            step: {
              args: any;
              argsSize: number;
              completedAt?: number;
              functionType: "query" | "mutation" | "action";
              handle: string;
              inProgress: boolean;
              name: string;
              runResult?:
                | { kind: "success"; returnValue: any }
                | { error: string; kind: "failed" }
                | { kind: "canceled" };
              startedAt: number;
              workId?: string;
            };
            stepNumber: number;
            workflowId: string;
          }>;
          logLevel: "DEBUG" | "TRACE" | "INFO" | "REPORT" | "WARN" | "ERROR";
          ok: boolean;
          workflow: {
            _creationTime: number;
            _id: string;
            args: any;
            generationNumber: number;
            logLevel?: any;
            name?: string;
            onComplete?: { context?: any; fnHandle: string };
            runResult?:
              | { kind: "success"; returnValue: any }
              | { error: string; kind: "failed" }
              | { kind: "canceled" };
            startedAt?: any;
            state?: any;
            workflowHandle: string;
          };
        }
      >;
      startStep: FunctionReference<
        "mutation",
        "internal",
        {
          generationNumber: number;
          name: string;
          retry?:
            | boolean
            | { base: number; initialBackoffMs: number; maxAttempts: number };
          schedulerOptions?: { runAt?: number } | { runAfter?: number };
          step: {
            args: any;
            argsSize: number;
            completedAt?: number;
            functionType: "query" | "mutation" | "action";
            handle: string;
            inProgress: boolean;
            name: string;
            runResult?:
              | { kind: "success"; returnValue: any }
              | { error: string; kind: "failed" }
              | { kind: "canceled" };
            startedAt: number;
            workId?: string;
          };
          workflowId: string;
          workpoolOptions?: {
            defaultRetryBehavior?: {
              base: number;
              initialBackoffMs: number;
              maxAttempts: number;
            };
            logLevel?: "DEBUG" | "TRACE" | "INFO" | "REPORT" | "WARN" | "ERROR";
            maxParallelism?: number;
            retryActionsByDefault?: boolean;
          };
        },
        {
          _creationTime: number;
          _id: string;
          step: {
            args: any;
            argsSize: number;
            completedAt?: number;
            functionType: "query" | "mutation" | "action";
            handle: string;
            inProgress: boolean;
            name: string;
            runResult?:
              | { kind: "success"; returnValue: any }
              | { error: string; kind: "failed" }
              | { kind: "canceled" };
            startedAt: number;
            workId?: string;
          };
          stepNumber: number;
          workflowId: string;
        }
      >;
    };
    workflow: {
      cancel: FunctionReference<
        "mutation",
        "internal",
        { workflowId: string },
        null
      >;
      cleanup: FunctionReference<
        "mutation",
        "internal",
        { workflowId: string },
        boolean
      >;
      complete: FunctionReference<
        "mutation",
        "internal",
        {
          generationNumber: number;
          runResult:
            | { kind: "success"; returnValue: any }
            | { error: string; kind: "failed" }
            | { kind: "canceled" };
          workflowId: string;
        },
        null
      >;
      create: FunctionReference<
        "mutation",
        "internal",
        {
          maxParallelism?: number;
          onComplete?: { context?: any; fnHandle: string };
          startAsync?: boolean;
          workflowArgs: any;
          workflowHandle: string;
          workflowName: string;
        },
        string
      >;
      getStatus: FunctionReference<
        "query",
        "internal",
        { workflowId: string },
        {
          inProgress: Array<{
            _creationTime: number;
            _id: string;
            step: {
              args: any;
              argsSize: number;
              completedAt?: number;
              functionType: "query" | "mutation" | "action";
              handle: string;
              inProgress: boolean;
              name: string;
              runResult?:
                | { kind: "success"; returnValue: any }
                | { error: string; kind: "failed" }
                | { kind: "canceled" };
              startedAt: number;
              workId?: string;
            };
            stepNumber: number;
            workflowId: string;
          }>;
          logLevel: "DEBUG" | "TRACE" | "INFO" | "REPORT" | "WARN" | "ERROR";
          workflow: {
            _creationTime: number;
            _id: string;
            args: any;
            generationNumber: number;
            logLevel?: any;
            name?: string;
            onComplete?: { context?: any; fnHandle: string };
            runResult?:
              | { kind: "success"; returnValue: any }
              | { error: string; kind: "failed" }
              | { kind: "canceled" };
            startedAt?: any;
            state?: any;
            workflowHandle: string;
          };
        }
      >;
    };
  };
};

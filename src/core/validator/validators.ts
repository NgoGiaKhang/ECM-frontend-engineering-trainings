import type { Rule } from "./types";

export const required =
  (message = "This field is required"): Rule =>
  (value) => {
    if (value === undefined || value === null || value === "") {
      return message;
    }

    if (Array.isArray(value) && value.length === 0) {
      return message;
    }

    return undefined;
  };

export const url =
  (message = "Invalid URL"): Rule =>
  (value) => {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }

    if (typeof value !== "string") {
      return message;
    }

    try {
      new URL(value);

      return undefined;
    } catch {
      return message;
    }
  };

export const minLength =
  (min: number, message = `Minimum ${min} characters`): Rule =>
  (value) => {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }

    if (String(value).trim().length < min) {
      return message;
    }

    return undefined;
  };

export const minNumber =
  (min: number, message = `Minimum value is ${min}`): Rule =>
  (value) => {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }

    const number = Number(value);

    if (Number.isNaN(number) || number < min) {
      return message;
    }

    return undefined;
  };

export const maxNumber =
  (max: number, message = `Maximum value is ${max}`): Rule =>
  (value) => {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }

    const number = Number(value);

    if (Number.isNaN(number) || number > max) {
      return message;
    }

    return undefined;
  };

export const email =
  (message = "Invalid email address"): Rule =>
  (value) => {
    if (value === undefined || value === null || value === "") {
      return undefined;
    }

    if (typeof value !== "string") {
      return message;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      return message;
    }

    return undefined;
  };
